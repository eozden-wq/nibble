'use strict';

const express = require('express');
const app = express();

/**
 * Automatic documentation setup
 */
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    nibble_api: '3.0.0',
    info: {
      title: "NibbleAPI",
      version: '1.0.0',
      description: 'API documentation for Nibble API',
    },
    servers: [
    ],
  },
  apis: ['./routes/*.js'], // API routes are all contained in the routes/ directory
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(express.static('client'));

app.get('/', (req, res) => {
  res.sendFile('index.html');
})

module.exports = app;
