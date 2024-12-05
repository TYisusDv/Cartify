import { UserBreak } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/users/breaks', {
        params: {
            query: 'count'
        }
    });
    return response.data;
};

export const getMyCount = async () => {
    const response = await apiService.get('/app/breaks', {
        params: {
            query: 'count'
        }
    });
    return response.data;
};


export const listBreaks = async () => {
    const response = await apiService.get('/manage/users/breaks', {
        params: {
            query: 'list'
        }
    });
    return response.data;
};

export const getBreak = async (user_break: UserBreak) => {
    const response = await apiService.get('/manage/users/breaks', {
        params: {
            query: 'get',
            id: user_break.id,
        }
    });
    return response.data;
};

export const addBreak = async (user_break: UserBreak) => {
    const response = await apiService.post('/manage/users/breaks', user_break);
    return response.data;
};

export const editBreak = async (user_break: UserBreak) => {
    const response = await apiService.put('/manage/users/breaks', user_break);
    return response.data;
};

export const editMyBreak = async (user_break: UserBreak) => {
    const response = await apiService.put('/app/breaks', user_break);
    return response.data;
};

export const deleteBreak = async (user_break: UserBreak) => {
    const response = await apiService.delete('/manage/users/breaks', {
        params: {
            id: user_break.id,
        }
    });
    return response.data;
};