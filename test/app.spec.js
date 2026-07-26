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

describe('Chapter 7: API Tests', () => {

  // Test Case A: 200 OK (Success)
  it('should return a 200 status with "Security questions successfully answered" message', async () => {
    const res = await request(app)
      .post('/api/users/student@example.com/verify-security-question')
      .send([
        { answer: "Fluffy" },
        { answer: "Main St" },
        { answer: "Blue" }
      ]);

    expect(res.statusCode).toEqual(200);
    expect(res.text).toEqual('Security questions successfully answered');
  });

  // Test Case B: 400 Bad Request (Ajv Validation Failure)
  it('should return a 400 status code with "Bad Request" message when the request body fails ajv validation', async () => {
    const res = await request(app)
      .post('/api/users/student@example.com/verify-security-question')
      .send([
        { wrongProperty: "Fluffy" }
      ]);

    expect(res.statusCode).toEqual(400);
    expect(res.text).toEqual('Bad Request');
  });

  // Test Case C: 401 Unauthorized (Incorrect Answers)
  it('should return a 401 status code with "Unauthorized" message when the security questions are incorrect', async () => {
    const res = await request(app)
      .post('/api/users/student@example.com/verify-security-question')
      .send([
        { answer: "Wrong Answer 1" },
        { answer: "Wrong Answer 2" },
        { answer: "Wrong Answer 3" }
      ]);

    expect(res.statusCode).toEqual(401);
    expect(res.text).toEqual('Unauthorized');
  });
});