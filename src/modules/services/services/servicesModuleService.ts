import api from "../../../shared/lib/api/axios";
import type { MasterService, ServiceOrder, CreateServiceOrderData } from "../types/servicesType";

const getMasterServices = async (): Promise<MasterService[]> => {
    const response = await api.get('/services-module/obtenerServicios');
    return response.data;
};

const createMasterService = async (data: Partial<MasterService>): Promise<MasterService> => {
    const response = await api.post('/services-module/crearServicio', data);
    return response.data;
};

const updateMasterService = async (id: number, data: Partial<MasterService>): Promise<MasterService> => {
    const response = await api.put(`/services-module/actualizarServicio/${id}`, data);
    return response.data;
};

const processOrder = async (data: CreateServiceOrderData): Promise<ServiceOrder> => {
    const response = await api.post('/services-module/procesarOrdenServicio', data);
    return response.data;
};

const getHistory = async (): Promise<ServiceOrder[]> => {
    const response = await api.get('/services-module/obtenerHistorialOrdenes');
    return response.data;
};

export default {
    getMasterServices,
    createMasterService,
    updateMasterService,
    processOrder,
    getHistory
};
