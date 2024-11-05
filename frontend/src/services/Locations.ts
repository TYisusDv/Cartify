import { Location } from '../types/modelType';
import apiService from './apiService';

export const getCount = async () => {
    const response = await apiService.get('/manage/locations', {
        params: {
            query: 'count',
        }
    });
    return response.data;
};

export const listLocations = async () => {
    const response = await apiService.get('/manage/locations', {
        params: {
            query: 'list'
        }
    });
    return response.data;
};

export const getLocation = async (location: Location) => {
    const response = await apiService.get('/manage/locations', {
        params: {
            query: 'get',
            id: location.id,
        }
    });
    return response.data;
};

export const addLocation = async (location: Location) => {
    const response = await apiService.post('/manage/locations', location);
    return response.data;
};

export const editLocation = async (location: Location) => {
    const response = await apiService.put('/manage/locations', location);
    return response.data;
};

export const deleteLocation = async (location: Location) => {
    const response = await apiService.delete('/manage/locations', {
        params: {
            id: location.id,
        }
    });
    return response.data;
};