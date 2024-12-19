const express = require('express');
const router = express.Router();

const RecipeSerializer = require('../core/RecipeStreamer');
const Recipe = require('../core/Recipe');

let streamer = new RecipeSerializer("./server/data/recipes.json");

function json_response(code, message) {
    return {
        "code": code,
        "message": message
    };
}

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
 *            dish_name:
 *                type: string
 *                description: Name of the dish
 *            instructions:
 *                type: string
 *                description: Instructions on how to make the dish
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
router.get('/get', (req, res) => {
    try {
        let data = streamer.read(req.query.recipe_id);
        res.status(200);
        res.json(data);
    } catch (err) {
        res.status(400);
        res.json(json_response(400, "Malformed request"));
    }
    res.end();
});

router.get('/random', (req, res) => {
    try {
        let data = streamer.read(Math.floor(Math.random() * streamer.get_size()));
        res.status(200);
        res.json(data);
    } catch (err) {
        res.status(400);
        res.json(json_response(400, "Malformed request"));
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
router.get('/search', (req, res) => {
    try {
        if (typeof req.query.key === 'undefined' || typeof req.query.field === 'undefined') {
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
 *                      type: string
 */
router.post('/create', (req, res) => {
    try {
        let recipe = new Recipe(req.body);
        streamer.write(recipe);
        res.json(json_response(200, "Success"));
    } catch (err) {
        res.status(400);
        res.json(json_response(400, "Malformed request"));
    }
    res.end();
});


module.exports = router;