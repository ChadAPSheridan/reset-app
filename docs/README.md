// filepath: /home/chads/Projects/Reset-app/reset-app/backend/src/controllers/taskController.ts
import { Request, Response } from 'express';
import { getAllTasks, createTask } from '../services/taskService';

export const getTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createTaskHandler = async (req: Request, res: Response) => {
  try {
    const task = await createTask(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export class TaskController {
  constructor(private taskService: typeof import('../services/taskService')) {}

  async updateTask(req: Request, res: Response): Promise<void> {
    try {
      // Implementation here
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}