import sequelize from '../config/database';
import Column from '../models/columnModel';

const initializeColumns = async () => {
  try {
    await sequelize.sync();

    const columns = [
      { title: 'To Do', description: 'Tasks to be done', position: 0 },
      { title: 'In Progress', description: 'Tasks in progress', position: 1 },
      { title: 'Done', description: 'Completed tasks', position: 2 },
    ];

    for (const column of columns) {
      await Column.create(column);
    }

    console.log('Initial columns created successfully.');
  } catch (error) {
    console.error('Error creating initial columns:', error);
  } finally {
    await sequelize.close();
  }
};

initializeColumns();