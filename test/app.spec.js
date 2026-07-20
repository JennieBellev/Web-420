const request = require('supertest');
const app = require('../src/app');

describe('Chapter 6: API Tests', () => {
  it('should log a user in and return a 200-status', async () => {
    const response = await request(app).post('/api/login').send({ email: 'student@example.com', password: 'mypassword123' });
    expect(response.status).toEqual(200);
    expect(response.body.message).toEqual('Authentication successful');
  });

  it('should return a 401-status code for wrong credentials', async () => {
    const response = await request(app).post('/api/login').send({ email: 'student@example.com', password: 'wrong' });
    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('Unauthorized');
  });

  it('should return a 400-status code for missing data', async () => {
    const response = await request(app).post('/api/login').send({ email: 'student@example.com' });
    expect(response.status).toEqual(400);
    expect(response.body.message).toEqual('Bad Request');
  });
});