'use strict';

const express = require('express');
const app = express();
const recipe_api = require('./routes/recipe.api');

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// Recipe-related API-endpoints
app.use('/api/recipe', recipe_api);

module.exports = app;
