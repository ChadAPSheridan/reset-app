
import { Model, DataTypes } from 'sequelize';

import sequelize from '../config/database';



class User extends Model {

  public id!: number;

  public username!: string;

  public password!: string; // Add the password property

}



User.init({

  id: {

    type: DataTypes.INTEGER,

    autoIncrement: true,

    primaryKey: true,

  },

  username: {

    type: DataTypes.STRING,

    allowNull: false,

  },

  password: {

    type: DataTypes.STRING,

    allowNull: false, // Ensure password is required

  },

}, {

  sequelize,

  modelName: 'User',

});



export default User;