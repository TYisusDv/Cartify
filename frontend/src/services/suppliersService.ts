import apiService from './apiService';
import { Supplier } from '../types/modelType';

export const getSupplier = async (selected_id: string) => {
  const response = await apiService.get('/manage/suppliers', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response.data;
};

export const getCountSuppliers = async () => {
  const response = await apiService.get('/manage/suppliers', {
    params: {
      query: 'count',
    }
  });
  return response.data;
};

export const addSupplier = async (form: Supplier) => {
  const response = await apiService.post('/manage/suppliers', form);
  return response.data;
};

export const editSupplier = async (form: Supplier) => {
  const response = await apiService.put('/manage/suppliers', form);
  return response.data;
};

export const deleteSupplier = async (selected_id: string) => {
  const response = await apiService.delete('/manage/suppliers', {
    params: {
      id: selected_id,
    }
  });
  return response.data;
};