"use strict";

let random_view = document.querySelector("#random_view");
let search_view = document.querySelector("#search_view");
let create_view = document.querySelector("#create_view");

let CURRENT_VIEW = random_view;

const API_URL = "http://localhost:3000";

function showAlert(type, message) {
  const alertHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  document
    .getElementById("alert-container")
    .insertAdjacentHTML("beforeend", alertHTML);
}

function switch_view(view) {
  CURRENT_VIEW.style = "display: none";
  CURRENT_VIEW = view;
  view.style.display = "";
}

let CURRENT_RANDOM_RECIPE_ID = null;

async function get_random_recipe() {
  await fetch("http://localhost:3000/api/recipe/random")
    .then((res) => res.json())
    .then((body) => {
      document.querySelector("#recipe_title").innerHTML = body["dish_name"];
      let ingredients = body["ingredients"];
      document.querySelector(
        "#recipe_description"
      ).innerHTML = `${body["description"]}`;

      let recipe_img_link = document.querySelector("#recipe_img_elem");
      if (body["image_path"] === null) {
        recipe_img_link.src = `/imgs/404.webp`;
      } else {
        recipe_img_link.src = `/api/recipe/img/${body["image_path"]}`;
      }

      CURRENT_RANDOM_RECIPE_ID = body["id"];
    })
    .catch((error) => {
      console.log(error);
      showAlert(
        "warning",
        "Hey, sorry about that, there seems to be a problem with our servers :)"
      );
    });
}

let ingredient_count = 1;

function add_ingredient() {
  ingredient_count += 1;
  let html_str = `<input type="text" name="ingredient${ingredient_count}" class="form-control mt-2" id="ingredientsInput${ingredient_count}">`;
  document
    .getElementById("ingredients_input_list")
    .insertAdjacentHTML("beforeend", html_str);
}

let instruction_count = 1;

function add_instruction() {
  instruction_count += 1;
  let html_str = `<input type="text" name="instruction${instruction_count}" class="form-control mt-2" id=\"instructionsInput${instruction_count}\">`;
  document
    .getElementById("instructions_input_list")
    .insertAdjacentHTML("beforeend", html_str);
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
  let sdescription = "";

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
    } else if (lowerKey === "description") {
      sdescription = value;
    }
  }

  let final_obj = {
    author: sauthor,
    dish_name: dishName,
    ingredients: singredients,
    instructions: sinstructions,
    description: sdescription,
  };

  const blob = JSON.stringify(final_obj, { type: "application/json" });

  const data = new FormData();
  data.append("json", blob);
  data.append("recipe_img", imageFile);

  console.log(data);

  fetch("/api/recipe/create", {
    method: "POST",
    body: data,
  })
    .then((res) => res.json())
    .then((body) => {
      if (body["code"] === 200) {
        form.reset();
        showAlert("success", "Thank you for submitting your recipe!");
      }
    })
    .catch((err) => {
      console.log("hit");
      showAlert("warning");
    });
});

window.onload = get_random_recipe;
window.addEventListener("offline", (e) => {
  showAlert(
    "danger",
    "It seems like there are some issues with your network. We'll let you know when you're back online"
  );
});

window.addEventListener("online", (e) => {
  showAlert("success", "You're back online! You can continue using Nibble!");
});

function construct_search_cards(results_arr) {
  let search_results_div = document.getElementById("search-results");
  if (results_arr.length == 0 || results_arr === undefined) {
    search_results_div.innerHTML = `<h3 class="text-center">It seems like there aren't any recipes with this name</h3>`;
  } else {
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
        <div class="card" onclick=showRecipeView(${result["id"]})>
          <div class="row g-0 align-items-center">
            <!-- Image Section -->
            <div class="col-auto">
              <img
                src="${image_path}"
                class="img-fluid rounded-start card-img-left"
                alt="Card Image"
              />
            </div>
            <!-- Information Section -->
            <div class="col-md-8">
              <div class="card-body">
                <h5 class="card-title">${result["dish_name"]}</h5>
                <p class="card-text">${result["description"]}</p>
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
      .then((response) => construct_search_cards(response))
      .catch((err) => {
        console.log(err);
        showAlert(
          "warning",
          "Hey, sorry about that, there seems to be a problem with our servers :)"
        );
      });
  });

