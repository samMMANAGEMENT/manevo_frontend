import type { Operator } from '../../operator/types/operatorType';

export interface PendingCommission {
    id: number;
    order_id: number;
    service_id: number;
    operator_id: number;
    quantity: number;
    price_snapshot: string;
    commission_percentage_snapshot: string;
    total_net: string;
    commission_amount: number;
    is_paid_to_employee: boolean;
    created_at: string;
    service?: {
        id: number;
        name: string;
        price: string;
    };
    order?: {
        id: number;
        date: string;
    };
}

export interface OperatorPayment {
    id: number;
    entity_id: number;
    operator_id: number;
    amount: string;
    payment_date: string;
    payment_method: string;
    status: 'Paid' | 'Pending';
    reference?: string;
    description?: string;
    user_id: number;
    created_at: string;
    operator?: Operator;
    performances?: Array<{
        id: number;
        service?: {
            name: string;
        }
    }>;
    user?: {
        id: number;
        name: string;
    };
}

export interface PaymentCreateDTO {
    operator_id: number;
    amount: number;
    payment_date: string;
    payment_method: string;
    status: 'Paid' | 'Pending';
    reference?: string;
    description?: string;
    performance_ids?: number[];
}
