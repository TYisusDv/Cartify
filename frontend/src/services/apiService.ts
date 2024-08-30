import axios from 'axios';
import { TOKEN_KEY } from '../utils/authUtils';

const apiService = axios.create({
  baseURL: 'http://127.0.0.1:8000/v1',
});

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default apiService;