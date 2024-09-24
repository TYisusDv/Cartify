import apiService from './apiService';
import { Product } from '../types/modelType';

export const getProduct = async (selected_id: string) => {
  const response = await apiService.get('/manage/products', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response;
};

export const getCountProducts = async () => {
  const response = await apiService.get('/manage/products', {
    params: {
      query: 'count',
    }
  });
  return response;
};

export const addProduct = async (form: Product) => {
  const response = await apiService.post('/manage/products', form);
  return response;
};

export const editProduct = async (form: Product) => {
  const response = await apiService.put('/manage/products', form);
  return response;
};

export const deleteProduct = async (selected_id: string) => {
  const response = await apiService.delete('/manage/products', {
    params: {
      id: selected_id,
    }
  });
  return response;
};