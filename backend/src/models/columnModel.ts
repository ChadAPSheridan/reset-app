import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../config/database';

const Column = sequelize.define('Column', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  position: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
});

export default Column;