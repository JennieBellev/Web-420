const express = require('express');
const bcrypt = require('bcryptjs');
const users = require('../database/users');
const Ajv = require('ajv');
const ajv = new Ajv();

const app = express();
app.use(express.json());

const securityAnswerSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      answer: { type: "string" }
    },
    required: ["answer"],
    additionalProperties: false
  }
};

// Chapter 6 Login Route
app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error('Bad Request');
      error.status = 400;
      throw error;
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      const error = new Error('Unauthorized');
      error.status = 401;
      throw error;
    }

    res.status(200).json({ message: 'Authentication successful' });

  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
});

// Chapter 7 Verify Security Question Route
app.post('/api/users/:email/verify-security-question', (req, res) => {
  try {
    const userEmail = req.params.email;
    const suppliedAnswers = req.body;

    // 1. Validate request body
    const validate = ajv.compile(securityAnswerSchema);
    const valid = validate(suppliedAnswers);

    if (!valid) {
      return res.status(400).send('Bad Request');
    }

    // 2. Find the user in the database
    const user = users.find(u => u.email === userEmail);

    if (!user) {
      return res.status(401).send('Unauthorized');
    }

    // Safety check to prevent the length crash
    if (!user.securityQuestions) {
      return res.status(401).send('Unauthorized');
    }

    // 3. Compare supplied answers to the saved answers
    let answersMatch = true;
    for (let i = 0; i < user.securityQuestions.length; i++) {
      if (user.securityQuestions[i].answer !== suppliedAnswers[i].answer) {
        answersMatch = false;
        break;
      }
    }

    if (!answersMatch) {
      return res.status(401).send('Unauthorized');
    }

    // 4. Return success as plain text
    return res.status(200).send('Security questions successfully answered');

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = app;