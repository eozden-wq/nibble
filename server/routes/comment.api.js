"use strict";

const express = require("express");
const router = express.Router();

const CommentSerializer = require("../core/CommentStreamer");
const Comment = require("../core/Comment");

let streamer = new CommentSerializer("./server/data/comments.json");

/**
 * Gets all comments relating to a recipe
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
 * Creates comment under a recipe
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
