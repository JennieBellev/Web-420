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
describe('Chapter 4: API Tests', () => {
    it('Should return a 201-status code when adding a new book', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({ title: 'The Design of Web APIs', author: 'Arnaud Lauret' });
        expect(res.status).toBe(201);
    });

    it('Should return a 400-status code when adding a new book with missing title', async () => {
        const res = await request(app)
            .post('/api/books')
            .send({ author: 'Arnaud Lauret' });
        expect(res.status).toBe(400);
    });

    it('Should return a 204-status code when deleting a book', async () => {
        const res = await request(app)
            .delete('/api/books/1');
        expect(res.status).toBe(204);
    });
});
describe("Chapter 5: API Tests", () => {

  // Test A: Successful update
  it("should update a book and return a 204-status code", async () => {
    const response = await request(app) // Note: Make sure 'request' and 'app' are defined at the top of your file like in chapter 4
      .put('/api/books/1')
      .send({ title: 'New Book Title', author: 'John Doe' });

    expect(response.status).toEqual(204);
  });

  // Test B: Non-numeric ID error
  it("should return a 400-status code when using a non-numeric id", async () => {
    const response = await request(app)
      .put('/api/books/foo')
      .send({ title: 'New Book Title', author: 'John Doe' });

    expect(response.status).toEqual(400);
    expect(response.text).toEqual("Input must be a number");
  });

  // Test C: Missing title error
  it("should return a 400-status code when updating a book with a missing title", async () => {
    const response = await request(app)
      .put('/api/books/1')
      .send({ author: 'John Doe' }); // Intentionally missing the title

    expect(response.status).toEqual(400);
    expect(response.text).toEqual("Bad Request");
  });

});


