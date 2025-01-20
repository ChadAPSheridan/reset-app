import { Request, Response } from 'express';
import Column from '../models/columnModel';
import { Op } from 'sequelize';
import sequelize from '../config/database'; // Import sequelize instance

// Helper function to renumber positions of columns
const renumberColumnPositions = async () => {
  const columns = await Column.findAll({ order: [['position', 'ASC']] });
  for (let i = 0; i < columns.length; i++) {
    await columns[i].update({ position: i });
  }
};

export const getColumns = async (req: Request, res: Response) => {
  try {
    const columns = await Column.findAll();
    res.status(200).json(columns);
  } catch (error) {
    console.error('Error fetching columns:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createColumn = async (req: Request, res: Response) => {
  try {
    const { title, description, position } = req.body;
    const column = await Column.create({ title, description, position });
    await renumberColumnPositions(); // Renumber positions after creating a column
    res.status(201).json(column);
  } catch (error) {
    console.error('Error creating column:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateColumn = async (req: Request, res: Response) => {
  try {
    const columnId = req.params.id;
    const { title, description, position } = req.body;

    // Debug log to check the columnId
    // console.log('Updating column with ID:', columnId);
    // console.log('Request body:', req.body);

    const column = await Column.findByPk(columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    // Update positions of other columns
    if (position !== undefined) {
      const columns = await Column.findAll();
      const draggedColumn = columns.find(col => col.id === parseInt(columnId));
      if (draggedColumn) {
        // console.log('Dragged column:', draggedColumn); 

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
          // Debug log to check the column position update
          // console.log('Updating column position:', col.id, col.position);
          if (col.id !== undefined) {
            await Column.update({ position: col.position }, { where: { id: col.id } });
          }
        }
      }
    }

    await column.update({ title, description, position });
    await renumberColumnPositions(); // Renumber positions after updating a column
    res.status(200).json(column);
  } catch (error) {
    console.error('Error updating column:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteColumn = async (req: Request, res: Response) => {
  try {
    const columnId = req.params.id;

    const column = await Column.findByPk(columnId);
    if (!column) {
      return res.status(404).json({ message: 'Column not found' });
    }

    await column.destroy();
    await renumberColumnPositions(); // Renumber positions after deleting a column

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting column:', error);
    res.status(500).json({ message: (error as Error).message });
  }
};