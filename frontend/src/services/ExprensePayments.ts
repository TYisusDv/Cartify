import { ExpensePayments } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/expenses/payments', {
        params: {
            query: 'count',
        }
    });
    return response.data;
};

export const listExpensePayments = async () => {
    const response = await apiService.get('/manage/expenses/payments', {
        params: {
            query: 'list'
        }
    });
    return response.data;
};

export const getExpensePayments = async (expense_payment: ExpensePayments) => {
    const response = await apiService.get('/manage/expenses/payments', {
        params: {
            query: 'get',
            id: expense_payment.id,
        }
    });
    return response.data;
};

export const addExpensePayments = async (expense_payment: ExpensePayments) => {
    const response = await apiService.post('/manage/expenses/payments', expense_payment);
    return response.data;
};

export const editExpensePayments = async (expense_payment: ExpensePayments) => {
    const response = await apiService.put('/manage/expenses/payments', expense_payment);
    return response.data;
};

export const deleteExpensePayments = async (expense_payment: ExpensePayments) => {
    const response = await apiService.delete('/manage/expenses/payments', {
        params: {
            id: expense_payment.id,
        }
    });
    return response.data;
};


export const getCountPayments = async (id: string | undefined) => {
    const response = await apiService.get('/manage/expenses/payments', {
      params: {
        query: 'count',
        id: id
      }
    });
    return response.data;
  };
  