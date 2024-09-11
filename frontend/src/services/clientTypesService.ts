import apiService from './apiService';

export const listClientTypes = async () => {
  const response = await apiService.get('/manage/clienttypes', {
    params: {
      query: 'list'
    }
  });
  return response;
};