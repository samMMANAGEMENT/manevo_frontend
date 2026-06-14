import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../providers/AuthProvider';

export default function AppLayout() {
    const { user, token, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-bg-light">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manevo-teal"></div>
            </div>
        );
    }

    if (!token || !user) {
        return <Navigate to="/auth/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-[#F8FAFB] font-manrope">
            {/* Sidebar with mobile support */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 animate-fade-in">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
