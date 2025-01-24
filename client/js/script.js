"use strict";

let random_view = document.querySelector("#random_view");
let search_view = document.querySelector("#search_view");
let create_view = document.querySelector("#create_view");

let CURRENT_VIEW = random_view;

const API_URL = "http://localhost:3000";

function switch_view(view) {
  CURRENT_VIEW.style = "display: none";
  CURRENT_VIEW = view;
  view.style.display = "";
}

function get_random_recipe() {
  fetch("http://localhost:3000/api/recipe/random")
    .then((res) => res.json())
    .then((body) => {
      document.querySelector("#recipe_title").innerHTML = body["dish_name"];
      let ingredients = body["ingredients"];
      let buffer = "";
      for (let ingredient of ingredients) {
        buffer += `<li>${ingredient}</li>`;
      }
      document.querySelector(
        "#recipe_ingredients"
      ).innerHTML = `What you'll need: <ul>${buffer}</ul>`;
    });
}

let ingredient_count = 1;

function add_ingredient() {
  ingredient_count += 1;
  let html_str = `<input type="text" name="ingredient${ingredient_count}" class="form-control mt-2" id="ingredientsInput${ingredient_count}">`;
  document.getElementById("ingredients_input_list").innerHTML += html_str;
}

let instruction_count = 1;

function add_instruction() {
  instruction_count += 1;
  let html_str = `<input type="text" name="instruction${instruction_count}" class="form-control mt-2" id=\"instructionsInput${instruction_count}\">`;
  document.getElementById("instructions_input_list").innerHTML += html_str;
}

let form = document.getElementById("dataForm");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Prepare arrays or variables to hold data
  let imageFile;
  const sinstructions = [];
  const singredients = [];
  let sauthor = "";
  let dishName = "";

  const formData = new FormData(form);

  // Reconstruct form data so that server can accept it
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
    const lowerKey = key.toLowerCase();

    if (lowerKey.startsWith("instruction")) {
      // Any field named instruction1, instruction2, etc. goes into instructions[]
      sinstructions.push(value);
    } else if (lowerKey.startsWith("ingredient")) {
      // Any field named ingredient1, ingredient2, etc. goes into ingredients[]
      singredients.push(value);
    } else if (value instanceof File) {
      // Capture the single image file
      imageFile = new File([value], value.name, { type: value.type });
    } else if (lowerKey === "author") {
      // Author field
      sauthor = value;
    } else if (lowerKey === "dish_name") {
      // Dish name field
      dishName = value;
    }
  }

  let final_obj = {
    author: sauthor,
    dish_name: dishName,
    ingredients: singredients,
    instructions: sinstructions,
  };

  const blob = JSON.stringify(final_obj, { type: "application/json" });

  const data = new FormData();
  data.append("json", blob);
  data.append("recipe_img", imageFile);

  console.log(data);

  fetch("http://localhost:3000/api/recipe/create", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((body) => {
      console.log(body);
    });
});

window.onload = get_random_recipe;
