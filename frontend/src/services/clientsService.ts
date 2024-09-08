import { Client } from '../types/clientsType';
import apiService from './apiService';

export const addClient = async (form: Client, ) => {
  const response = await apiService.post('/manage/clients', form);
  return response;
};

export const getClient = async (id: string | undefined) => {
  const response = await apiService.get('/manage/clients', {
    params: {
      query: 'get',
      id: id
    }
  });
  return response;
};

export const deleteClient = async (id: string | undefined) => {
  const response = await apiService.delete(`/manage/clients`, {
    params: { 
      id: id 
    }
  });
  return response;
};