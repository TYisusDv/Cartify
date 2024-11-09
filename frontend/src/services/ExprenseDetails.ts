import { ExpenseDetails } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/expenses/details', {
        params: {
            query: 'count',
        }
    });
    return response.data;
};

export const listExpenseDetails = async () => {
    const response = await apiService.get('/manage/expenses/details', {
        params: {
            query: 'list'
        }
    });
    return response.data;
};

export const getExpenseDetails = async (expense_details: ExpenseDetails) => {
    const response = await apiService.get('/manage/expenses/details', {
        params: {
            query: 'get',
            id: expense_details.id,
        }
    });
    return response.data;
};

export const addExpenseDetails = async (expense_details: ExpenseDetails) => {
    const response = await apiService.post('/manage/expenses/details', expense_details);
    return response.data;
};

export const editExpenseDetails = async (expense_details: ExpenseDetails) => {
    const response = await apiService.put('/manage/expenses/details', expense_details);
    return response.data;
};

export const deleteExpenseDetails = async (expense_details: ExpenseDetails) => {
    const response = await apiService.delete('/manage/expenses/details', {
        params: {
            id: expense_details.id,
        }
    });
    return response.data;
};


export const getCountDetails = async (id: string | undefined) => {
    const response = await apiService.get('/manage/expenses/details', {
      params: {
        query: 'count',
        id: id
      }
    });
    return response.data;
  };
  