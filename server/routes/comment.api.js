"use strict";

const express = require("express");
const router = express.Router();

const CommentSerializer = require("../core/CommentStreamer");

let streamer = new CommentSerializer("./server/data/comments.json");

/**
 * Gets all comments relating to a recipe
 */
router.get("/get", (req, res) => {
  try {
    res.status(200);
    res.json(streamer.GetAllComments(req.query.id));
  } catch (err) {
    console.log(err);
    res.status(400);
    res.json({ code: 400, message: "Malformed Request" });
  }
});

/**
 * Creates comment under a recipe
 */
router.post("create", (req, res) => {});

module.exports = router;
