"use strict";

const request = require("supertest");
const app = require("../server/app.js");

jest.mock("../server/data/recipes.json", () => [
  {
    id: 0,
    dish_name: "Risotto",
    author: "Gordon Ramsay",
    description: "Nicest Risotto to have ever been made",
    instructions: ["Make Risotto"],
    ingredients: ["Rice"],
    image_path: null,
  },
]);

describe("Testing Recipe-related API Endpoints", () => {
  describe("GET /api/recipe/get", () => {
    test("api.recipe.get should return a 200 response for valid input id", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({ recipe_id: 3 })
        .expect(200);
    });

    test("api.recipe.get should return a 200 response for input id = 0", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: 0,
        })
        .expect(200);
    });

    test("api.recipe.get returns 400 for out-of-index id", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: 10000,
        })
        .expect(400);
    });

    test("api.recipe.get returns 400 for negative id", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: -1,
        })
        .expect(400);
    });

    test("api.recipe.get returns 400 for non-number id", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: "Hello, World!",
        })
        .expect(400);
    });
  });

  describe("GET /api/recipe/random", () => {
    // Tests regarding the random route
    test("api.recipe.random should return a 200 response and a valid recipe", () => {
      return request(app).get("/api/recipe/random").expect(200);
    });
  });

  describe("GET /api/recipe/search", () => {
    test("api.recipe.search should return a 200 response for a valid key and field passed", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ key: "Chocolate", field: "dish_name" })
        .expect(200);
    });
    test("api.recipe.search should return a 200 response for a valid key and field passed, but no search results found", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({
          key: "ads;liahsgakjfhgasfjlgkahsdfklajsdhfalksjdfasdlkfj",
          field: "dish_name",
        })
        .expect(200);
    });
    test("api.recipe.search should return a 400 response for no key but field", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ field: "dish_name" })
        .expect(400);
    });
    test("api.recipe.search should return a 400 response for key but no field", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ key: "Chocolate" })
        .expect(400);
    });
    test("api.recipe.search should return a 400 response for no key and no field", () => {
      return request(app).get("/api/recipe/search").expect(400);
    });
    test("api.recipe.search should return 400 for non-existant field", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ key: "Chocolate", field: "some_stuff_that_doesnt_exist" })
        .expect(400);
    });
  });

  describe("POST /api/recipe/create", () => {});

  describe("POST /api/recipe/img/add", () => {});
});
