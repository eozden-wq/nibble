const express = require('express');;
const router = express.Router();

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
 * /api/recipes/get:
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
    res.send('test');
});

module.exports = router;