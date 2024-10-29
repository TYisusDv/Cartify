import apiService from './apiService';

export const getCount = async (filters: any) => {
  const response = await apiService.get('/statistics/sales', {
    params: {
      query: 'count',
      filters: filters
    }
  });
  return response.data;
};