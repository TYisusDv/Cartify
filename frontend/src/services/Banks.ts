import { Bank } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/banks', {
        params: {
            query: 'count',
        }
    });
    return response.data;
};

export const listBanks = async () => {
    const response = await apiService.get('/manage/banks', {
        params: {
            query: 'list'
        }
    });
    return response.data;
};

export const getBank = async (bank: Bank) => {
    const response = await apiService.get('/manage/banks', {
        params: {
            query: 'get',
            id: bank.id,
        }
    });
    return response.data;
};

export const addBank = async (bank: Bank) => {
    const response = await apiService.post('/manage/banks', bank);
    return response.data;
};

export const editBank = async (bank: Bank) => {
    const response = await apiService.put('/manage/banks', bank);
    return response.data;
};

export const deleteBank = async (bank: Bank) => {
    const response = await apiService.delete('/manage/banks', {
        params: {
            id: bank.id,
        }
    });
    return response.data;
};