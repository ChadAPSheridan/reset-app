import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('reset_app', 'reset_user', 'your_password', {
  host: 'localhost',
  dialect: 'mariadb',
  logging: console.log, // Enable logging for debugging
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default sequelize;