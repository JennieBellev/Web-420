const request = require('supertest');
const app = require('../src/app');

describe('Chapter 3: API Tests', () => {

  // Validate the endpoint successfully serves the entire data collection to the client
  it('should return an array of books', async () => {
    const res = await request(app).get('/api/books');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  // Ensure the route parameter correctly isolates and returns a single resource
  it('should return a single book', async () => {
    const res = await request(app).get('/api/books/1');

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('title');
  });

  // Test input validation to prevent invalid database queries from crashing the server
  it('should return a 400 error if the id is not a number', async () => {
    const res = await request(app).get('/api/books/invalidId');

    expect(res.statusCode).toEqual(400);
  });

});