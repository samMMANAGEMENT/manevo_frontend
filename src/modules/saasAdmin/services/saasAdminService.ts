import api from "../../../shared/lib/api/axios";

export interface PlatformUser {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

export interface Workspace {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    plan: {
        id: number;
        name: string;
        slug: string;
        start_date: string;
        end_date: string | null;
        status: string;
    } | null;
    users: PlatformUser[];
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
    modules?: SaaSModule[];
}

const getPlatformWorkspaces = async (): Promise<Workspace[]> => {
    const response = await api.get('/auth/saas-admin/workspaces');
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
    getPlatformWorkspaces,
    getSaaSPlans,
    modifyEntityPlan,
};
