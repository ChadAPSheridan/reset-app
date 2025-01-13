import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('reset_app', 'reset_user', 'your_password', {
  host: 'localhost',
  dialect: 'mariadb'
});

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
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'To Do'
  }
});

export default Task;