import api from "../../../shared/lib/api/axios";
import type { DashboardSummary } from "../../dashboard/services/dashboardService";

const getSummary = async (): Promise<DashboardSummary> => {
    const response = await api.get('/dashboard/summary');
    return response.data;
};

const getDailyReport = async (date: string): Promise<DashboardSummary['daily_report']> => {
    const response = await api.get('/dashboard/daily-report', { params: { date } });
    return response.data;
};

export default { getSummary, getDailyReport };
