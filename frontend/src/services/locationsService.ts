import apiService from './apiService';

export const listLocations = async () => {
  const response = await apiService.get('/manage/locations', {
    params: {
      query: 'list'
    }
  });
  return response.data;
};