import api from "../../../shared/lib/api/axios";
import type { Operator } from "../types/operatorType";

const getOperators = async (): Promise<Operator[]> => {
    const response = await api.get('/operators/obtenerOperadores');
    return response.data;
};

export default {
    getOperators
};
