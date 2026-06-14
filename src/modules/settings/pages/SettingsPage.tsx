import { useState } from 'react';
import ServiceManagementTab from '../components/ServiceManagementTab';
import UserManagementTab from '../components/UserManagementTab';
import BillingManagementTab from '../components/BillingManagementTab';
import CustomerManagementTab from '../components/CustomerManagementTab';
import WorkspaceManagementTab from '../components/WorkspaceManagementTab';

type TabType = 'workspace' | 'services' | 'billing' | 'users' | 'customers';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<TabType>('workspace');

    const tabs: { id: TabType; name: string; icon: string }[] = [
        { id: 'workspace', name: 'Mi Workspace', icon: 'workspaces' },
        { id: 'customers', name: 'Clientes', icon: 'person' },
        { id: 'services', name: 'Servicios', icon: 'construction' },
        { id: 'billing', name: 'Facturación', icon: 'receipt_long' },
        { id: 'users', name: 'Usuarios y Roles', icon: 'group' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12 animate-fade-in">
            {/* Header */}
            <div className="bg-manevo-slate p-6 md:p-12 rounded-3xl md:rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-manevo-teal/10 blur-2xl md:blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4 border border-manevo-teal/20">
                        Configuración avanzada
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tightest leading-tight text-white line-clamp-2">Centro de Control</h1>
                    <p className="text-slate-400 font-medium mt-1 md:mt-2 max-w-xl text-sm md:text-lg">Personaliza tu ambiente de trabajo y configura los parámetros globales del sistema.</p>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-1.5 md:gap-2 p-1.5 bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl w-full md:w-fit overflow-x-auto no-scrollbar scroll-smooth">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl md:rounded-2xl text-[13px] md:text-sm font-black transition-all cursor-pointer outline-none whitespace-nowrap
                            ${activeTab === tab.id
                                ? 'bg-manevo-slate text-white shadow-lg'
                                : 'text-slate-400 hover:text-manevo-slate hover:bg-slate-50'}
                        `}
                    >
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">{tab.icon}</span>
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="bg-white/30 backdrop-blur-md min-h-[400px] md:min-h-[500px]">
                {activeTab === 'workspace' && <WorkspaceManagementTab />}
                {activeTab === 'customers' && <CustomerManagementTab />}
                {activeTab === 'services' && <ServiceManagementTab />}
                {activeTab === 'users' && <UserManagementTab />}
                {activeTab === 'billing' && <BillingManagementTab />}
            </div>
        </div>
    );
}

