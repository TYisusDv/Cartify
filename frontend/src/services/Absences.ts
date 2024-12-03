import { Absence } from '../types/modelType';
import apiService from './apiService';

export const getCount = async (id: number) => {
    const response = await apiService.get('/manage/users/absences', {
        params: {
            query: 'count',
            id: id
        }
    });
    return response.data;
};

export const listAbsences = async () => {
    const response = await apiService.get('/manage/users/absences', {
        params: {
            query: 'list'
        }
    });
    return response.data;
};

export const getAbsence = async (absence: Absence) => {
    const response = await apiService.get('/manage/users/absences', {
        params: {
            query: 'get',
            id: absence.id,
        }
    });
    return response.data;
};

export const addAbsence = async (absence: Absence) => {
    const response = await apiService.post('/manage/users/absences', absence);
    return response.data;
};

export const editAbsence = async (absence: Absence) => {
    const response = await apiService.put('/manage/users/absences', absence);
    return response.data;
};

export const deleteAbsence = async (absence: Absence) => {
    const response = await apiService.delete('/manage/users/absences', {
        params: {
            id: absence.id,
        }
    });
    return response.data;
};