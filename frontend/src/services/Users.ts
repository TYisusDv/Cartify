import { User } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/users', {
        params: {
            query: 'count',
        }
    });
    return response.data;
};

export const getUser = async (user: User) => {
    const response = await apiService.get('/manage/users', {
        params: {
            query: 'get',
            id: user.id,
        }
    });
    return response.data;
};

export const addUser = async (user: User) => {
    const response = await apiService.post('/manage/users', user);
    return response.data;
};

export const editUser = async (user: User) => {
    const response = await apiService.put('/manage/users', user);
    return response.data;
};

export const deleteUser = async (user: User) => {
    const response = await apiService.delete('/manage/users', {
        params: {
            id: user.id,
        }
    });
    return response.data;
};