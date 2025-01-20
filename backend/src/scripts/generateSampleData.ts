import { connectToDatabase } from '../config/database';
import User from '../models/userModel';
import Task from '../models/taskModel';
import Column from '../models/columnModel';
import bcrypt from 'bcrypt';

const generateSampleData = async () => {
  try {
    await connectToDatabase();

    // Create sample users 
    const users = [
      { firstName: 'John', lastName: 'Doe', username: 'johndoe', password: 'Password123!', permissionLevel: 'user' },
      { firstName: 'Jane', lastName: 'Smith', username: 'janesmith', password: 'Password123!', permissionLevel: 'user' },
      { firstName: 'Admin', lastName: 'User', username: 'admin', password: 'AdminPassword123!', permissionLevel: 'admin' },
    ];

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await User.create({ ...user, password: hashedPassword });
    }

    // Create sample columns
    const columns = [
      { title: 'To Do', description: 'Tasks to be done', position: 1 },
      { title: 'In Process', description: 'Tasks in progress', position: 2 },
      { title: 'Done', description: 'Completed tasks', position: 3 },
    ];

    for (const column of columns) {
      await Column.create(column);
    }

    // Create sample tasks
    const tasks = [
      { title: 'Task 1', description: 'Description for Task 1', columnId: 1, row: 0, userId: 1 },
      { title: 'Task 2', description: 'Description for Task 2', columnId: 1, row: 1, userId: 2 },
      { title: 'Task 3', description: 'Description for Task 3', columnId: 2, row: 0, userId: 1 },
      { title: 'Task 4', description: 'Description for Task 4', columnId: 2, row: 1, userId: 2 },
      { title: 'Task 5', description: 'Description for Task 5', columnId: 3, row: 0, userId: 1 },
    ];

    for (const task of tasks) {
      await Task.create(task);
    }

    console.log('Sample data generated successfully.');
  } catch (error) {
    console.error('Error generating sample data:', error);
  }
};

generateSampleData();