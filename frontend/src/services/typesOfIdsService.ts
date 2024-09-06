import apiService from './apiService';

export const listTypesOfIds = async () => {
  const response = await apiService.get('/manage/typesofids', {
    params: {
      query: 'list'
    }
  });
  return response;
};