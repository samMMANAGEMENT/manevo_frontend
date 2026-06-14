export interface Operator {
    id: number;
    type_document: string | null;
    document: string | null;
    mobile: string | null;
    user_id: number;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
        status: boolean;
        entity_id: number;
    };
}
