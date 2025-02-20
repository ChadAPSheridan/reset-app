const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Correct import
const { v4: uuidv4 } = require('uuid'); // Import UUID

const Column = sequelize.define('Column', {
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
    type: DataTypes.STRING,
    allowNull: true,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

module.exports = Column;