"use strict";

let random_view = document.querySelector("#random_view");
let search_view = document.querySelector("#search_view");
let create_view = document.querySelector("#create_view");

let CURRENT_VIEW = random_view;

const API_URL = "http://localhost:3000";

const error_messages = {
  SERVER_ERROR: `<div class="message">
      <div
        class="inner-message alert alert-danger alert-dismissible fade show"
        role="alert"
      >
        <strong>Server Connection Error:</strong> Hey, sorry about that, there
        seems to be a problem with our servers :)
        <button
          type="button"
          class="btn-close"
          data-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </div>`,
  BACK_ONLINE: `<div class="message">
      <div
        class="inner-message alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        <strong>Network Error:</strong> There seems to be a problem with your
        network. Please check your connection :)
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
    </div>`,
  OFFLINE: ``,
};

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

      let recipe_img_link = document.querySelector("#recipe_img_elem");
      if (body["image_path"] === null) {
        recipe_img_link.src = `/imgs/404.webp`;
      } else {
        recipe_img_link.src = `/api/recipe/img/${body["image_path"]}`;
      }
    })
    .catch((error) => {
      console.log(error);
      document.body.innerHTML += error_messages["SERVER_ERROR"];
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
    .then((res) => console.log(res))
    .then((body) => {
      console.log(body);
    });
});

window.onload = get_random_recipe;
window.addEventListener("offline", (e) => {
  document.body.innerHTML += error_messages[0];
});

window.addEventListener("online", (e) => {
  document.body.innerHTML += error_messages[1];
});

function construct_search_cards(results_arr) {
  let search_results_div = document.getElementById("search-results");
  search_results_div.innerHTML = "";
  for (const result of results_arr) {
    console.log(result);
    // Get the image path for the result

    let image_path = "";
    if (result["image_path"] === null) {
      image_path = "/imgs/404.webp";
    } else {
      image_path = `/api/recipe/img/${result["image_path"]}`;
    }

    let card_template = `      
  <div class="container mt-5">
        <div class="card">
          <div class="row g-0 align-items-center">
            <!-- Image Section -->
            <div class="col-md-4">
              <img
                src="${image_path}"
                class="img-fluid rounded-start"
                alt="Card Image"
              />
            </div>
            <!-- Information Section -->
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${result["dish_name"]}</h5>
                <p class="card-text">
                  This is a short description about the content of the card. It
                  gives a brief overview of the information on the card.
                </p>
                <p class="card-text">
                  <small class="text-muted">~ ${result["author"]}</small>
                </p>
                <a href="#" class="btn btn-primary">Learn More</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;

    search_results_div.innerHTML += card_template;
  }
}

document
  .getElementById("search-value")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    let input_value = document.getElementById("search-bar").value;
    console.log(input_value);

    fetch(
      `http://localhost:3000/api/recipe/search?key=${input_value}&field=dish_name`,
      {
        method: "GET",
        headers: { Accept: "application/json" },
      }
    )
      .then((res) => res.json())
      .then((response) => construct_search_cards(response));
  });
