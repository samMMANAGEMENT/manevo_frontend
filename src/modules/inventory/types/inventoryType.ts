export interface Product {
    id: number;
    name: string;
    quantity: number;
    unit_cost: number;
    selling_price: number;
    status: 'active' | 'out_of_stock' | 'inactive';
    package_size?: number;
    created_at: string;
    updated_at: string;
}

export interface InventoryMovement {
    id: number;
    product_id: number;
    user_id: number;
    type: 'in' | 'out';
    previous_quantity: number;
    movement_quantity: number;
    new_quantity: number;
    date: string;
    user?: {
        operator?: {
            name: string;
        };
    };
}
