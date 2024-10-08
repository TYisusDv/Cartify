import apiService from './apiService';
import { InventoryType } from '../types/modelType';

export const getInventoryType = async (selected_id: number) => {
  const response = await apiService.get('/manage/inventory/types', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response.data;
};

export const getCountInventoryTypes = async () => {
  const response = await apiService.get('/manage/inventory/types', {
    params: {
      query: 'count',
    }
  });
  return response.data;
};

export const addInventoryType = async (form: InventoryType) => {
  const response = await apiService.post('/manage/inventory/types', form);
  return response.data;
};

export const editInventoryType = async (form: InventoryType) => {
  const response = await apiService.put('/manage/inventory/types', form);
  return response.data;
};

export const deleteInventoryType = async (selected_id: number) => {
  const response = await apiService.delete('/manage/inventory/types', {
    params: {
      id: selected_id,
    }
  });
  return response.data;
};