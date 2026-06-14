import api from '../../../shared/lib/api/axios';
import type { PendingBillingItem, Invoice } from '../types/billingType';

const billingModuleService = {
    getPendingItems: async (): Promise<PendingBillingItem[]> => {
        const response = await api.get('/billing/pending');
        return response.data;
    },

    getInvoices: async (): Promise<Invoice[]> => {
        const response = await api.get('/billing');
        return response.data;
    },

    createInvoice: async (data: any): Promise<Invoice> => {
        const response = await api.post('/billing', data);
        return response.data;
    },

    sendToProvider: async (id: number): Promise<any> => {
        const response = await api.post(`/billing/${id}/send`);
        return response.data;
    }
};

export default billingModuleService;
