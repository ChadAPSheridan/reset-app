const express = require('express');
const { authMiddleware } = require('./authRoutes');
const {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} = require('../controllers/columnController');

const router = express.Router();

router.get('/', authMiddleware, getColumns);
router.post('/', authMiddleware, createColumn);
router.put('/:columnId', authMiddleware, updateColumn);
router.delete('/:columnId', authMiddleware, deleteColumn);

module.exports = router;