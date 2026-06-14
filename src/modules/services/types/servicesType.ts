import type { Operator } from "../../operator/types/operatorType";

export interface MasterService {
    id: number;
    entity_id: number;
    name: string;
    price: number;
    employee_percentage: number;
    status: boolean;
    created_at: string;
    updated_at: string;
}

export interface ServicePerformance {
    id: number;
    order_id: number;
    service_id: number;
    operator_id: number;
    quantity: number;
    price_snapshot: number;
    commission_percentage_snapshot: number;
    total_gross: number;
    discount_percentage: number;
    discount_amount: number;
    total_net: number;
    proportional_cash: number;
    proportional_transfer: number;
    is_paid_to_employee: boolean;
    service?: MasterService;
    employee?: {
        operator: Operator;
    };
}

export interface ServiceOrder {
    id: number;
    entity_id: number;
    total_net: number;
    payment_method: 'cash' | 'transfer' | 'mixed';
    cash_amount: number;
    transfer_amount: number;
    transaction_token?: string;
    date: string;
    items?: ServicePerformance[];
}

export interface CreateServiceOrderData {
    payment_method: 'cash' | 'transfer' | 'mixed';
    cash_amount?: number;
    transfer_amount?: number;
    transaction_token?: string;
    items: {
        service_id: number;
        operator_id: number;
        quantity: number;
        discount_percentage: number;
    }[];
}
