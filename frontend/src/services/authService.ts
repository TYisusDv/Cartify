import apiService from './apiService';

export const login = async (username: string, password: string) => {
  const response = await apiService.post('/auth/log-in', { username, password });
  return response;
};