import { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/providers/AuthProvider';
import saasAdminService, { type PlatformUser, type SaaSPlan } from '../services/saasAdminService';

export default function SaaSAdminPage() {
    const { user } = useAuth();
    const [users, setUsers] = useState<PlatformUser[]>([]);
    const [plans, setPlans] = useState<SaaSPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<number | 'none'>('none');
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Seguridad estricta en el cliente (también forzada en el backend)
    const isSuperAdmin = user?.email === 'sapinedal05@outlook.com';

    useEffect(() => {
        if (!isSuperAdmin) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [usersData, plansData] = await Promise.all([
                    saasAdminService.getPlatformUsers(),
                    saasAdminService.getSaaSPlans(),
                ]);
                setUsers(usersData);
                setPlans(plansData);
            } catch (err: any) {
                console.error(err);
                setError(err.response?.data?.message || 'Error al cargar los datos del panel.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [isSuperAdmin]);

    if (!isSuperAdmin) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 text-center animate-fade-in">
                <div className="bg-white p-10 rounded-3xl border border-slate-100 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-500"></div>
                    <span className="material-symbols-outlined text-[64px] text-red-500 font-light">gpp_bad</span>
                    <h1 className="text-2xl font-black text-slate-800 mt-4 tracking-tight">Acceso Denegado</h1>
                    <p className="text-slate-400 font-medium text-sm mt-3 leading-relaxed">
                        Este módulo está restringido de forma exclusiva para el administrador global de la plataforma (<span className="text-manevo-slate font-bold">sapinedal05@outlook.com</span>).
                    </p>
                </div>
            </div>
        );
    }

    const handleOpenChangePlan = (pUser: PlatformUser) => {
        setSelectedUser(pUser);
        setSelectedPlanId(pUser.plan?.id || 'none');
        setSuccessMessage(null);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setSelectedPlanId('none');
    };

    const handleChangePlanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !selectedUser.entity || selectedPlanId === 'none') return;

        try {
            setUpdating(true);
            setError(null);
            await saasAdminService.modifyEntityPlan(selectedUser.entity.id, Number(selectedPlanId));
            
            // Recargar lista de usuarios
            const updatedUsers = await saasAdminService.getPlatformUsers();
            setUsers(updatedUsers);

            setSuccessMessage(`Plan de ${selectedUser.name} actualizado con éxito.`);
            setTimeout(() => {
                handleCloseModal();
            }, 1500);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Error al actualizar el plan.');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-manevo-teal"></div>
                <p className="text-slate-500 font-bold text-sm tracking-widest uppercase">Cargando Consola SaaS...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12 animate-fade-in">
            {/* Header */}
            <div className="bg-manevo-slate p-6 md:p-12 rounded-3xl md:rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-manevo-teal/10 blur-2xl md:blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10">
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/15 text-manevo-teal rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 border border-manevo-teal/25">
                        Consola Global SaaS
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tightest leading-tight text-white line-clamp-2">Administración de la Plataforma</h1>
                    <p className="text-slate-400 font-medium mt-1 md:mt-2 max-w-xl text-sm md:text-lg">Monitorea los workspaces creados, gestiona las suscripciones de los clientes y visualiza los límites de cada plan.</p>
                </div>
            </div>

            {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">error</span>
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
                
                {/* Tabla de Usuarios Registrados */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black text-manevo-slate">Workspaces Activos</h2>
                            <p className="text-xs text-slate-400 font-semibold mt-0.5">Usuarios registrados y planes asociados.</p>
                        </div>
                        <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-black">
                            {users.length} Registros
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                    <th className="px-6 py-4">Usuario</th>
                                    <th className="px-6 py-4">Workspace</th>
                                    <th className="px-6 py-4 text-center">Plan Activo</th>
                                    <th className="px-6 py-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50/30 transition-all">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-manevo-slate">{u.name}</span>
                                                <span className="text-xs text-slate-400 font-medium">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-600">
                                                {u.entity?.name || 'Sin Workspace'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {u.plan ? (
                                                <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                                                    ${u.plan.slug === 'free' ? 'bg-slate-100 text-slate-600 border border-slate-200' : ''}
                                                    ${u.plan.slug === 'goo' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : ''}
                                                    ${u.plan.slug === 'essential' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : ''}
                                                    ${u.plan.slug === 'business' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
                                                `}>
                                                    {u.plan.name}
                                                </span>
                                            ) : (
                                                <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                                                    Sin Plan
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {u.entity ? (
                                                <button
                                                    onClick={() => handleOpenChangePlan(u)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-manevo-teal/10 hover:bg-manevo-teal text-manevo-teal hover:text-black font-black text-xs rounded-xl transition-all cursor-pointer border border-manevo-teal/20"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
                                                    Cambiar Plan
                                                </button>
                                            ) : (
                                                <span className="text-xs text-slate-400 font-semibold italic">N/A</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Leyenda de Planes */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 space-y-6">
                    <div>
                        <h2 className="text-lg font-black text-manevo-slate">Estructura de Planes</h2>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">Definición de módulos y límites de cada plan.</p>
                    </div>

                    <div className="space-y-4">
                        {plans.map(p => (
                            <div key={p.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-extrabold text-manevo-slate">{p.name}</span>
                                    <span className="text-xs font-black text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-100">
                                        ${parseFloat(p.price.toString()).toFixed(2)} / mes
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                                    <span className="material-symbols-outlined text-[16px] text-manevo-teal">group</span>
                                    Límite: {p.max_users === 0 || p.max_users === null || p.max_users === undefined ? 'Usuarios Ilimitados' : `Máx. ${p.max_users} usuario(s)`}
                                </div>

                                <div className="space-y-1">
                                    <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">Módulos habilitados:</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {(p.modulos || p.modules || []).map(m => (
                                            <span key={m.id} className="text-[9px] font-bold bg-white text-slate-500 border border-slate-100 px-2 py-0.5 rounded-md">
                                                {m.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>

            {/* Modal para Modificar Plan */}
            {selectedUser && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white w-full max-w-md rounded-3xl border border-slate-100 shadow-2xl overflow-hidden p-6 space-y-6 relative">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>

                        <div className="space-y-1">
                            <h3 className="text-xl font-black text-manevo-slate">Modificar Suscripción</h3>
                            <p className="text-xs text-slate-400 font-semibold">Cambiar el plan de acceso para {selectedUser.name}</p>
                        </div>

                        {successMessage ? (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-sm font-semibold flex items-center gap-2">
                                <span className="material-symbols-outlined">check_circle</span>
                                {successMessage}
                            </div>
                        ) : (
                            <form onSubmit={handleChangePlanSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400">Workspace</label>
                                    <input
                                        type="text"
                                        readOnly
                                        value={selectedUser.entity?.name || ''}
                                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-500 text-sm outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase text-slate-400">Seleccionar Plan</label>
                                    <select
                                        value={selectedPlanId}
                                        onChange={(e) => setSelectedPlanId(e.target.value === 'none' ? 'none' : Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 font-semibold text-slate-700 text-sm outline-none focus:border-manevo-teal transition-colors"
                                    >
                                        <option value="none" disabled>Seleccionar un plan...</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} - ${parseFloat(p.price.toString()).toFixed(2)} (Límite: {p.max_users === 0 || p.max_users === null || p.max_users === undefined ? 'Ilimitado' : `${p.max_users} usr`})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="submit"
                                    disabled={updating || selectedPlanId === 'none'}
                                    className="w-full py-3 bg-manevo-slate hover:bg-manevo-teal text-white hover:text-black font-black text-sm rounded-2xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
                                >
                                    {updating ? 'Guardando Cambios...' : 'Guardar y Actualizar'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
