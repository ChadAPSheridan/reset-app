const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Column = require('./Column');
const User = require('./User');
const Project = require('./Project'); // Import Project model

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
      type: DataTypes.TEXT, // Changed from STRING to TEXT
      allowNull: true,
    },
    columnId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Column,
        key: 'id',
      },
    },
    row: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: User,
        key: 'id',
      },
    },
    projectId: { // Added projectId field
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Project,
        key: 'id',
      },
    },
  });

module.exports = Task;