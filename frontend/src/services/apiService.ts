import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getTasks = () => api.get('/tasks');
export const createTask = (task: any) => api.post('/tasks', task);
export const updateTask = (taskId: number, updatedTask: any) => api.put(`/tasks/${taskId}`, updatedTask); // Ensure the URL is correct
export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}`);