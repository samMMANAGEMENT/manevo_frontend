import api from '../../../shared/lib/api/axios';

export interface Customer {
    id?: number;
    name: string;
    identification_type: string;
    identification_number: string;
    dv?: string;
    email?: string;
    phone?: string;
    address?: string;
    municipality_id?: number;
    type_regime_id?: number;
    type_organization_id?: number;
    status?: boolean;
}

const customerService = {
    obtenerClientes: async (): Promise<Customer[]> => {
        const response = await api.get('/customers/obtenerClientes');
        return response.data;
    },

    guardarCliente: async (data: Customer): Promise<Customer> => {
        const response = await api.post('/customers/guardarCliente', data);
        return response.data;
    },

    modificarCliente: async (id: number, data: Customer): Promise<Customer> => {
        const response = await api.put(`/customers/modificarCliente/${id}`, data);
        return response.data;
    },

    eliminarCliente: async (id: number): Promise<void> => {
        await api.delete(`/customers/eliminarCliente/${id}`);
    }
};

export default customerService;
