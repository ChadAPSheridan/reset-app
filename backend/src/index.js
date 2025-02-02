const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pino = require('pino');
const http = require('http');
const socketIo = require('socket.io');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const sequelize = require('./config/database'); // Import Sequelize instance

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const logger = pino();

// Update CORS configuration
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));

app.use(express.json());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Reset App API',
      version: '1.0.0',
      description: 'API documentation for Reset App',
    },
  },
  apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Import routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes').router;
const taskRoutes = require('./routes/taskRoutes');
const columnRoutes = require('./routes/columnRoutes');

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/columns', columnRoutes);

// Socket.io setup
io.on('connection', (socket) => {
  logger.info('New client connected');
  socket.on('disconnect', () => {
    logger.info('Client disconnected');
  });
});

// Sync Sequelize models and start server
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}).catch(err => {
  logger.error('Unable to connect to the database:', err);
});