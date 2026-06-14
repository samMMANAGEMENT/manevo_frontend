import axios from 'axios';
import type { Expense, ExpenseCreateDTO } from '../types/expense';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

const expenseService = {
    getExpenses: async (): Promise<Expense[]> => {
        const response = await axios.get(`${API_URL}/expenses`, getAuthHeaders());
        return response.data;
    },

    createExpense: async (data: ExpenseCreateDTO): Promise<Expense> => {
        const response = await axios.post(`${API_URL}/expenses`, data, getAuthHeaders());
        return response.data;
    },

    updateExpense: async (id: number, data: Partial<ExpenseCreateDTO>): Promise<Expense> => {
        const response = await axios.put(`${API_URL}/expenses/${id}`, data, getAuthHeaders());
        return response.data;
    },

    deleteExpense: async (id: number): Promise<void> => {
        await axios.delete(`${API_URL}/expenses/${id}`, getAuthHeaders());
    }
};

export default expenseService;
