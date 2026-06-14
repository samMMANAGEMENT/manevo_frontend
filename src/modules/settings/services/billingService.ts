import api from "../../../shared/lib/api/axios";

export interface BillingConfig {
    id?: number;
    razon_social: string;
    document_type: string;
    nit: string;
    dv?: string;
    email_billing?: string;
    phone_billing?: string;
    address_billing?: string;
    city_billing?: string;
    tax_regime?: string;
    resolution_number?: string;
    resolution_date?: string;
    prefix?: string;
    start_range?: number;
    end_range?: number;
    software_id?: string;
    software_pin?: string;
    api_token?: string;
    api_base_url?: string;
    test_set_id?: string;
    is_test: boolean;
}

const getBillingConfig = async (): Promise<BillingConfig> => {
    const response = await api.get('/billing-config/obtenerConfiguracion');
    return response.data;
};

const saveBillingConfig = async (data: BillingConfig): Promise<{ message: string; config: BillingConfig }> => {
    const response = await api.post('/billing-config/guardarConfiguracion', data);
    return response.data;
};

export default {
    getBillingConfig,
    saveBillingConfig
};
