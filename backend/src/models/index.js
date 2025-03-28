const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const User = require('./User');
const Project = require('./Project');
const Column = require('./Column');
const Task = require('./Task');
const UserProjects = require('./UserProjects');

// Define associations with unique aliases
User.belongsToMany(Project, { through: UserProjects, as: 'projects', timestamps: true });

Project.belongsToMany(User, { through: UserProjects, as: 'users', timestamps: true});

// Keep existing associations
Project.hasMany(Column, { foreignKey: 'ProjectId', type: Sequelize.UUID });
Column.belongsTo(Project, { foreignKey: 'ProjectId', type: Sequelize.UUID });
Column.hasMany(Task, { foreignKey: 'ColumnId', type: Sequelize.UUID });
Task.belongsTo(Column, { foreignKey: 'ColumnId', type: Sequelize.UUID });
Task.belongsTo(User, { foreignKey: 'UserId', type: Sequelize.UUID });
Task.belongsTo(Project, { foreignKey: 'ProjectId', type: Sequelize.UUID });

module.exports = {
  User,
  Project,
  Column,
  Task,
  UserProjects,
};