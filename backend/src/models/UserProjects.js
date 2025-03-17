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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
});

module.exports = UserProjects;