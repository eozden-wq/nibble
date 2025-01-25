const fs = require("fs");
const Comment = require("./Comment");

class CommentStreamer {
  constructor(comment_file) {
    this.comment_file = comment_file;
    this.comments = [];
    fs.readFile(comment_file, (err, data) => {
      if (err) throw err;
      this.comments = JSON.parse(data);
    });
  }

  getAllComments(recipe_id) {
    try {
      let res = [];

      for (let comment of this.comments) {
        if (comment["recipe_id"] === Number(recipe_id)) {
          res.push(comment);
        }
      }

      return res;
    } catch (err) {
      throw err;
    }
  }

  write(comment) {
    try {
      if (!(comment instanceof Comment)) {
        throw TypeError;
      }

      this.comments.push(comment);
      fs.writeFileSync(this.comment_file, JSON.stringify(this.comments));
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CommentStreamer;
