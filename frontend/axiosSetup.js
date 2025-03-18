import axios from 'axios';

console.log('axiosSetup.js loaded');

// Create an Axios instance with configuration
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
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
      // console.log('Authorization header set:', config.headers.Authorization);
    } else {
      console.log('No token found in localStorage');
    }
    // console.log('Axios interceptor called with config:', config);
    return config;
  },
  (error) => {
    console.error('Axios interceptor error:', error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    // Refresh the authentication token on successful API calls
    const newToken = response.headers['authorization'];
    if (newToken) {
      localStorage.setItem('authToken', newToken);
    }
    return response;
  },
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      alert('Session expired or access denied. Redirecting to login page.');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;