const request = require('supertest');
const app = require('../server/app.js')

describe('Testing Recipe-related API Endpoints', () => {
    describe('GET /api/recipe/get', () => {
        test('api.recipe.get should return a 200 response for valid input id', () => {
            return request(app).get('/api/recipe/get').query({
                "recipe_id": 0
            }).expect(200);
        });

        test('api.recipe.get returns 400 for out-of-index id', () => {
            return request(app).get('/api/recipe/get').query({
                "recipe_id": 10000
            }).expect(400);
        });

        test('api.recipe.get returns 400 for negative id', () => {
            return request(app).get('/api/recipe/get').query({
                "recipe_id": -1
            }).expect(400);
        });

        test('api.recipe.get returns 400 for non-number id', () => {
            return request(app).get('/api/recipe/get').query({
                "recipe_id": "Hello, World!"
            }).expect(400);
        });
    });

    describe('POST /api/recipe/create', () => {
        test('api.recipe.create should return 200 when a valid recipe is given', () => {
            request(app).post('/api/recipe/create').send({
                "author": "John Doe",
                "dish_name": "Sticky Toffee Pudding",
                "instructions": "I don't know how to make Sticky toffee pudding"
            }).set('Content-Type', 'application/json').expect({
                "code": 200,
                "message": "Success"
            })
        });
    });
});