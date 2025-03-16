const Column = require('../models/Column');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Renumber column positions
const renumberColumnPositions = async () => {
  const columns = await Column.findAll({ order: [['position', 'ASC']] });
  for (let i = 0; i < columns.length; i++) {
    await columns[i].update({ position: i });
  }
};

const getColumns = async (req, res) => {
  try {
    console.log('Getting columns');
    console.log('req.params:', req.params);
    const { projectId } = req.params;
    const columns = await Column.findAll({ where: { ProjectId: projectId } });
    res.json(columns);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ message: error.message });
  }
};

const createColumn = async (req, res) => {
  try {
    const { title, description, position, ProjectId } = req.body;
    const column = await Column.create({ title, description, position, ProjectId });
    await renumberColumnPositions();
    res.status(201).json(column);
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateColumn = async (req, res) => {
  try {
    const { columnId } = req.params;
    const { title, description, position } = req.body;

    const column = await Column.findByPk(columnId);
    if (!column) return res.status(404).json({ message: 'Column not found' });

    if (position !== undefined) {
      const columns = await Column.findAll();
      const draggedColumn = columns.find(col => col.id === columnId);
      if (draggedColumn) {
        const updatedColumns = columns.map(col => {
          if (col.id === draggedColumn.id) {
            return { ...col, position };
          } else if (col.position >= position && col.position < draggedColumn.position) {
            return { ...col, position: col.position + 1 };
          } else if (col.position <= position && col.position > draggedColumn.position) {
            return { ...col, position: col.position - 1 };
          }
          return col;
        });

        for (const col of updatedColumns) {
          if (col.id !== undefined) {
            await Column.update({ position: col.position }, { where: { id: col.id } });
          }
        }
      }
    }

    await column.update({ title, description, position });
    await renumberColumnPositions();
    res.json(column);
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteColumn = async (req, res) => {
  try {
    const { columnId } = req.params;

    const column = await Column.findByPk(columnId);
    if (!column) return res.status(404).json({ message: 'Column not found' });

    await column.destroy();
    await renumberColumnPositions();
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
};