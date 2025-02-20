import '../axiosSetup'; // Import the Axios setup
import axiosInstance from '../axiosSetup';

// Task APIs
// Get tasks by project ID
export const getTasks = (projectId: any) => axiosInstance.get(`/api/tasks/${projectId}`);
export const createTask = (task: any) => axiosInstance.post('/api/tasks', task);
export const updateTask = (taskId: any, updatedTask: any) => axiosInstance.put(`/tasks/${taskId}`, updatedTask);
export const deleteTask = (taskId: any) => axiosInstance.delete(`/tasks/${taskId}`);

// Column APIs
export const getColumns = (projectId: any) => axiosInstance.get(`/api/columns/${projectId}`);
export const createColumn = (column: any) => axiosInstance.post('/api/columns', column);
export const updateColumn = (columnId: any, updatedColumn: any) => axiosInstance.put(`/columns/${columnId}`, updatedColumn);
export const deleteColumn = (columnId: any) => axiosInstance.delete(`/columns/${columnId}`);

// User APIs
export const getUsers = () => axiosInstance.get('/api/users');
export const createUser = (user: any) => axiosInstance.post('/api/users', user);
export const updateUser = (userId: any, updatedUser: any) => axiosInstance.put(`/users/${userId}`, updatedUser);
export const deleteUser = (userId: any) => axiosInstance.delete(`/users/${userId}`);

// Auth APIs
export const login = (credentials: any) => axiosInstance.post('/api/auth/login', credentials);