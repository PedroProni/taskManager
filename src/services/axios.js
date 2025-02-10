import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(config => {
  return config;
});

api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.error('Request failed:', error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
