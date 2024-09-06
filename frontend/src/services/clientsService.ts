import apiService from './apiService';

export const addClient = async (form: object, ) => {
  const response = await apiService.post('/manage/clients', form);
  return response;
};