import apiService from './apiService';
import { Sale, Inventory, SalePayment } from '../types/modelType';

export const addSale = async (sale: Sale, inventory: Inventory[], salePayment: SalePayment) => {
  const response = await apiService.post('/manage/sales', {
    sale: sale,
    inventory: inventory,
    sale_payment: salePayment
  });
  return response.data;
};

export const addPayment = async (salePayment: SalePayment) => {
  const response = await apiService.post('/manage/sale/payments', salePayment);
  return response.data;
};

export const editPayment = async (salePayment: SalePayment) => {
  const response = await apiService.put('/manage/sale/payments', salePayment);
  return response.data;
};

export const getPayment = async (salePayment: SalePayment) => {
  const response = await apiService.get('/manage/sale/payments', {
    params: {
      query: 'get',
      id: salePayment.id
    }
  });
  return response.data;
};

export const getCountPayments = async (id: number) => {
  const response = await apiService.get('/manage/sale/payments', {
    params: {
      query: 'count',
      id: id
    }
  });
  return response.data;
};
