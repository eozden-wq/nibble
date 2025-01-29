"use strict";

const express = require("express");
const router = express.Router();

const CommentSerializer = require("../core/CommentStreamer");
const Comment = require("../core/Comment");

let streamer = new CommentSerializer("./server/data/comments.json");

const yup = require("yup");
const createCommentSchema = yup.object().shape({
  recipe_id: yup
    .number()
    .positive()
    .required("The comment must correspond to a Recipe"),
  message: yup.string().trim().nonNullable().required(),
});

router.use(express.json());

/**
 * @swagger
 *  definitions:
 *    Comment:
 *      type: object
 *      properties:
 *        recipe_id:
 *          type: integer
 *          description: ID of the recipe pertaining to the comment
 *          example: 2
 *        message:
 *          type: string
 *          description: Message of the comment
 *          example: "Wow, this tasted amazing!"
 */

/**
 * @swagger
 *  /api/comment/get:
 *    get:
 *      summary: Get all the comments that have been added under a recipe
 *      responses:
 *        "200":
 *          description: All the comments under the given recipe has been fetched
 *          schema:
 *            type: array
 *            items:
 *              $ref: '#/definitions/Comment'
 *
 *      parameters:
 *        - in: query
 *          description: ID that the comment corresponds to
 *          name: id
 *          type: integer
 *          required: true
 */
router.get("/get", (req, res) => {
  try {
    res.status(200);
    return res.json(streamer.getAllComments(req.query.id));
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json({ code: 400, message: "Malformed request" });
  }
});

/**
 * @swagger
 *  /api/comment/create:
 *    post:
 *      summary: Post a comment under a recipe
 *      responses:
 *        "200":
 *          description: Successfully added new recipe
 *          schema:
 *            type: object
 *            properties:
 *              code:
 *                type: integer
 *                example: 200
 *              message:
 *                type: string
 *                example: "Success"
 *        "400":
 *          description: The request format isn't correct
 *          schema:
 *            type: object
 *            properties:
 *              code:
 *                type: integer
 *                example: 400
 *              message:
 *                type: string
 *                example: "Malformed request"
 *      parameters:
 *        - in: body
 *          schema:
 *            $ref: '#/definitions/Comment'
 */
router.post("/create", (req, res) => {
  try {
    let valid_body = createCommentSchema.validateSync(req.body, {
      abortEarly: false,
    });
    let comment = new Comment(valid_body);
    streamer.write(comment);
    res.json({ code: 200, message: "Success" });
    res.end();
  } catch (err) {
    res.status(400);
    res.json({ code: 400, message: "Malformed request" });
    res.end();
  }
});

module.exports = router;
