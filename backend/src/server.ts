import { json } from 'body-parser';
import { connectToDatabase } from './config/database'; // Ensure this path is correct
import { app } from './app'; // Use named import
import Task from './models/taskModel'; // Import the Task model
import User from './models/userModel';
import Column from './models/columnModel';
import bcrypt from 'bcrypt';

const PORT = process.env.PORT || 3001;

// Middleware
app.use(json());

const initializeDatabase = async () => {
  try {
    await connectToDatabase();

    // Synchronize models with the database
    await Column.sync();
    await Task.sync();
    await User.sync();

    console.log('Database and tables synchronized successfully.');

    // Check if admin user exists
    const adminUser = await User.findOne({ where: { username: 'admin' } });
    if (!adminUser) {
      const adminPassword = 'admin_password'; // Replace with a secure password generation method
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        firstName: 'Admin',
        lastName: 'User',
        username: 'admin',
        password: hashedPassword,
        permissionLevel: 'admin',
      });
      console.log(`Admin user created with password: ${adminPassword}`);
    } else {
      console.log('Admin user already exists.');
    }

    // Check if any columns exist
    const columns = await Column.findAll();
    if (columns.length === 0) {
      // Add default columns
      await Column.bulkCreate([
        { title: 'To Do', description: 'Tasks to be done', position: 1 },
        { title: 'In Process', description: 'Tasks in progress', position: 2 },
        { title: 'Review', description: 'Tasks to be reviewed', position: 3 },
        { title: 'Done', description: 'Completed tasks', position: 4 },
      ]);
      console.log('Default columns created: To Do, In Process, Done');
    } else {
      console.log('Columns already exist.');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// Initialize the database and start the server
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});