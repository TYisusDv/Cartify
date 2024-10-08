import apiService from './apiService';
import { PaymentMethod } from '../types/modelType';

export const getPaymentMethod = async (selected_id: number) => {
  const response = await apiService.get('/manage/paymentmethods', {
    params: {
      query: 'get',
      id: selected_id,
    }
  });
  return response.data;
};

export const getCountPaymentMethods = async () => {
  const response = await apiService.get('/manage/paymentmethods', {
    params: {
      query: 'count',
    }
  });
  return response.data;
};

export const addPaymentMethod = async (form: PaymentMethod) => {
  const response = await apiService.post('/manage/paymentmethods', form);
  return response.data;
};

export const editPaymentMethod = async (form: PaymentMethod) => {
  const response = await apiService.put('/manage/paymentmethods', form);
  return response.data;
};

export const deletePaymentMethod = async (selected_id: number) => {
  const response = await apiService.delete('/manage/paymentmethods', {
    params: {
      id: selected_id,
    }
  });
  return response.data;
};