
// src/api/grok.js

import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/grok',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  config => {
    const accessToken = sessionStorage.getItem('access');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Add refresh logic
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      sessionStorage.getItem('refresh')
    ) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          'http://localhost:8000/auth/token/refresh/',
          { refresh: sessionStorage.getItem('refresh') }
        );

        const { access, refresh } = refreshResponse.data;
        sessionStorage.setItem('access', access);
        sessionStorage.setItem('refresh', refresh);

        originalRequest.headers['Authorization'] = `Bearer ${access}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // Redirect to /login or show error
      }
    }

    return Promise.reject(error);
  }
);

export const sendMessage = async (message) => {
  return apiClient.post('/api/chat/', { message });
};