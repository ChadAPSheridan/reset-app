const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import
const { v4: uuidv4 } = require('uuid'); // Import UUID

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});

module.exports = Project;
