const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import
const { v4: uuidv4 } = require('uuid'); // Import UUID

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  row: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ColumnId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Task;