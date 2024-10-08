import { SelectGroupType, TableType } from '../types/componentsType';
import apiService from './apiService';

export const getTable = async (endpoint: string, params: TableType) => {
  const response = await apiService.get(endpoint, {
    params: params
  });
  return response.data;
};

export const getList = async (endpoint: string, params: SelectGroupType) => {
  const response = await apiService.get(endpoint, {
    params: params
  });
  return response.data;
};