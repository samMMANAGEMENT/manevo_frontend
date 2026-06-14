import api from "../../../shared/lib/api/axios";

export interface PlatformUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
    entity: {
        id: number;
        name: string;
        description: string;
    } | null;
    plan: {
        id: number;
        name: string;
        slug: string;
        start_date: string;
        end_date: string | null;
        status: string;
    } | null;
}

export interface SaaSModule {
    id: number;
    name: string;
    slug: string;
}

export interface SaaSPlan {
    id: number;
    name: string;
    slug: string;
    price: number;
    duration: number;
    max_users: number;
    is_default: boolean;
    modulos: SaaSModule[];
}

const getPlatformUsers = async (): Promise<PlatformUser[]> => {
    const response = await api.get('/auth/saas-admin/usuarios');
    return response.data;
};

const getSaaSPlans = async (): Promise<SaaSPlan[]> => {
    const response = await api.get('/auth/saas-admin/planes');
    return response.data;
};

const modifyEntityPlan = async (entityId: number, planId: number): Promise<any> => {
    const response = await api.post('/auth/saas-admin/modificar-plan', {
        entity_id: entityId,
        plan_id: planId,
    });
    return response.data;
};

export default {
    getPlatformUsers,
    getSaaSPlans,
    modifyEntityPlan,
};
