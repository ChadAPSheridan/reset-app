import '../axiosSetup'; // Import the Axios setup
import axiosInstance from '../axiosSetup';

// Task APIs
// Get tasks by project ID
export const getTasks = (projectId: any) => axiosInstance.get(`/api/tasks/${projectId}`);
export const createTask = (task: any) => axiosInstance.post('/api/tasks', task);
export const updateTask = (taskId: any, updatedTask: any) => axiosInstance.put(`/api/tasks/${taskId}`, updatedTask);
export const deleteTask = (taskId: any) => axiosInstance.delete(`/api/tasks/${taskId}`);

// Column APIs
export const getColumns = (projectId: any) => axiosInstance.get(`/api/columns/${projectId}`);
export const createColumn = (column: any) => axiosInstance.post('/api/columns', column);
export const updateColumn = (columnId: any, updatedColumn: any) => axiosInstance.put(`/api/columns/${columnId}`, updatedColumn);
export const deleteColumn = (columnId: any) => axiosInstance.delete(`/api/columns/${columnId}`);

// User APIs
export const getUsers = () => axiosInstance.get('/api/users');
export const createUser = (user: any) => axiosInstance.post('/api/users', user);
export const updateUser = (userId: any, updatedUser: any) => axiosInstance.put(`/api/users/${userId}`, updatedUser);
export const deleteUser = (userId: any) => axiosInstance.delete(`/api/users/${userId}`);

// Project APIs
export const getProjects = () => axiosInstance.get('/api/projects');
export const createProject = (project: any) => axiosInstance.post('/api/projects', project);
export const updateProject = (projectId: any, updatedProject: any) => axiosInstance.put(`/api/projects/${projectId}`, updatedProject);
export const deleteProject = (projectId: any) => axiosInstance.delete(`/api/projects/${projectId}`);
// Auth APIs
export const login = (credentials: any) => axiosInstance.post('/api/auth/login', credentials);