import { Model } from 'sequelize';

export interface TaskAttributes {
  id?: number;
  title: string;
  description: string;
  columnId: number;
  row: number;
  userId?: number | null;
}

export interface TaskInstance extends Model<TaskAttributes>, TaskAttributes {}