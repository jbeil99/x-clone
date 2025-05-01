
import axios from 'axios';

const getToken = () => {
  return sessionStorage.getItem('access'); // 
};

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/grok',
  timeout: 10000,
});

apiClient.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

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

        sessionStorage.setItem('access', refreshResponse.data.access);
        originalRequest.headers['Authorization'] = `Bearer ${refreshResponse.data.access}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const sendMessage = async (message) => {
  return apiClient.post('/api/chat/', { message });
};