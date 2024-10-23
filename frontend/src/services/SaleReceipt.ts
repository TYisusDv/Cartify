import apiService from './apiService';
import { SaleReceipt } from '../types/modelType';

export const getSaleReceipt = async (saleReceipt: SaleReceipt) => {
  const response = await apiService.get('/manage/sale/receipt', {
    params: {
      query: 'get',
      id: saleReceipt.id
    }
  });
  return response.data;
};

export const getCountSaleReceipt = async () => {
  const response = await apiService.get('/manage/sale/receipt', {
    params: {
      query: 'count',
    }
  });
  return response.data;
};


export const addSaleReceipt = async (saleReceipt: SaleReceipt) => {
  const response = await apiService.post('/manage/sale/receipt', saleReceipt);
  return response.data;
};

export const editSaleReceipt = async (saleReceipt: SaleReceipt) => {
  const response = await apiService.put('/manage/sale/receipt', saleReceipt);
  return response.data;
};