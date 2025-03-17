const { DataTypes, fn } = require('sequelize');
const sequelize = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // Import UUID

const UserProjects = sequelize.define('UserProjects', {
  id: {
    type: DataTypes.UUID,
    defaultValue: uuidv4,
    primaryKey: true
  },
  UserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  ProjectId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Projects',
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: fn('NOW')
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: fn('NOW')
  }
}, {
  timestamps: true,
  tableName: 'UserProjects'
});

module.exports = UserProjects;