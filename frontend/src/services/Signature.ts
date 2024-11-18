import apiService from './apiService';

export const addSignature = async (signature_buyer: string, signature_guarantor: string, signature_seller: string, sale_id?: number) => {
    const response = await apiService.post('/manage/signatures', {
        signature_buyer: signature_buyer,
        signature_guarantor: signature_guarantor,
        signature_seller: signature_seller,
        sale_id: sale_id
    });
    return response.data;
};