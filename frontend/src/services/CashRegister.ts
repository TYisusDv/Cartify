import apiService from './apiService';
import { CashRegister } from '../types/modelType';

export const getCashRegister = async (cashRegister: CashRegister) => {
  const response = await apiService.get('/manage/cashregister', {
    params: {
      query: 'get',
      id: cashRegister.id
    }
  });
  return response.data;
};

export const getCountCashRegister = async (cashRegister?: CashRegister) => {
  const response = await apiService.get('/manage/cashregister', {
    params: {
      query: 'count',
      ...cashRegister
    }
  });
  return response.data;
};

export const addCashRegister = async (cashRegister: CashRegister) => {
  const response = await apiService.post('/manage/cashregister', cashRegister);
  return response.data;
};

export const editCashRegister = async (cashRegister: CashRegister) => {
  const response = await apiService.put('/manage/cashregister', cashRegister);
  return response.data;
};


export const deleteCashRegister = async (cashRegister: CashRegister) => {
  const response = await apiService.delete('/manage/cashregister', {
    params: {
      id: cashRegister.id
    }
  });
  return response.data;
};