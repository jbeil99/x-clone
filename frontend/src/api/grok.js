// src/api/grok.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/grok',
  timeout: 10000,
});

// ✅ Add interceptor to attach JWT token
apiClient.interceptors.request.use(
  config => {
    const accessToken = localStorage.getItem('access'); // Use 'access' key
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const sendMessage = async (message) => {
  return apiClient.post('/api/chat/', { message });
};



apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refresh')
    ) {
      originalRequest._retry = true; // Prevent infinite loop

      try {
        // Replace with your actual refresh endpoint
        const { data } = await axios.post(
          'http://localhost:8000/auth/token/refresh/',
          { refresh: localStorage.getItem('refresh') }
        );

        localStorage.setItem('access', data.access);
        originalRequest.headers['Authorization'] = `Bearer ${data.access}`;

        return apiClient(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // Redirect to login or show error
      }
    }

    return Promise.reject(error);
  }
);