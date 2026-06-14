import api from "../../../shared/lib/api/axios";
import type { Sale, CreateSaleData } from "../types/salesType";

const getSales = async (): Promise<Sale[]> => {
    const response = await api.get('/sales');
    return response.data;
};

const createSale = async (data: CreateSaleData): Promise<Sale> => {
    const response = await api.post('/sales', data);
    return response.data;
};

export default {
    getSales,
    createSale
};
