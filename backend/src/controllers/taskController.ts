import { Request, Response } from 'express';
import Task from '../models/taskModel';

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
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
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