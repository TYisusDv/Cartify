import apiService from './apiService';
import { CashRegister, Sale, SalePayment } from '../types/modelType';

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

export const getCountCashRegisterSales = async (sales?: Sale, filters?: any) => {
  const response = await apiService.get('/manage/cashregister/sales', {
    params: {
      query: 'count',
      filters: filters,
      ...sales
    }
  });
  return response.data;
};

export const getCountCashRegisterSalesPayments = async (sale_payments?: SalePayment, filters?: any) => {
  const response = await apiService.get('/manage/cashregister/sales', {
    params: {
      query: 'count_payments',
      filters: filters,
      ...sale_payments
    }
  });
  return response.data;
};