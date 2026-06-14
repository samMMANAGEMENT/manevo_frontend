import { NavLink } from 'react-router-dom';
import { useCan } from '../../hooks/useCan';
import { useAuth } from '../../providers/AuthProvider';

interface MenuItem {
    name: string;
    slug: string;
    icon?: string;
    perm?: string;
    children?: MenuItem[];
}

const principalItems: MenuItem[] = [
    { name: 'Dashboard', slug: 'dashboard', icon: 'dashboard', perm: 'dashboard.menu' },
    { name: 'POS', slug: 'pos', icon: 'point_of_sale', perm: 'pos.menu' },
    { name: 'Servicios', slug: 'services', icon: 'construction', perm: 'services.menu' },
    { name: 'Pagos', slug: 'payments', icon: 'payments', perm: 'payments.menu' },
    { name: 'Gastos', slug: 'expenses', icon: 'receipt_long', perm: 'expenses.menu' },
    { name: 'Agendas', slug: 'schedules', icon: 'event_note', perm: 'schedules.menu' },
    { name: 'Inventario', slug: 'inventory', icon: 'inventory', perm: 'inventory.menu' },
    { name: 'Facturación', slug: 'billing', icon: 'receipt_long', perm: 'billing.menu' },
];

const avanzadoItems: MenuItem[] = [
    { name: 'Integraciones', slug: 'integrations', icon: 'hub', perm: 'integrations.menu' },
    { name: 'Reportes', slug: 'reports', icon: 'analytics', perm: 'reports.menu' },
    { name: 'Configuraciones Avanzadas', slug: 'settings_advanced', icon: 'tune', perm: 'settings_advanced.menu' },
    { name: 'Administración', slug: 'admin', icon: 'admin_panel_settings', perm: 'admin.menu' },
    { name: 'API Access', slug: 'api_access', icon: 'api', perm: 'api_access.menu' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { can, user } = useCan();
    const { logout } = useAuth();

    const filterItems = (items: MenuItem[]): MenuItem[] => {
        return items
            .filter(item => !item.perm || can(item.perm))
            .map(item => {
                if (item.children) {
                    return {
                        ...item,
                        children: filterItems(item.children)
                    };
                }
                return item;
            });
    };

    const filteredPrincipal = filterItems(principalItems);
    const filteredAvanzado = filterItems(avanzadoItems);

    const renderItem = (item: MenuItem) => (
        <div key={item.slug} className="flex flex-col">
            <NavLink
                to={`/app/${item.slug}`}
                onClick={onClose}
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${isActive
                        ? 'bg-manevo-teal/90 text-black font-bold shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-manevo-slate'
                    }`
                }
            >
                <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                </span>
                <span className={`text-sm ${item.slug === 'dashboard' ? 'font-semibold' : 'font-medium'}`}>
                    {item.name}
                </span>
            </NavLink>
            {item.children && item.children.length > 0 && (
                <div className="ml-9 mt-1 space-y-1 border-l border-slate-100 pl-4">
                    {item.children.map((child: any) => (
                        <NavLink
                            key={child.slug}
                            to={`/app/${item.slug}/${child.slug}`}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-1.5 rounded-lg transition-all group ${isActive
                                    ? 'bg-manevo-teal/5 text-manevo-teal font-semibold'
                                    : 'text-slate-400 hover:text-manevo-slate'
                                }`
                            }
                        >
                            <span className="text-[13px] font-medium">
                                {child.name}
                            </span>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    );

    return (
        <aside
            className={`fixed lg:sticky top-0 left-0 w-64 h-screen bg-white border-r border-slate-100 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-50 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            {/* Logo Section */}
            <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-3 ">
                    <div className="size-8 text-manevo-teal pt-2 ">
                        <svg
                            className=" w-7 h-5"
                            viewBox="0 0 31 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <rect
                                x="0"
                                y="0"
                                width="18"
                                height="18"
                                rx="9"
                                fill="currentColor"></rect>
                            <rect
                                x="22"
                                y="0"
                                width="9"
                                height="18"
                                rx="4.5"
                                fill="currentColor"></rect>
                        </svg>
                    </div>
                    <span className="text-xl font-extrabold tracking-tighter text-manevo-slate">manevo</span>
                </div>
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-slate-400 hover:text-rose-500 transition-colors"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto no-scrollbar text-gray-600">
                {filteredPrincipal.length > 0 && (
                    <>
                        <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Principal</p>
                        {filteredPrincipal.map(renderItem)}
                    </>
                )}

                {filteredAvanzado.length > 0 && (
                    <>
                        <div className="pt-6 pb-2">
                            <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Avanzado</p>
                        </div>
                        {filteredAvanzado.map(renderItem)}
                    </>
                )}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-slate-50 mt-auto bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-manevo-teal/20 flex items-center justify-center border border-manevo-teal/30">
                        <span className="text-manevo-teal font-black text-xs">{user?.operator?.name?.charAt(0) || 'U'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-manevo-slate truncate uppercase tracking-tighter">
                            {user?.operator?.name || user?.email || 'Usuario'}
                        </p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{user?.roles}</p>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 text-slate-300 hover:text-rose-500 transition-all cursor-pointer"
                        title="Cerrar Sesión"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
