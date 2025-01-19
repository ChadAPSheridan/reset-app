import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import taskRoutes from './routes/taskRoutes';
import authRoutes from './routes/authRoutes';
import columnRoutes from './routes/columnRoutes'; // Import column routes
import userRoutes from './routes/userRoutes'; // Import user routes

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' })); // Increase payload size limit
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // Increase payload size limit

// Set up routes
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/columns', columnRoutes); // Add column routes
app.use('/api/users', userRoutes); // Add user routes

let server: any;

if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export { app, server };