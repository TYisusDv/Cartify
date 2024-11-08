import { Expense } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/expenses', {
        params: {
            query: 'count',
        }
    });
    return response.data;
};

export const listExpenses = async () => {
    const response = await apiService.get('/manage/expenses', {
        params: {
            query: 'list'
        }
    });
    return response.data;
};

export const getExpense = async (expense: Expense) => {
    const response = await apiService.get('/manage/expenses', {
        params: {
            query: 'get',
            id: expense.id,
        }
    });
    return response.data;
};

export const addExpense = async (expense: Expense) => {
    const response = await apiService.post('/manage/expenses', expense);
    return response.data;
};

export const editExpense = async (expense: Expense) => {
    const response = await apiService.put('/manage/expenses', expense);
    return response.data;
};

export const deleteExpense = async (expense: Expense) => {
    const response = await apiService.delete('/manage/expenses', {
        params: {
            id: expense.id,
        }
    });
    return response.data;
};