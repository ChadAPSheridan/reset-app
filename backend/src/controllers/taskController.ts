import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database'; // Import sequelize instance
import Task from '../models/taskModel';
import Column from '../models/columnModel';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, columnId } = req.body;
    const row = await Task.count({ where: { columnId } });
    const task = await Task.create({ title, description, columnId, row });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const { title, description, columnId, row } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update only if columnId and row are provided
    if (columnId !== undefined && row !== undefined) {
      await Task.update(
        { row: sequelize.literal('row + 1') },
        { where: { columnId, row: { [Op.gte]: row } } }
      );
      await task.update({ columnId, row });
    }

    await task.update({ title, description });

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};