import apiService from './apiService';
import { Client } from '../types/modelType';

export const addClient = async (client: Client, ) => {
  const response = await apiService.post('/manage/clients', client);
  return response;
};


export const editClient = async (client: Client, ) => {
  const response = await apiService.put('/manage/clients', client);
  return response;
};

export const getClient = async (id: number) => {
  const response = await apiService.get('/manage/clients', {
    params: {
      query: 'get',
      id: id
    }
  });
  return response;
};

export const getCountClients = async () => {
  const response = await apiService.get('/manage/clients', {
    params: {
      query: 'count'
    }
  });
  return response;
};

export const deleteClient = async (id: number) => {
  const response = await apiService.delete(`/manage/clients`, {
    params: { 
      id: id 
    }
  });
  return response;
};