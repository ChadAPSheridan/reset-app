import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getTasks = () => api.get('/tasks');
export const createTask = (task: any) => api.post('/tasks', task);

export const updateTask = (taskId: number, updatedTask: any) => {
  return api.put(`/tasks/${taskId}`, updatedTask);
};

export const deleteTask = (taskId: number) => {
  return api.delete(`/tasks/${taskId}`);
};