"use strict";

/**
 * Class that handles reading and writing to data.json
 * Motivation - The idea of loading, writing and re-loading the same huge hunk of data doesn't seem too appealing
 * This class takes the name of the file where the data will be stored and all the reads/writes and editing will be done through this
 */

const fs = require("fs");
const Recipe = require("./Recipe");
const Fuse = require("fuse.js");

class RecipeStreamer {
  constructor(data_file) {
    this.data_file = data_file;
    const file_data = fs.readFileSync(data_file, 'utf8');
    this.data = JSON.parse(file_data);
  }

  /**
   * Reads the recipe with given id
   */
  read(id) {
    try {
      if (typeof this.data[id] === "undefined") {
        throw TypeError;
      }
      return this.data[id];
    } catch (err) {
      throw err;
    }
  }

  write(recipe) {
    try {
      if (!(recipe instanceof Recipe)) {
        throw TypeError;
      }
      recipe.id = this.data.length;
      this.data.push(recipe);
      fs.writeFileSync(this.data_file, JSON.stringify(this.data));
    } catch (err) {
      throw err;
    }
  }

  edit(id, key, value) {
    // Edits the value of a certain key
    try {
      if (typeof this.data[id] === "undefined") {
        throw TypeError;
      } else if (typeof this.data[id][key] === "undefined") {
        throw TypeError;
      }

      this.data[id][key] = value;
      fs.writeFileSync(this.data_file, JSON.stringify(this.data));
    } catch (err) {
      throw err;
    }
  }

  search(field, key) {
    const options = {
      includeScore: true,
      keys: [field],
    };

    const fuse = new Fuse(this.data, options);

    const search_result = fuse.search(key);
    let results = [];

    search_result.forEach((element) => {
      results.push(element["item"]);
    });

    return results;
  }

  get_size() {
    return this.data.length;
  }
}

module.exports = RecipeStreamer;