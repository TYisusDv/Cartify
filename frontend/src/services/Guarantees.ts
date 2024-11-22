import { Warranty } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/guarantees', {
        params: {
            query: 'count',
        }
    });
    return response.data;
};

export const getWarranty = async (warranty: Warranty) => {
    const response = await apiService.get('/manage/guarantees', {
        params: {
            query: 'get',
            id: warranty.id,
        }
    });
    return response.data;
};

export const addWarranty = async (warranty: Warranty) => {
    const response = await apiService.post('/manage/guarantees', warranty);
    return response.data;
};

export const editWarranty = async (warranty: Warranty) => {
    const response = await apiService.put('/manage/guarantees', warranty);
    return response.data;
};

export const deleteWarranty = async (warranty: Warranty) => {
    const response = await apiService.delete('/manage/guarantees', {
        params: {
            id: warranty.id,
        }
    });
    return response.data;
};