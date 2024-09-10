import apiService from './apiService';

export const listTypesClients = async () => {
  const response = await apiService.get('/manage/typesclients', {
    params: {
      query: 'list'
    }
  });
  return response;
};