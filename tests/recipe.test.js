"use strict";

const request = require("supertest");
const app = require("../server/app.js");
const yup = require("yup");
const fs = require("fs");
const mock_fs = require("mock-fs");
const FormData = require("form-data");

let recipeSchema = yup.object().shape({
  id: yup.number().nonNullable().required(),
  dish_name: yup.string().required("Dish name is required"),
  author: yup.string().required("Author of the recipe is required"),
  description: yup.string().required("Description is required"),
  instructions: yup
    .array()
    .of(yup.string().required("Instruction can't be empty"))
    .required("Instructions are required"),
  ingredients: yup
    .array()
    .of(yup.string().required("Ingredients can't be empty"))
    .required("Instructions are required"),
});

let error400Schema = yup.object().shape({
  code: yup.number(400).required(),
  message: yup.string().required(),
});

describe("Testing Recipe-related API Endpoints", () => {
  describe("GET /api/recipe/get", () => {
    test("api.recipe.get should return a 200 response and valid schema for valid input id", () => {
      let req = request(app).get("/api/recipe/get").query({ recipe_id: 3 });
      return req.expect(200).then((res) => {
        expect(recipeSchema.validate(res.body));
      });
    });

    test("api.recipe.get should return a 200 response and a valid recipe body for input id = 0", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: 0,
        })
        .expect(200)
        .then((res) => {
          expect(recipeSchema.validate(res.body));
        });
    });

    test("api.recipe.get returns 400 for out-of-index id", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: 10000,
        })
        .expect(400)
        .then((res) => {
          expect(error400Schema.validate(res.body));
        });
    });

    test("api.recipe.get returns 400 for negative id", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: -1,
        })
        .expect(400)
        .then((res) => {
          expect(error400Schema.validate(res.body));
        });
    });

    test("api.recipe.get returns 400 for non-number id", () => {
      return request(app)
        .get("/api/recipe/get")
        .query({
          recipe_id: "Hello, World!",
        })
        .expect(400)
        .then((res) => {
          expect(error400Schema.validate(res.body));
        });
    });
  });

  describe("GET /api/recipe/random", () => {
    // Tests regarding the random route
    test("api.recipe.random should return a 200 response and a valid recipe", () => {
      return request(app)
        .get("/api/recipe/random")
        .expect(200)
        .then((res) => {
          expect(recipeSchema.validate(res.body));
        });
    });
  });

  describe("GET /api/recipe/search", () => {
    test("api.recipe.search should return a 200 response for a valid key and field passed", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ key: "Chocolate", field: "dish_name" })
        .expect(200)
        .then((res) => {
          expect(yup.array().of(recipeSchema).validate(res.body));
        });
    });
    test("api.recipe.search should return a 200 response for a valid key and field passed, but no search results found", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({
          key: "a;sodfhas;gbjahsglkjajsfgflkajshdfasldfh",
          field: "dish_name",
        })
        .expect(200, []);
    });
    test("api.recipe.search should return a 400 response for no key but field", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ field: "dish_name" })
        .expect(400)
        .then((res) => {
          expect(error400Schema.validate(res.body));
        });
    });
    test("api.recipe.search should return a 400 response for key but no field", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ key: "Chocolate" })
        .expect(400)
        .then((res) => {
          expect(error400Schema.validate(res.body));
        });
    });
    test("api.recipe.search should return a 400 response for no key and no field", () => {
      return request(app)
        .get("/api/recipe/search")
        .expect(400)
        .then((res) => {
          expect(error400Schema.validate(res.body));
        });
    });
    test("api.recipe.search should return 200 with empty array for non-existant field", () => {
      return request(app)
        .get("/api/recipe/search")
        .query({ key: "Chocolate", field: "some_stuff_that_doesnt_exist" })
        .expect(200, []);
    });
  });

  describe("POST /api/recipe/create", () => {
    let data = {
      dish_name: "Chocolate Cake",
      author: "Emre Ozden",
      description: "A decadent, rich, luxurious chocolate cake",
      instructions: ["Make Cake"],
      ingredients: ["Chocolate"],
    };

    beforeEach(() => {
      mock_fs({
        "./server/data": {
          "recipes.json": JSON.stringify([]),
        },
      });
    });

    afterEach(() => {
      mock_fs.restore();
    });

    test("api.recipe.create should give a 200 response for a valid recipe schema input without image", async () => {
      let formData = new FormData();
      formData = new FormData();
      formData.append("json", JSON.stringify(data));

      const response = await request(app)
        .post("/api/recipe/create")
        .set(
          "Content-Type",
          `multipart/form-data; boundary=${formData._boundary}`
        )
        .set("Content-Length", formData.getLengthSync())
        .send(formData.getBuffer());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Success");
    });
    test("api.recipe.create should give a 200 response for a valid recipe schema input with an image", async () => {
      let formData = new FormData();
      formData = new FormData();
      formData.append("json", JSON.stringify(data));

      formData.append("recipe_img", Buffer.from("./uploads/imgs/test.jpg"));

      const response = await request(app)
        .post("/api/recipe/create")
        .set(
          "Content-Type",
          `multipart/form-data; boundary=${formData._boundary}`
        )
        .set("Content-Length", formData.getLengthSync())
        .send(formData.getBuffer());

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Success");
    });

    test("api.recipe.create should give a 400 response for a valid recipe schema and a non-image file upload", async () => {
      let formData = new FormData();
      formData = new FormData();
      formData.append("json", JSON.stringify(data));

      formData.append("recipe_img", Buffer.from("./uploads/file.txt"));

      const response = await request(app)
        .post("/api/recipe/create")
        .set(
          "Content-Type",
          `multipart/form-data; boundary=${formData._boundary}}`
        )
        .set("Content-Length", formData.getLengthSync())
        .send(formData.getBuffer());

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Malformed request");
    });
    test("api.recipe.craete should give a 400 response for an invalid recipe schema and a non-image file upload", () => {});
    test("api.recipe.create should give a 400 response for an invalid recipe schema input without image", () => {});
    test("api.recipe.create should give a 400 response for an invalid recipe schema input with an image", () => {});
    test("api.recipe.create should give a 400 response for a recipe schema with empty fields", () => {});
  });

  describe("POST /api/recipe/img/add", () => {
    test("api.recipe.img.add should give a 200 response for a valid image being uploaded", () => {});
    test("api.recipe.img.add should give a 400 response for a non-image file being uploaded", () => {});
  });
});
