const express = require('express');
const router = express.Router();
const RecipeSerializer = require('../core/RecipeSerializer');

let serializer = new RecipeSerializer("./server/data/recipes.json");

function error_response(code, message) {
    return {"code": code, "message": message};
}

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
 *    Error:
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
 *                  $ref: "#/definitions/Error"
 *                          
*/
router.get('/get', (req, res) => {
    try {
        data = serializer.read(req.query.recipe_id);
        res.json(data);
        res.status(200);
        res.end();
    } catch (err) {
        res.json(error_response(400, "Malformed request"));
        res.status(400);
        res.end();
    }
});

module.exports = router;