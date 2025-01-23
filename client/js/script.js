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


function load_recipe_on_page_load() {
  fetch("http://localhost:3000/api/recipe/random").then(res => res.json()).then(body => {
    console.log(body);
    document.querySelector("#recipe_title").innerHTML = body['dish_name']
  })
}


window.onload = load_recipe_on_page_load;