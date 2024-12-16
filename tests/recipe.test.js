const request = require('supertest');
const app = require('../server/app.js')

describe('Testing Recipe-related API Endpoints', () => {
    describe('GET /api/recipe/get', () => {
        test('api.recipe.get should return a 200 response for valid input id', () => {
            request(app).get('/api/recipe/get').query({"recipe_id": 0}).expect(200);
        });
        
        test('api.recipe.get returns 400 for out-of-index id', () => {
            request(app).get('/api/recipe/get').query({"recipe_id": 10}).expect(400);
        });
        
        test('api.recipe.get returns 400 for negative id', () => {
            request(app).get('/api/recipe/get').query({"recipe_id": -1}).expect(400);
        });
        
        test('api.recipe.get returns 400 for non-number id', () => {
            request(app).get('api/recipe/get').query({"recipe_id": "Hello, World!"}).expect(400);
        })
    });
});