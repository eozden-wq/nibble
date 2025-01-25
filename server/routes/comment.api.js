"use strict";

const express = require("express");
const router = express.Router();

const CommentSerializer = require("../core/CommentStreamer");
const Comment = require("../core/Comment");

let streamer = new CommentSerializer("./server/data/comments.json");

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
 *          type: string
 *          required: true
 */
router.get("/get", (req, res) => {
  try {
    res.status(200);
    res.json(streamer.getAllComments(req.query.id));
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json({ code: 400, message: "Malformed request" });
  }
});

/**
 */
router.post("/create", (req, res) => {
  try {
    let comment = new Comment(req.body);
    streamer.write(comment);
    res.json({ code: 200, message: "Success" });
    res.end();
  } catch (err) {
    console.error(err);
    res.status(400);
    res.json({ code: 400, message: "Malformed request" });
  }
});

module.exports = router;
