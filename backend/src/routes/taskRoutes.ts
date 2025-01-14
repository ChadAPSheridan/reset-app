import { Router } from 'express';
import { getTasks, createTask, updateTask } from '../controllers/taskController';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask); // Ensure this route is defined

export default router;