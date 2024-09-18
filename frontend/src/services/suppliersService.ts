import apiService from './apiService';
import { Supplier } from '../types/modelType';

export const getSupplier = async (supplier_id: number) => {
  const response = await apiService.get('/manage/suppliers', {
    params: {
      query: 'get',
      id: supplier_id,
    }
  });
  return response;
};

export const getCountSuppliers = async () => {
  const response = await apiService.get('/manage/suppliers', {
    params: {
      query: 'count',
    }
  });
  return response;
};

export const addSupplier = async (form: Supplier) => {
  const response = await apiService.post('/manage/suppliers', form);
  return response;
};

export const editSupplier = async (form: Supplier) => {
  const response = await apiService.put('/manage/suppliers', form);
  return response;
};

export const deleteSupplier = async (supplier_id: number) => {
  const response = await apiService.delete('/manage/suppliers', {
    params: {
      id: supplier_id,
    }
  });
  return response;
};