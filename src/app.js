const express = require('express');
const bcrypt = require('bcryptjs');
const users = require('../database/users');

const app = express();
app.use(express.json());

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

module.exports = app;