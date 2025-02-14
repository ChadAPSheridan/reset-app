import axios from 'axios';

console.log('axiosSetup.js loaded');

// Create an Axios instance with configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // Include credentials in requests
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

// Set up Axios interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header set:', config.headers.Authorization);
    } else {
      console.log('No token found in localStorage');
    }
    console.log('Axios interceptor called with config:', config);
    return config;
  },
  (error) => {
    console.error('Axios interceptor error:', error);
    return Promise.reject(error);
  }
);

export default axiosInstance;