import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

export const getTasks = () => api.get('/tasks');
export const createTask = (task: any) => api.post('/tasks', task);
export const updateTask = (taskId: number, updatedTask: any) => {
  console.log(`Updating task with ID: ${taskId}`, updatedTask); // Debug log
  return api.put(`/tasks/${taskId}`, updatedTask);
};
export const deleteTask = (taskId: number) => {
  console.log(`Deleting task with ID: ${taskId}`); // Debug log
  return api.delete(`/tasks/${taskId}`);
};

export const getColumns = () => api.get('/columns');
export const createColumn = (column: any) => api.post('/columns', column);
export const updateColumn = (columnId: number, updatedColumn: any) => {
  console.log(`Updating column with ID: ${columnId}`, updatedColumn); // Debug log
  return api.put(`/columns/${columnId}`, updatedColumn);
};
export const deleteColumn = (columnId: number) => api.delete(`/columns/${columnId}`);

export const getUsers = () => api.get('/users');
export const createUser = (user: any) => api.post('/users', user);
export const updateUser = (userId: number, updatedUser: any) => api.put(`/users/${userId}`, updatedUser);
export const deleteUser = (userId: number) => api.delete(`/users/${userId}`);