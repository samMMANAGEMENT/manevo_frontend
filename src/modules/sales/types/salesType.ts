import type { Product } from "../../inventory/types/inventoryType";

export interface SaleItem {
    id: number;
    sale_id: number;
    product_id: number;
    quantity: number;
    price_at_sale: number;
    cost_at_sale: number;
    subtotal: number;
    product?: Product;
}

export interface Sale {
    id: number;
    entity_id: number;
    seller_id: number;
    total: number;
    total_profit: number;
    payment_method: 'cash' | 'transfer' | 'mixed';
    cash_amount: number;
    transfer_amount: number;
    date: string;
    items?: SaleItem[];
    seller?: {
        operator?: {
            name: string;
        };
    };
}

export interface CreateSaleData {
    payment_method: 'cash' | 'transfer' | 'mixed';
    cash_amount?: number;
    transfer_amount?: number;
    items: {
        product_id: number;
        quantity: number;
    }[];
}
