const request = require("supertest");
const app = require("../server/app.js");

jest.mock("../server/data/recipes.json", () => [{
    id: 0,
    dish_name: "Risotto",
    author: "Gordon Ramsay",
    description: "Nicest Risotto to have ever been made",
    instructions: ["Make Risotto"],
    ingredients: ["Rice"],
    image_path: null,
}, ]);

describe("Testing Recipe-related API Endpoints", () => {
    describe("GET /api/recipe/get", () => {
        test("api.recipe.get should return a 200 response for valid input id", () => {
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
    });

    describe("GET /api/recipe/search", () => {});

    describe("POST /api/recipe/create", () => {});

    describe("POST /api/recipe/img/add", () => {});
});