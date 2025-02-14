const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
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
});

module.exports = Task;