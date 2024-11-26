import apiService from './apiService';

export const getInfo = async () => {
    const response = await apiService.get('/home', {
        params: {
            query: 'info',
        }
    });
    return response.data;
};