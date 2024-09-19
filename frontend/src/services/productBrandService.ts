import apiService from './apiService';
import { ProductBrand } from '../types/modelType';

export const getProductBrand = async (selected_id: number) => {
  const response = await apiService.get('/manage/product/brands', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response;
};

export const getCountProductBrands = async () => {
  const response = await apiService.get('/manage/product/brands', {
    params: {
      query: 'count',
    }
  });
  return response;
};

export const addProductBrand = async (form: ProductBrand) => {
  const response = await apiService.post('/manage/product/brands', form);
  return response;
};

export const editProductBrand = async (form: ProductBrand) => {
  const response = await apiService.put('/manage/product/brands', form);
  return response;
};

export const deleteProductBrand = async (selected_id: number) => {
  const response = await apiService.delete('/manage/product/brands', {
    params: {
      id: selected_id,
    }
  });
  return response;
};