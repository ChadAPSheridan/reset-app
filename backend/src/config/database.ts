import { Sequelize } from 'sequelize';

const databaseName = 'reset_app';
const sequelize = new Sequelize(databaseName, 'reset_user', 'your_password', {
  host: 'localhost',
  dialect: 'mariadb',
  // logging: console.log, // Enable logging for debugging
});

export const connectToDatabase = async () => {
  try {
    // Create the database if it doesn't exist
    const sequelizeWithoutDb = new Sequelize('mysql://reset_user:your_password@localhost');
    await sequelizeWithoutDb.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
    await sequelizeWithoutDb.close();

    await sequelize.authenticate();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;