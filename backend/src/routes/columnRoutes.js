const express = require('express');
const { authenticate } = require('./authRoutes');
const {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} = require('../controllers/columnController');

const router = express.Router();

router.get('/', authenticate, getColumns);
router.post('/', authenticate, createColumn);
router.put('/:columnId', authenticate, updateColumn);
router.delete('/:columnId', authenticate, deleteColumn);

module.exports = router;