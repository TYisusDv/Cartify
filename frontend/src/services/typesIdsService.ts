import apiService from './apiService';

export const listTypesIds = async () => {
  const response = await apiService.get('/manage/typesids', {
    params: {
      query: 'list'
    }
  });
  return response.data;
};