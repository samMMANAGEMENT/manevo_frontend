import api from "../../../shared/lib/api/axios";

export interface Entity {
    id: number;
    name: string;
    description?: string;
    status: boolean;
}

const getMyEntity = async (): Promise<Entity> => {
    const response = await api.get('/entities/miEntidad');
    return response.data;
};

const updateEntity = async (id: number, data: Partial<Entity>): Promise<Entity> => {
    const response = await api.put(`/entities/modificarEntidad/${id}`, data);
    return response.data;
};

const getEntities = async (): Promise<Entity[]> => {
    const response = await api.get('/entities/obtenerEntidades');
    return response.data;
};

const switchEntity = async (entityId: number): Promise<{ message: string; user: any }> => {
    const response = await api.post('/entities/cambiarEntidad', { entity_id: entityId });
    return response.data;
};

export default {
    getMyEntity,
    updateEntity,
    getEntities,
    switchEntity
};
