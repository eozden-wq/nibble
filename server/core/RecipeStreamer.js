'use strict';

/**
 * Class that handles reading and writing to data.json
 * Motivation - The idea of loading, writing and re-loading the same huge hunk of data doesn't seem too appealing
 * This class takes the name of the file where the data will be stored and all the reads/writes and editing will be done through this 
 */

const fs = require('fs');
const Recipe = require("./Recipe");
const Fuse = require('fuse.js');

class RecipeStreamer {
    constructor(data_file) {
        this.data_file = data_file;
        this.data = [];
        fs.readFile(data_file, (err, data) => {
            if (err) throw err;

            this.data = JSON.parse(data);
        });
    };

    /**
     * Reads the recipe with given id
     */
    read(id) {
        try {
            if (typeof this.data[id] === 'undefined') {
                throw TypeError;
            }
            return this.data[id]
        } catch (err) {
            throw err;
        }
    }

    write(recipe) {
        try {
            if (!(recipe instanceof Recipe)) {
                throw TypeError
            }
            recipe.id = this.data.length;
            this.data.push(recipe);
            fs.writeFileSync(this.data_file, JSON.stringify(this.data));
        } catch (err) {
            throw err;
        }
    }

    edit(id) {
        // TODO
    }
    
    search(key) {
        const options = {
            includeScore: true,
            keys: ['dish_name']
        };
        
        const fuse = new Fuse(this.data, options)

        const search_result = fuse.search(key);
        let results = []
        
        search_result.forEach((element) => {
            if (element["score"] > 0.2) { results.append(element["item"])}
        });

    }
}

module.exports = RecipeStreamer;