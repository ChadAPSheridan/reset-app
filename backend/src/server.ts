import { json } from 'body-parser';
import { connectToDatabase } from './config/database'; // Ensure this path is correct
import app from './app';
import Task from './models/taskModel'; // Import the Task model

const PORT = process.env.PORT || 3001;

// Middleware
app.use(json());

// Connect to the database
connectToDatabase()
    .then(() => {
        // Synchronize the model with the database
        Task.sync().then(() => {
            console.log('Task model synchronized with the database.');
        });

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err: any) => { // Explicitly type 'err' as 'any'
        console.error('Database connection failed:', err);
    });