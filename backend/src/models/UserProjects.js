const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import

const UserProjects = sequelize.define('UserProjects', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
}, {
  timestamps: false,
});

module.exports = UserProjects;