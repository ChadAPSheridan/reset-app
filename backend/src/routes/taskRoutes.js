const express = require('express');
const { authenticate } = require('./authRoutes');
const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', authenticate, getTasks);
router.post('/', authenticate, createTask);
router.put('/:taskId', authenticate, updateTask);
router.delete('/:taskId', authenticate, deleteTask);

module.exports = router;