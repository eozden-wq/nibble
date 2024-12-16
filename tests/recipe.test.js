const request = require('supertest');
const app = require('../server/app.js')

describe('Testing Recipe-related API Endpoints', () => {
    describe('GET /api/recipe/get', () => {
        test('api.recipe.get should return a 200 response for valid input id', () => {
            request(app).get('/api/recipe/get').query({"recipe_id": 0}).expect(200);
        });
    });
});