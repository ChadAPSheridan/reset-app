const { Sequelize } = require('sequelize');
const sequelize = require('../config/database'); // Correct import

const User = require('./User');
const Project = require('./Project');
const Column = require('./Column');
const Task = require('./Task');
const UserProjects = require('./UserProjects');

// Define associations
User.belongsToMany(Project, { through: UserProjects });
Project.belongsToMany(User, { through: UserProjects });
Project.hasMany(Column);
Column.belongsTo(Project);
Column.hasMany(Task);
Task.belongsTo(Column);
Task.belongsTo(User);
Task.belongsTo(Project);

module.exports = {
  User,
  Project,
  Column,
  Task,
  UserProjects,
};