async function update_comments(id) {
  await fetch(`/api/comment/get?id=${id}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("modalCommentsResult").innerHTML = "";

      console.log(res);
      for (const message of res) {
        document.getElementById(
          "modalCommentsResult"
        ).innerHTML += `<div class="row mx-2 my-2 py-3 border align-middle">
                <div class="comment align-middle">${message["message"]}</div>
              </div>`;
      }
    })
    .catch((err) => {
      console.error(err);
      showAlert(
        "warning",
        "Hey, sorry about that, there seems to be a problem with our servers :)"
      );
    });
}

function submitComment(in_id) {
  console.log(document.getElementById("modalCommentTxt").value);
  fetch("/api/comment/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipe_id: in_id,
      message: document.getElementById("modalCommentTxt").value,
    }),
  })
    .then((res) => res.json())
    .then((body) => {
      if (body["code"] === 200) {
        showAlert(
          "success",
          "Your comment has successfully been added to this recipe!"
        );
        document.getElementById("modalCommentForm").reset();
        // update comments view
        update_comments(in_id);
      }
    })
    .catch((err) => {
      showAlert(
        "warning",
        "Hey, sorry about that, there seems to be a problem with our servers :)"
      );
    });
}

function showRecipeView(recipe_id) {
  update_comments(recipe_id);

  // Listen for comment submission
  document.getElementById("modalCommentForm").onsubmit = (event) => {
    event.preventDefault();
    submitComment(recipe_id);
  };

  // Fetch the recipe data
  fetch(`/api/recipe/get?recipe_id=${recipe_id}`, {
    method: "GET",
    headers: { Accept: "application/json" },
  })
    .then((res) => res.json())
    .then((res) => {
      document.getElementById("cardModalTitle").textContent = res["dish_name"];
      document.getElementById("recipeModalDesc").textContent =
        res["description"];
      document.getElementById(
        "recipeModalAuthor"
      ).textContent = `~ ${res["author"]}`;

      let img_path = "";
      const recipeModalImg = document.getElementById("recipeModalImg");
      const modalImgUpload = document.getElementById("modalImgUpload");

      // Clone the old recipeModalImage to newRecipeModalImg to remove all event listeners
      recipeModalImg.replaceWith(recipeModalImg.cloneNode(true));
      const newRecipeModalImg = document.getElementById("recipeModalImg");

      if (res["image_path"] === null) {
        img_path = "/imgs/404.webp";

        newRecipeModalImg.style.cursor = "pointer";
        newRecipeModalImg.addEventListener("click", () => {
          modalImgUpload.click();
        });

        modalImgUpload.addEventListener("change", (event) => {
          const file = event.target.files[0];
          if (file) {
            const formData = new FormData();
            formData.append("recipe_img", file);

            fetch(`/api/recipe/img/add?id=${recipe_id}`, {
              method: "POST",
              body: formData,
            })
              .then((res) => res.json())
              .then((data) => {
                if (data["code"] === 200) {
                  const reader = new FileReader();
                  reader.onload = function (e) {
                    newRecipeModalImg.src = e.target.result;
                  };
                  reader.readAsDataURL(file);
                } else {
                  showAlert(
                    "warning",
                    "Something went wrong uploading the image."
                  );
                }
              })
              .catch((err) => {
                console.error(err);
                showAlert(
                  "warning",
                  "Problem contacting server while uploading the image."
                );
              });
          }
        });
      } else {
        img_path = `/api/recipe/img/${res["image_path"]}`;
        newRecipeModalImg.style.cursor = "default";
      }

      newRecipeModalImg.src = img_path;

      const ingredientsList = document.getElementById("modalIngredientsList");
      ingredientsList.innerHTML = "";
      for (const ingredient of res["ingredients"]) {
        ingredientsList.innerHTML += `<li>${ingredient}</li>`;
      }

      const instructionsList = document.getElementById("modalInstructionsList");
      instructionsList.innerHTML = "";
      for (const instruction of res["instructions"]) {
        instructionsList.innerHTML += `<li>${instruction}</li>`;
      }

      const modal = new bootstrap.Modal(document.getElementById("cardModal"));
      modal.show();
    })
    .catch((err) => {
      console.error(err);
      showAlert(
        "warning",
        "Hey, sorry about that, there seems to be a problem with our servers :)"
      );
    });
}
