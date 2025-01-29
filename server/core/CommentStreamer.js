const fs = require("fs");
const Comment = require("./Comment");

class CommentStreamer {
  constructor(comment_file) {
    this.comment_file = comment_file;
    const file_data = fs.readFileSync(this.comment_file, "utf8");
    this.comments = JSON.parse(file_data);
  }

  getAllComments(recipe_id) {
    try {
      let res = [];

      if (recipe_id < 0 || isNaN(recipe_id)) {
        throw TypeError;
      }

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

  write(comment, recipes_file) {
    try {
      if (!(comment instanceof Comment)) {
        throw TypeError;
      }

      const recipes = fs.readFileSync(recipes_file, "utf-8");
      let recipes_json = JSON.parse(recipes);

      if (!recipes_json.some((recipe) => recipe.id === comment.recipe_id)) {
        throw Error("This recipe doesn't exist!");
      }
      this.comments.push(comment);
      fs.writeFileSync(this.comment_file, JSON.stringify(this.comments));
    } catch (err) {
      throw err;
    }
  }
}

module.exports = CommentStreamer;
