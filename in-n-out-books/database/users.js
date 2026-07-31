const bcrypt = require('bcryptjs');

const users = [
  {
    email: 'student@example.com',
    password: bcrypt.hashSync('mypassword123', 10),
    securityQuestions: [
      { answer: 'Fluffy' },
      { answer: 'Main St' },
      { answer: 'Blue' }
    ]
  }
];

module.exports = users;