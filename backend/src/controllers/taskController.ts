import { Request, Response } from 'express';
import { Op } from 'sequelize';
import sequelize from '../config/database'; // Import sequelize instance
import Task from '../models/taskModel';
import Column from '../models/columnModel';

// Helper function to renumber rows within a column
const renumberTaskRows = async (columnId: number) => {
  const tasks = await Task.findAll({ where: { columnId }, order: [['row', 'ASC']] });
  for (let i = 0; i < tasks.length; i++) {
    await tasks[i].update({ row: i });
  }
};

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
    await renumberTaskRows(columnId); // Renumber rows after creating a task
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const { title, description, columnId, row, userId } = req.body;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const originalColumnId = task.columnId;

    if (columnId !== undefined && columnId !== task.columnId) {
      // Move task to a different column
      const targetRow = row !== undefined ? row : await Task.count({ where: { columnId } });

      // Increment the row of tasks in the target column that are at or after the target row
      await Task.update(
        { row: sequelize.literal('row + 1') },
        { where: { columnId, row: { [Op.gte]: targetRow } } }
      );

      await task.update({ columnId, row: targetRow });
      await renumberTaskRows(originalColumnId); // Renumber rows in the source column
      await renumberTaskRows(columnId); // Renumber rows in the target column
    } else if (row !== undefined && row !== task.row) {
      // Move task within the same column
      const increment = row > task.row ? -1 : 1;
      await Task.update(
        { row: sequelize.literal(`row + ${increment}`) },
        { where: { columnId: task.columnId, row: { [Op.between]: [Math.min(task.row, row), Math.max(task.row, row)] } } }
      );

      await task.update({ row });
      await renumberTaskRows(task.columnId); // Renumber rows in the column
    }

    await task.update({ title, description, userId });
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

    const columnId = task.columnId;

    await task.destroy();
    await renumberTaskRows(columnId); // Renumber rows after deleting a task

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};