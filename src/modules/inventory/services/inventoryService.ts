import api from "../../../shared/lib/api/axios";
import type { Product, InventoryMovement } from "../types/inventoryType";

const getProducts = async (): Promise<Product[]> => {
    const response = await api.get('/inventory/products');
    return response.data;
};

const createProduct = async (data: Partial<Product>): Promise<Product> => {
    const response = await api.post('/inventory/products', data);
    return response.data;
};

const updateProduct = async (id: number, data: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/inventory/products/${id}`, data);
    return response.data;
};

const recordMovement = async (id: number, data: { type: 'in' | 'out', amount: number, date?: string }): Promise<InventoryMovement> => {
    const response = await api.post(`/inventory/products/${id}/movements`, data);
    return response.data;
};

const getMovements = async (id: number): Promise<InventoryMovement[]> => {
    const response = await api.get(`/inventory/products/${id}/movements`);
    return response.data;
};

export default {
    getProducts,
    createProduct,
    updateProduct,
    recordMovement,
    getMovements
};
