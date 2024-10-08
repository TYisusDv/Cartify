import apiService from './apiService';
import { Tax } from '../types/modelType';

export const getTax = async (selected_id: number) => {
  const response = await apiService.get('/manage/taxes', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response.data;
};

export const getCountTaxes = async () => {
  const response = await apiService.get('/manage/taxes', {
    params: {
      query: 'count',
    }
  });
  return response.data;
};

export const addTax = async (form: Tax) => {
  const response = await apiService.post('/manage/taxes', form);
  return response.data;
};

export const editTax = async (form: Tax) => {
  const response = await apiService.put('/manage/taxes', form);
  return response.data;
};

export const deleteTax = async (selected_id: number) => {
  const response = await apiService.delete('/manage/taxes', {
    params: {
      id: selected_id,
    }
  });
  return response.data;
};