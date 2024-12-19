'use strict';

const express = require('express');
const app = express();
const recipe_api = require('./routes/recipe.api');

/**
 * Automatic documentation setup
 */
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    swagger: '2.0',
    info: {
      title: "NibbleAPI",
      version: '1.0.0',
      description: 'API documentation for Nibble API',
    },
  },
  apis: ['./server/routes/*.js'], // API routes are all contained in the routes/ directory
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

// Recipe-related API-endpoints
app.use('/api/recipe', recipe_api);

module.exports = app;
