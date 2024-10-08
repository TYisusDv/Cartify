import apiService from './apiService';
import { Sale, Inventory, SalePayment } from '../types/modelType';

export const addSale = async (sale: Sale, inventory: Inventory[], sale_payment: SalePayment) => {
  const response = await apiService.post('/manage/sales', {
    sale: sale,
    inventory: inventory,
    sale_payment: sale_payment
  });
  return response.data;
};