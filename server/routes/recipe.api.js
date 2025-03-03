"use strict";

const express = require("express");
const router = express.Router();

const RecipeSerializer = require("../core/RecipeStreamer");
const Recipe = require("../core/Recipe");

let streamer = new RecipeSerializer("./server/data/recipes.json");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "server/data/recipe_imgs");
  },
  filename: (req, file, cb) => {
    const unique_suffix = streamer.get_size();
    cb(null, `recipe-${unique_suffix}${path.extname(file.originalname)}`);
  },
});

const storage_edit = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "server/data/recipe_imgs");
  },
  filename: (req, file, cb) => {
    const unique_suffix = req.query.id;
    cb(null, `recipe-${unique_suffix}${path.extname(file.originalname)}`);
  },
});

const file_filter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type uploaded"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: file_filter,
}).single("recipe_img");
const upload_edit = multer({
  storage: storage_edit,
});

function json_response(code, message) {
  return {
    code: code,
    message: message,
  };
}

const yup = require("yup");
const createRecipeSchema = yup.object().shape({
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

router.use(express.json());

/**
 * @swagger
 *definitions:
 *    Recipe:
 *        type: object
 *        required:
 *            - id
 *            - author
 *            - dish_name
 *            - instructions
 *        properties:
 *            id:
 *                type: integer
 *                description: ID of recipe
 *            author:
 *                type: string
 *                description: Name of the author of the recipe
 *                example: Gordon Ramsay
 *            dish_name:
 *                type: string
 *                description: Name of the dish
 *                example: Sticky Toffee Pudding
 *            instructions:
 *                type: array
 *                items:
 *                  type: string
 *                  example: Cook to al dente
 *                description: Instructions on how to make the dish
 *            ingredients:
 *                type: array
 *                items:
 *                  type: string
 *                  example: Toffee
 *                description: Ingredients for the recipe
 *    Response:
 *        type: object
 *        required:
 *          - code
 *          - message
 *        properties:
 *            code:
 *                type: integer
 *            message:
 *                type: string
 *
 */

/**
 * @swagger
 * /api/recipe/get:
 *  get:
 *      parameters:
 *        - in: query
 *          name: recipe_id
 *          schema:
 *              type: integer
 *          required: true
 *          description: Numeric ID of the recipe to get
 *      summary: Get a recipe by it's ID
 *      responses:
 *          "200":
 *              description: The recipe with the given ID
 *              schema:
 *                  $ref: "#/definitions/Recipe"
 *          "400":
 *              description: An invalid ID has been passed as a query parameter
 *              schema:
 *                  $ref: "#/definitions/Response"
 *
 */
router.get("/get", (req, res) => {
  try {
    const recipe_id = Number(req.query.recipe_id);
    let data = streamer.read(recipe_id);
    res.status(200);
    res.json(data);
  } catch (err) {
    res.status(400);
    res.json(json_response(400, "Malformed request"));
  }
});

/**
 * @swagger
 *  /api/recipe/random:
 *      get:
 *          summary: Get a random recipe from the recipes
 *          responses:
 *              "200":
 *                  description: A random stored recipe
 *                  schema:
 *                      $ref: '#/definitions/Recipe'
 *              "500":
 *                  description: An internal server error has occurred
 *                  schema:
 *                      $ref: '#/definitions/Response'
 */
router.get("/random", (req, res) => {
  try {
    let data = streamer.read(Math.floor(Math.random() * streamer.get_size()));
    res.status(200);
    res.json(data);
  } catch (err) {
    res.status(500);
    res.json(json_response(500, "Internal Server Error"));
  }
  res.end();
});

/**
 * @swagger
 *  /api/recipe/search:
 *      get:
 *          summary: search recipes by key in a certain field
 *          parameters:
 *              - in: query
 *                name: key
 *                schema:
 *                   type: string
 *                required: true
 *                description: The string that is going to be searched for
 *              - in: query
 *                name: field
 *                schema:
 *                  type: string
 *                required: true
 *                description: The field of a joke that the key is going to be searched in
 *          responses:
 *              "200":
 *                  description: Array of recipes that the search has matched
 *                  schema:
 *                      type: array
 *                      items:
 *                          $ref: '#/definitions/Recipe'
 *              "400":
 *                  description: Either key or field is undefined or does not exist
 *                  schema:
 *                      properties:
 *                          code:
 *                              type: integer
 *                              example: 400
 *                          message:
 *                              type: string
 *                              example: "Malformed request"
 */
router.get("/search", (req, res) => {
  try {
    if (
      typeof req.query.key === "undefined" ||
      typeof req.query.field === "undefined"
    ) {
      throw TypeError;
    }
    res.status(200);
    res.json(streamer.search(req.query.field, req.query.key));
  } catch (err) {
    res.status(400);
    res.json(json_response(400, "Malformed request"));
  }
  res.end();
});

// Route with images
router.use("/img", express.static("server/data/recipe_imgs"));

/**
 * @swagger
 * /api/recipe/create:
 *  post:
 *      summary: Create a new recipe for people to view
 *      responses:
 *          "200":
 *              description: The recipe was successfully created
 *              schema:
 *                  properties:
 *                      code:
 *                          type: integer
 *                          example: 200
 *                      message:
 *                          type: string
 *                          example: "Success"
 *          "400":
 *              description: The recipe was not created due to the parameters not being given correctly
 *              schema:
 *                  properties:
 *                      code:
 *                          type: integer
 *                          example: 400
 *                      message:
 *                          type: string
 *                          example: "Malformed request"
 *      parameters:
 *        - in: body
 *          name: recipe
 *          description: The recipe to be created
 *          schema:
 *              type: object
 *              required:
 *                  - author
 *                  - dish_name
 *                  - instructions
 *              properties:
 *                  author:
 *                      type: string
 *                  dish_name:
 *                      type: string
 *                  instructions:
 *                      type: array
 *                      items:
 *                          type: string
 *                  ingredients:
 *                      type: array
 *                      items:
 *                          type: string
 */
router.post("/create", async (req, res) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        throw new Error("File upload is invalid");
      }
      let recipe_data;
      try {
        recipe_data = JSON.parse(req.body["json"]);
        await createRecipeSchema.validate(recipe_data, { abortEarly: false });
      } catch (validationError) {
        return res.status(400).json(json_response(400, "Malformed request"));
      }
      if (req.file) {
        recipe_data[
          "image_path"
        ] = `recipe-${streamer.get_size()}${path.extname(
          req.file.originalname
        )}`;
      } else {
        recipe_data["image_path"] = null;
      }

      const recipe = new Recipe(recipe_data);
      streamer.write(recipe);

      return res.status(200).json(json_response(200, "Success"));
    } catch (err) {
      console.error(err);
      return res.status(400).json(json_response(400, "Malformed request"));
    }
  });
});

module.exports = router;
