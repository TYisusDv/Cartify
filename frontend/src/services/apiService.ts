import axios from 'axios';
import { getRefreshToken, getToken, removeRefreshToken, removeToken, saveToken } from '../utils/authUtils'; 

export const URL_BACKEND = process.env.REACT_APP_URL_BACKEND;

const apiService = axios.create({
  baseURL: URL_BACKEND,
});

apiService.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await apiService.post('/auth/refresh', { refresh: refreshToken });
          const response_data = response.data;
          const accessToken = response_data.resp.accessToken;
          saveToken(accessToken);

          apiService.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

          return apiService(originalRequest);
        } catch (refreshError) {
          removeToken();
          removeRefreshToken();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        }
      } else {
        removeToken();
        removeRefreshToken();
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiService;