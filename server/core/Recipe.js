
/** 
 * Recipe class - This can be used later on to verify items and have edit methods etc.
 * */ 
class Recipe {
    constructor(obj) {
        obj && Object.assign(this, obj);
    }
};

module.exports = Recipe;