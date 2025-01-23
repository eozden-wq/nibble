'use strict';

let random_view = document.querySelector('#random_view');
let search_view = document.querySelector('#search_view');
let create_view = document.querySelector('#create_view');

let CURRENT_VIEW = random_view;

const API_URL = "http://localhost:3000"

function switch_view(view) {
  CURRENT_VIEW.style = "display: none";
  CURRENT_VIEW = view;
  view.style.display = '';
}


function get_random_recipe() {
  fetch("http://localhost:3000/api/recipe/random").then(res => res.json()).then(body => {
    document.querySelector("#recipe_title").innerHTML = body['dish_name'];
    let ingredients = body['ingredients'];
    let buffer = ""
    for (let ingredient of ingredients) {
      buffer += `<li>${ingredient}</li>` 
    }
    document.querySelector("#recipe_ingredients").innerHTML = `What you'll need: <ul>${buffer}</ul>`
  })
}

let ingredient_count = 1
function add_ingredient() {
  ingredient_count += 1
  let html_str = `<input type="text" class="form-control mt-2" id="ingredientsInput${ingredient_count}">`;
  document.getElementById("ingredients_input_list").innerHTML += html_str;
}

let instruction_count = 1
function add_instruction() {
  instruction_count += 1
  let html_str = `<input type="text" class="form-control mt-2" id=\"instructionsInput${instruction_count}\">`;
  document.getElementById("instructions_input_list").innerHTML += html_str;
}

window.onload = get_random_recipe;