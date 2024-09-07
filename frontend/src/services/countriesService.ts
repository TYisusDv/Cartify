import apiService from './apiService';

export const listCountries = async () => {
  const response = await apiService.get('/manage/countries', {
    params: {
      query: 'list'
    }
  });
  return response;
};