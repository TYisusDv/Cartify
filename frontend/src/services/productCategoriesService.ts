import apiService from './apiService';
import { ProductCategory } from '../types/modelType';

export const getProductCategory = async (selected_id: number) => {
  const response = await apiService.get('/manage/product/categories', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response.data;
};

export const getCountProductCategories = async () => {
  const response = await apiService.get('/manage/product/categories', {
    params: {
      query: 'count',
    }
  });
  return response.data;
};

export const addProductCategory = async (form: ProductCategory) => {
  const response = await apiService.post('/manage/product/categories', form);
  return response.data;
};

export const editProductCategory = async (form: ProductCategory) => {
  const response = await apiService.put('/manage/product/categories', form);
  return response.data;
};

export const deleteProductCategory = async (selected_id: number) => {
  const response = await apiService.delete('/manage/product/categories', {
    params: {
      id: selected_id,
    }
  });
  return response.data;
};