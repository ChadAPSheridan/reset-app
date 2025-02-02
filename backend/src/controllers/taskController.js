const Task = require('../models/Task');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Renumber task rows
const renumberTaskRows = async (columnId) => {
  console.log(`Renumbering task rows for columnId: ${columnId}`);
  const tasks = await Task.findAll({ where: { columnId }, order: [['row', 'ASC']] });
  for (let i = 0; i < tasks.length; i++) {
    await tasks[i].update({ row: i });
  }
};

const getTasks = async (req, res) => {
  try {
    console.log('Fetching all tasks');
    const tasks = await Task.findAll();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    console.log('Creating a new task with data:', req.body);
    const { title, description, columnId } = req.body;
    const row = await Task.count({ where: { columnId } });
    const task = await Task.create({ title, description, columnId, row });
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    console.log('Updating task with params:', req.params);
    console.log('Updating task with body:', req.body);
    const { taskId } = req.params;
    const { title, description, columnId, row } = req.body;

    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }

    const originalColumnId = task.columnId;

    if (columnId !== undefined && columnId !== task.columnId) {
      console.log(`Moving task to new column: ${columnId}`);
      const targetRow = row !== undefined ? row : await Task.count({ where: { columnId } });

      await Task.update(
        { row: sequelize.literal('row + 1') },
        { where: { columnId, row: { [Op.gte]: targetRow } } }
      );

      await task.update({ columnId, row: targetRow });
      await renumberTaskRows(originalColumnId);
      await renumberTaskRows(columnId);
    } else if (row !== undefined && row !== task.row) {
      console.log(`Updating task row to: ${row}`);
      const increment = row > task.row ? -1 : 1;
      await Task.update(
        { row: sequelize.literal(`row + ${increment}`) },
        { where: { columnId: task.columnId, row: { [Op.between]: [Math.min(task.row, row), Math.max(task.row, row)] } } }
      );

      await task.update({ row });
      await renumberTaskRows(task.columnId);
    }

    await task.update(req.body);
    res.status(200).json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    console.log('Deleting task with params:', req.params);
    const { taskId } = req.params;

    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }

    const columnId = task.columnId;

    await task.destroy();
    await renumberTaskRows(columnId);
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};