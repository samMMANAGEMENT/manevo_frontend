import api from "../../../shared/lib/api/axios";

export interface User {
    id: number;
    name: string;
    email: string;
    roles?: { name: string }[];
    operator?: {
        type_document: string;
        document: string;
        mobile: string;
    };
}

export interface Role {
    id: number;
    name: string;
}

const getUsers = async (): Promise<User[]> => {
    const response = await api.get('/auth/obtenerUsuarios');
    return response.data;
};

const saveUser = async (data: any): Promise<User> => {
    const response = await api.post('/auth/guardarUsuario', data);
    return response.data;
};

const getRoles = async (): Promise<Role[]> => {
    const response = await api.get('/auth/obtenerRoles');
    return response.data;
};

export default {
    getUsers,
    saveUser,
    getRoles
};
