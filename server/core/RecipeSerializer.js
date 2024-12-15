'use strict';

/**
 * Class that handles reading and writing to data.json
 * Motivation - The idea of loading, writing and re-loading the same huge hunk of data doesn't seem too appealing
 * This class takes the name of the file where the data will be stored and all the reads/writes and editing will be done through this 
 */

const fs = require('fs');

class RecipeSerializer {
    constructor(data_file) {
        this.data = []; 
        fs.readFile(data_file, (err, data) => {
            if (err) throw err;

            this.data = JSON.parse(data);
        });
    };   
    
    read(id) {
        try {
            if (typeof this.data[id] === 'undefined') {
                throw err;
            }
            return this.data[id]
        } catch (err) {
            console.log("hit");
            throw err;
        }
    }
    
    write() {
        // TODO
    }
    
    edit(id) {
        // TODO
    }
}

module.exports = RecipeSerializer;