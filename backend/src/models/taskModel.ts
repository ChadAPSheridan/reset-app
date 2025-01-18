import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Column from './columnModel';
import { TaskInstance } from '../types/task';

const Task = sequelize.define<TaskInstance>('Task', {
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
});

export default Task;