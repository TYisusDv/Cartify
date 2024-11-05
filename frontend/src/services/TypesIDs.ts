import { TypeID } from '../types/modelType';
import apiService from './apiService';

export const listTypesIds = async () => {
  const response = await apiService.get('/manage/typesids', {
    params: {
      query: 'list'
    }
  });
  return response.data;
};

export const getCount = async () => {
  const response = await apiService.get('/manage/typesids', {
      params: {
          query: 'count',
      }
  });
  return response.data;
};

export const listTypesIDs = async () => {
  const response = await apiService.get('/manage/typesids', {
      params: {
          query: 'list'
      }
  });
  return response.data;
};

export const getTypeID = async (typeid: TypeID) => {
  const response = await apiService.get('/manage/typesids', {
      params: {
          query: 'get',
          id: typeid.id,
      }
  });
  return response.data;
};

export const addTypeID = async (typeid: TypeID) => {
  const response = await apiService.post('/manage/typesids', typeid);
  return response.data;
};

export const editTypeID = async (typeid: TypeID) => {
  const response = await apiService.put('/manage/typesids', typeid);
  return response.data;
};

export const deleteTypeID = async (typeid: TypeID) => {
  const response = await apiService.delete('/manage/typesids', {
      params: {
          id: typeid.id,
      }
  });
  return response.data;
};