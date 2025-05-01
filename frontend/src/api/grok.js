import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  timeout: 10000,
});

const sendMessage = async (message) => {
  return apiClient.post('/grok/api/chat/', { message });
};

export default {
  sendMessage,
};