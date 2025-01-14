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
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, status } = req.body;
    const column = await Column.findOne({ where: { status } });
    if (!column) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const row = await Task.count({ where: { status } });
    const task = await Task.create({ title, description, status, row });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id;
    const { status, row } = req.body;

    console.log(`Updating task ${taskId} to status ${status} and row ${row}`);

    // Find the task to be updated
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update rows of tasks in the target column that would be displaced
    await Task.update(
      { row: sequelize.literal('row + 1') },
      { where: { status, row: { [Op.gte]: row } } }
    );

    // Update the task's status and row
    await task.update({ status, row });

    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export class TaskController {
    constructor(private taskService: typeof Task) {}

    async updateTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const updatedData = req.body;
            const [updated] = await this.taskService.update(updatedData, { where: { id: taskId } });
            if (updated) {
                const updatedTask = await this.taskService.findByPk(taskId);
                res.status(200).json(updatedTask);
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }

    async deleteTask(req: Request, res: Response): Promise<void> {
        try {
            const taskId = req.params.id;
            const deleted = await this.taskService.destroy({ where: { id: taskId } });
            if (deleted) {
                res.status(204).send();
            } else {
                res.status(404).json({ message: 'Task not found' });
            }
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}