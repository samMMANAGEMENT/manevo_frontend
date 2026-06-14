import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from '../App';
import LoginPage from '../modules/auth/pages/LoginPage';
import RegisterPage from '../modules/auth/pages/RegisterPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import InventoryPage from '../modules/inventory/pages/InventoryPage';
import PosPage from '../modules/sales/pages/PosPage';
import AppLayout from '../shared/components/layout/AppLayout';

import ServicesPage from '../modules/services/pages/ServicesPage';
import ExpensesPage from '../modules/expenses/pages/ExpensesPage';
import BillingPage from '../modules/billing/pages/BillingPage';
import PaymentsPage from '../modules/payments/pages/PaymentsPage';

import SettingsPage from '../modules/settings/pages/SettingsPage';
import ReportsPage from '../modules/reports/pages/ReportsPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
    },
    {
        path: '/auth',
        children: [
            {
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            }
        ]
    },
    {
        path: '/app',
        element: <AppLayout />,
        children: [
            {
                path: 'dashboard',
                element: <DashboardPage />,
            },
            // Define paths for all menu items mentioned by user
            { path: 'pos', element: <PosPage /> },
            { path: 'services', element: <ServicesPage /> },
            { path: 'payments', element: <PaymentsPage /> },
            { path: 'expenses', element: <ExpensesPage /> },
            { path: 'schedules', element: <div className="p-8"><h1 className="text-4xl text-black">Agendas</h1><p className="text-gray-500 mt-4">Próximamente...</p></div> },
            { path: 'integrations', element: <div className="p-8"><h1 className="text-4xl text-black">Integraciones</h1><p className="text-gray-500 mt-4">Próximamente...</p></div> },
            { path: 'reports', element: <ReportsPage /> },
            { path: 'settings_advanced', element: <SettingsPage /> },
            { path: 'admin', element: <div className="p-8"><h1 className="text-4xl text-black">Administración</h1><p className="text-gray-500 mt-4">Próximamente...</p></div> },
            { path: 'api_access', element: <div className="p-8"><h1 className="text-4xl text-black">API Access</h1><p className="text-gray-500 mt-4">Próximamente...</p></div> },
            { path: 'inventory', element: <InventoryPage /> },
            { path: 'billing', element: <BillingPage /> },
        ]
    },
    {
        path: '*',
        element: <Navigate to="/" replace />,
    },
]);
