import apiService from './apiService';

export const getTable = async (endpoint: string, params: object) => {
  const response = await apiService.get(endpoint, {
    params: params
  });
  return response;
};