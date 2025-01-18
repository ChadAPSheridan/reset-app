import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getTasks = () => api.get('/tasks');
export const createTask = (task: any) => api.post('/tasks', task);
export const updateTask = (taskId: number, updatedTask: any) => api.put(`/tasks/${taskId}`, updatedTask);
export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}`);

export const getColumns = () => api.get('/columns');
export const createColumn = (column: any) => api.post('/columns', column);
export const updateColumn = (columnId: number, updatedColumn: any) => api.put(`/columns/${columnId}`, updatedColumn);
export const deleteColumn = (columnId: number) => api.delete(`/columns/${columnId}`);