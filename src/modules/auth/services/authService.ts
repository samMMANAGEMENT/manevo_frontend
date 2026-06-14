import api from "../../../shared/lib/api/axios";
import type { LoginType, RegisterType } from "../types/registerType";

const login = async (data: LoginType) => {
    const response = await api.post('/auth/login', data);
    return response.data;
}

const register = async (data: RegisterType) => {
    const response = await api.post('/auth/register', data);
    return response.data;
}

const me = async () => {
    const response = await api.get('/auth/me');
    return response.data;
}

export default {
    login,
    register,
    me
}