import { ClientType } from '../types/modelType';
import apiService from './apiService';

export const listClientTypes = async () => {
  const response = await apiService.get('/manage/clienttypes', {
    params: {
      query: 'list'
    }
  });
  return response.data;
};


export const getCount = async () => {
  const response = await apiService.get('/manage/clienttypes', {
      params: {
          query: 'count',
      }
  });
  return response.data;
};

export const getClientType = async (client_type: ClientType) => {
  const response = await apiService.get('/manage/clienttypes', {
      params: {
          query: 'get',
          id: client_type.id,
      }
  });
  return response.data;
};

export const addClientType = async (client_type: ClientType) => {
  const response = await apiService.post('/manage/clienttypes', client_type);
  return response.data;
};

export const editClientType = async (client_type: ClientType) => {
  const response = await apiService.put('/manage/clienttypes', client_type);
  return response.data;
};

export const deleteClientType = async (client_type: ClientType) => {
  const response = await apiService.delete('/manage/clienttypes', {
      params: {
          id: client_type.id,
      }
  });
  return response.data;
};