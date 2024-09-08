import { TableType } from '../types/tableType';
import apiService from './apiService';

export const getTable = async (endpoint: string, params: TableType) => {
  const response = await apiService.get(endpoint, {
    params: params
  });
  return response;
};