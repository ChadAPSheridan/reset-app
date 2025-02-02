import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // Include credentials in requests
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Add a request interceptor to include the token in the headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Task APIs
export const getTasks = () => api.get('/tasks');
export const createTask = (task: any) => api.post('/tasks', task);
export const updateTask = (taskId: number, updatedTask: any) => api.put(`/tasks/${taskId}`, updatedTask);
export const deleteTask = (taskId: number) => api.delete(`/tasks/${taskId}`);

// Column APIs
export const getColumns = () => api.get('/columns');
export const createColumn = (column: any) => api.post('/columns', column);
export const updateColumn = (columnId: number, updatedColumn: any) => api.put(`/columns/${columnId}`, updatedColumn);
export const deleteColumn = (columnId: number) => api.delete(`/columns/${columnId}`);

// User APIs
export const getUsers = () => api.get('/users');
export const createUser = (user: any) => api.post('/users', user);
export const updateUser = (userId: number, updatedUser: any) => api.put(`/users/${userId}`, updatedUser);
export const deleteUser = (userId: number) => api.delete(`/users/${userId}`);

// Auth APIs
export const login = (credentials: any) => api.post('/auth/login', credentials);