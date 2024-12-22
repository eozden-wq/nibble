'use strict';

let random_view = document.querySelector('#random_view');
let search_view = document.querySelector('#search_view');
let create_view = document.querySelector('#create_view');

let CURRENT_VIEW = random_view;

function switch_view(view) {
  CURRENT_VIEW.style = "display: none";
  CURRENT_VIEW = view;
  view.style.display = ''
}
