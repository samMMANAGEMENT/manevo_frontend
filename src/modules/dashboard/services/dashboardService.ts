import api from "../../../shared/lib/api/axios";

export interface DashboardSummary {
    metrics: {
        total_revenue: number;
        service_revenue: number;
        inventory_revenue: number;
        operator_commissions: number;
        total_expenses: number;
        net_profit: number;
        operator_paid?: number;
        operator_pending?: number;
    };
    pending_by_operator?: {
        operator_id: number;
        operator_name: string;
        services_count: number;
        pending_amount: number;
        performance_ids: string;
    }[];
    chart_data: {
        date: string;
        services: number;
        inventory: number;
        total: number;
    }[];
    expense_chart_data: {
        date: string;
        amount: number;
    }[];
    top_operators: {
        name: string;
        total_generated: number;
        commission: number;
    }[];
    daily_report: {
        total_income: number;
        net_profit: number;
        profit_percentage: number;
        product_sales: number;
        services_count: number;
        expenses: number;
        payment_methods: {
            cash: number;
            transfer: number;
        };
        operators: {
            name: string;
            initials: string;
            services_count: number;
            profit: number;
            gross: number;
            services: {
                name: string;
                gross: number;
                commission_percentage: number;
            }[];
        }[];
    };
}

const getSummary = async (date?: string): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary', {
        params: { date }
    });
    return response.data;
};

const getDailyReport = async (date: string): Promise<DashboardSummary['daily_report']> => {
    const response = await api.get('/dashboard/daily-report', {
        params: { date }
    });
    return response.data;
};

export default {
    getSummary,
    getDailyReport
};
