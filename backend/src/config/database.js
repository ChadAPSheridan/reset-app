const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

console.log('DB_NAME:', process.env.DB_NAME); // Debugging output
console.log('DB_USER:', process.env.DB_USER); // Debugging output
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Debugging output
console.log('DB_HOST:', process.env.DB_HOST); // Debugging output

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mariadb',
});

console.log('Sequelize instance created:', sequelize); // Debugging output

module.exports = sequelize;