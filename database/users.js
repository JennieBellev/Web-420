const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

const users = [
  {
    id: 1,
    email: 'student@example.com',
    password: bcrypt.hashSync('mypassword123', salt)
  }
];

module.exports = users;