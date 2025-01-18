import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

class Column extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public position!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Column.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
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
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Column',
    tableName: 'Columns',
  }
);

export default Column;