import apiService from './apiService';
import { SaleStatus } from '../types/modelType';

export const getSaleStatus = async (saleStatus: SaleStatus) => {
  const response = await apiService.get('/manage/sale/status', {
    params: {
      query: 'get',
      id: saleStatus.id
    }
  });
  return response.data;
};

export const getCountSaleStatus = async () => {
  const response = await apiService.get('/manage/sale/status', {
    params: {
      query: 'count',
    }
  });
  return response.data;
};

export const addSaleStatus = async (saleStatus: SaleStatus) => {
  const response = await apiService.post('/manage/sale/status', saleStatus);
  return response.data;
};

export const editSaleStatus = async (saleStatus: SaleStatus) => {
  const response = await apiService.put('/manage/sale/status', saleStatus);
  return response.data;
};


export const deleteSaleStatus = async (saleStatus: SaleStatus) => {
  const response = await apiService.delete('/manage/sale/status', {
    params: {
      id: saleStatus.id
    }
  });
  return response.data;
};