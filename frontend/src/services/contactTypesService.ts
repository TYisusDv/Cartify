import apiService from './apiService';

export const listContactTypes = async () => {
  const response = await apiService.get('/manage/contacttypes', {
    params: {
      query: 'list'
    }
  });
  return response;
};