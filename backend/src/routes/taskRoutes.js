const express = require('express');
const { authMiddleware } = require('./authRoutes');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, createTask);
router.put('/:taskId', authMiddleware, updateTask);
router.delete('/:taskId', authMiddleware, deleteTask);

module.exports = router;