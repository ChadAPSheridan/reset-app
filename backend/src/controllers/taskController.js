const Task = require('../models/Task');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Renumber task rows
const renumberTaskRows = async (ColumnId) => {
  console.log(`Renumbering task rows for ColumnId: ${ColumnId}`);
  const tasks = await Task.findAll({ where: { ColumnId }, order: [['row', 'ASC']] });
  for (let i = 0; i < tasks.length; i++) {
    await tasks[i].update({ row: i });
  }
};

const getTasks = async (req, res) => {
  try {
    console.log('Fetching tasks for project:', req.params.projectId);
    const { projectId } = req.params;
    const tasks = await Task.findAll({ where: { ProjectId: projectId } });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    console.log('Creating a new task with data:', req.body);
    const { title, description, ColumnId, ProjectId, UserId } = req.body;
    const row = await Task.count({ where: { ColumnId } });
    const task = await Task.create({ title, description, ColumnId, ProjectId, UserId, row });
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
    const { title, description, ColumnId, row, UserId } = req.body;

    const task = await Task.findOne({ where: { id: taskId } });
    if (!task) {
      console.log('Task not found:', taskId);
      return res.status(404).json({ message: 'Task not found' });
    }

    const originalColumnId = task.ColumnId;

    if (ColumnId !== undefined && ColumnId !== task.ColumnId) {
      console.log(`Moving task to new column: ${ColumnId}`);
      const targetRow = row !== undefined ? row : await Task.count({ where: { ColumnId } });

      await Task.update(
        { row: sequelize.literal('row + 1') },
        { where: { ColumnId, row: { [Op.gte]: targetRow } } }
      );

      await task.update({ ColumnId, row: targetRow });
      await renumberTaskRows(originalColumnId);
      await renumberTaskRows(ColumnId);
    } else if (row !== undefined && row !== task.row) {
      console.log(`Updating task row to: ${row}`);
      const increment = row > task.row ? -1 : 1;
      await Task.update(
        { row: sequelize.literal(`row + ${increment}`) },
        { where: { ColumnId: task.ColumnId, row: { [Op.between]: [Math.min(task.row, row), Math.max(task.row, row)] } } }
      );

      await Task.update({ row });
      await renumberTaskRows(task.ColumnId);
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

    const ColumnId = task.ColumnId;

    await task.destroy();
    await renumberTaskRows(ColumnId);
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