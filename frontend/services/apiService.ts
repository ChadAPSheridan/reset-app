import '../axiosSetup'; // Import the Axios setup
import axiosInstance from '../axiosSetup';

// Task APIs
export const getTasks = () => axiosInstance.get('/tasks');
export const createTask = (task: any) => axiosInstance.post('/tasks', task);
export const updateTask = (taskId: number, updatedTask: any) => axiosInstance.put(`/tasks/${taskId}`, updatedTask);
export const deleteTask = (taskId: number) => axiosInstance.delete(`/tasks/${taskId}`);

// Column APIs
export const getColumns = () => axiosInstance.get('/columns');
export const createColumn = (column: any) => axiosInstance.post('/columns', column);
export const updateColumn = (columnId: number, updatedColumn: any) => axiosInstance.put(`/columns/${columnId}`, updatedColumn);
export const deleteColumn = (columnId: number) => axiosInstance.delete(`/columns/${columnId}`);

// User APIs
export const getUsers = () => axiosInstance.get('/users');
export const createUser = (user: any) => axiosInstance.post('/users', user);
export const updateUser = (userId: number, updatedUser: any) => axiosInstance.put(`/users/${userId}`, updatedUser);
export const deleteUser = (userId: number) => axiosInstance.delete(`/users/${userId}`);

// Auth APIs
export const login = (credentials: any) => axiosInstance.post('/auth/login', credentials);