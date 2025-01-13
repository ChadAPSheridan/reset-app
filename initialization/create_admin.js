const bcrypt = require('bcrypt');

const password = 'admin_password'; // Replace with your desired admin password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error(err);
  } else {
    console.log(hash);
  }
});