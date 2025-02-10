import axios from 'axios';
import Auth from './Auth';

const api = axios.create({
  baseURL: 'http://localhost:3005',
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = Auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default api;
