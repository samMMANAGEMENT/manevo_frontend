export type Expense = {
    id: number;
    entity_id: number;
    category: string;
    description: string | null;
    amount: number;
    date: string;
    payment_method: string;
    user_id: number;
    user?: {
        name: string;
    };
    created_at: string;
    updated_at: string;
};

export type ExpenseCreateDTO = {
    category: string;
    amount: number;
    date: string;
    description?: string;
    payment_method?: string;
};
