import { Router } from 'express';
import { getColumns, createColumn, updateColumn, deleteColumn } from '../controllers/columnController';

const router = Router();

router.get('/', getColumns);
router.post('/', createColumn);
router.put('/:id', updateColumn);
router.delete('/:id', deleteColumn);

export default router;