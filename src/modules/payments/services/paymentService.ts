import api from "../../../shared/lib/api/axios";
import type { OperatorPayment, PaymentCreateDTO, PendingCommission } from "../types/payment";

const getPayments = async (): Promise<OperatorPayment[]> => {
    const response = await api.get('/payments');
    return response.data;
};

const getPendingCommissions = async (operatorId?: number): Promise<PendingCommission[]> => {
    const response = await api.get('/payments/pending-commissions', {
        params: operatorId ? { operator_id: operatorId } : {}
    });
    return response.data;
};

const createPayment = async (data: PaymentCreateDTO): Promise<OperatorPayment> => {
    const response = await api.post('/payments', data);
    return response.data;
};

const deletePayment = async (id: number): Promise<void> => {
    await api.delete(`/payments/${id}`);
};

export default {
    getPayments,
    getPendingCommissions,
    createPayment,
    deletePayment
};
