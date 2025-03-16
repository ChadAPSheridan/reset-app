const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import

const UserProjects = sequelize.define('UserProjects', {
  UserId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  ProjectId: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
}, {
  timestamps: false,
});

module.exports = UserProjects;