import apiService from './apiService';
import { Inventory } from '../types/modelType';

export const getInventory = async (selected_id: string | undefined) => {
  const response = await apiService.get('/app/inventory', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response.data;
};

export const getCountAllInventory = async () => {
  const response = await apiService.get('/app/inventory', {
    params: {
      query: 'count_all',
    }
  });
  return response.data;
};

export const getCountInventory = async (filters: any) => {
  const response = await apiService.get('/app/inventory', {
    params: {
      query: 'count',
      filters: filters
    }
  });
  return response.data;
};

export const getCountInventoryTransfer = async (filters: any) => {
  const response = await apiService.get('/app/inventory', {
    params: {
      query: 'count_transfer',
      filters: filters
    }
  });
  return response.data;
};

export const addInventory = async (form: Inventory[]) => {
  const response = await apiService.post('/app/inventory', {
    movements: form
  });
  return response.data;
};

export const editInventory = async (form: Inventory) => {
  const response = await apiService.put('/app/inventory', form);
  return response.data;
};

export const deleteInventory = async (selected_id: string | undefined) => {
  const response = await apiService.delete('/app/inventory', {
    params: {
      id: selected_id,
    }
  });
  return response.data;
};