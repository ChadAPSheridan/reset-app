import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class User extends Model {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public username!: string;
  public password!: string;
  public permissionLevel!: string;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    permissionLevel: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'user',
    },
  },
  {
    sequelize,
    modelName: 'User',
  }
);

export default User;