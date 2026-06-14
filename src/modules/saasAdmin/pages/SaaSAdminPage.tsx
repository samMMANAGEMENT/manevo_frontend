import { useEffect, useState } from 'react';
import { useAuth } from '../../../shared/providers/AuthProvider';
import { Modal } from '../../../shared/components/ui/Modal';
import saasAdminService, { type Workspace, type SaaSPlan } from '../services/saasAdminService';

export default function SaaSAdminPage() {
    const { user } = useAuth();
    const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
    const [plans, setPlans] = useState<SaaSPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Workspace seleccionado para ver detalles de usuarios
    const [selectedWorkspaceDetail, setSelectedWorkspaceDetail] = useState<Workspace | null>(null);

    // Workspace seleccionado para cambiar plan (Modal)
    const [selectedWorkspaceForPlan, setSelectedWorkspaceForPlan] = useState<Workspace | null>(null);
    const [selectedPlanId, setSelectedPlanId] = useState<number | 'none'>('none');
    
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Seguridad estricta en el cliente
    const isSuperAdmin = user?.email === 'sapinedal05@outlook.com';

    useEffect(() => {
        if (!isSuperAdmin) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                const [workspacesData, plansData] = await Promise.all([
                    saasAdminService.getPlatformWorkspaces(),
                    saasAdminService.getSaaSPlans(),
                ]);
                setWorkspaces(workspacesData);
                setPlans(plansData);

                // Seleccionar el primero por defecto para detalles
                if (workspacesData.length > 0) {
                    setSelectedWorkspaceDetail(workspacesData[0]);
                }
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

    // Paginación lógica
    const totalPages = Math.ceil(workspaces.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentWorkspaces = workspaces.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleOpenChangePlan = (workspace: Workspace, e: React.MouseEvent) => {
        e.stopPropagation(); // Evitar seleccionar para detalles
        setSelectedWorkspaceForPlan(workspace);
        setSelectedPlanId(workspace.plan?.id || 'none');
        setSuccessMessage(null);
    };

    const handleCloseModal = () => {
        setSelectedWorkspaceForPlan(null);
        setSelectedPlanId('none');
        setSuccessMessage(null);
    };

    const handleChangePlanSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedWorkspaceForPlan || selectedPlanId === 'none') return;

        try {
            setUpdating(true);
            setError(null);
            await saasAdminService.modifyEntityPlan(selectedWorkspaceForPlan.id, Number(selectedPlanId));
            
            // Recargar datos
            const updatedWorkspaces = await saasAdminService.getPlatformWorkspaces();
            setWorkspaces(updatedWorkspaces);

            // Actualizar detalle si es el mismo workspace
            if (selectedWorkspaceDetail && selectedWorkspaceDetail.id === selectedWorkspaceForPlan.id) {
                const newDetail = updatedWorkspaces.find(w => w.id === selectedWorkspaceForPlan.id);
                if (newDetail) setSelectedWorkspaceDetail(newDetail);
            }

            setSuccessMessage(`Plan de ${selectedWorkspaceForPlan.name} actualizado con éxito.`);
            setTimeout(() => {
                handleCloseModal();
            }, 1200);
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
                
                {/* Columna Izquierda: Tabla de Workspaces Paginados */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-black text-manevo-slate">Workspaces Activos</h2>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Listado de empresas y sus planes. Haz click para ver usuarios.</p>
                            </div>
                            <span className="px-2.5 py-1 bg-slate-50 text-slate-500 rounded-lg text-xs font-black">
                                {workspaces.length} Registros
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                        <th className="px-6 py-4">Workspace</th>
                                        <th className="px-6 py-4 text-center">Plan Activo</th>
                                        <th className="px-6 py-4 text-center">Usuarios</th>
                                        <th className="px-6 py-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-sm">
                                    {currentWorkspaces.map(w => (
                                        <tr 
                                            key={w.id} 
                                            onClick={() => setSelectedWorkspaceDetail(w)}
                                            className={`cursor-pointer transition-all hover:bg-slate-50/50 ${selectedWorkspaceDetail?.id === w.id ? 'bg-manevo-teal/5 font-semibold' : ''}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-manevo-slate">{w.name}</span>
                                                    <span className="text-xs text-slate-400 font-medium">{w.description || 'Sin descripción'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {w.plan ? (
                                                    <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                                                        ${w.plan.slug === 'free' ? 'bg-slate-100 text-slate-600 border border-slate-200' : ''}
                                                        ${w.plan.slug === 'goo' ? 'bg-cyan-50 text-cyan-600 border border-cyan-100' : ''}
                                                        ${w.plan.slug === 'essential' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : ''}
                                                        ${w.plan.slug === 'business' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
                                                    `}>
                                                        {w.plan.name}
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2.5 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
                                                        Sin Plan
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-black">
                                                    <span className="material-symbols-outlined text-[14px]">group</span>
                                                    {w.users.length}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={(e) => handleOpenChangePlan(w, e)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-manevo-teal/10 hover:bg-manevo-teal text-manevo-teal hover:text-black font-black text-xs rounded-xl transition-all cursor-pointer border border-manevo-teal/20"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">edit_calendar</span>
                                                    Cambiar Plan
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {totalPages > 1 && (
                            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-xs text-slate-400 font-bold">
                                    Página {currentPage} de {totalPages}
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all disabled:opacity-40 disabled:hover:bg-white cursor-pointer"
                                    >
                                        Siguiente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Detalle de Usuarios Asociados */}
                    {selectedWorkspaceDetail && (
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6 space-y-4 animate-fade-in">
                            <div>
                                <h3 className="text-lg font-black text-manevo-slate">
                                    Usuarios en: <span className="text-manevo-teal font-extrabold">{selectedWorkspaceDetail.name}</span>
                                </h3>
                                <p className="text-xs text-slate-400 font-semibold mt-0.5">Personas registradas en este espacio de trabajo.</p>
                            </div>

                            {selectedWorkspaceDetail.users.length === 0 ? (
                                <p className="text-sm text-slate-400 italic">No hay usuarios registrados en este workspace.</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedWorkspaceDetail.users.map(u => (
                                        <div key={u.id} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 flex items-center gap-3">
                                            <div className="size-10 rounded-full bg-manevo-teal/10 text-manevo-teal flex items-center justify-center font-bold text-sm">
                                                {u.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-manevo-slate truncate">{u.name}</p>
                                                <p className="text-xs text-slate-400 truncate font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Columna Derecha: Leyenda de Planes */}
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

            {/* Modal Global de Modificar Plan (Conecta vía React Portal fuera del Layout) */}
            <Modal
                isOpen={selectedWorkspaceForPlan !== null}
                onClose={handleCloseModal}
                title="Modificar Plan de Suscripción"
            >
                {selectedWorkspaceForPlan && (
                    <div className="space-y-6">
                        {successMessage ? (
                            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-4 rounded-2xl text-sm font-semibold flex items-center gap-3 animate-scale-in">
                                <span className="material-symbols-outlined text-[22px]">check_circle</span>
                                {successMessage}
                            </div>
                        ) : (
                            <form onSubmit={handleChangePlanSubmit} className="space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Workspace Seleccionado</label>
                                    <div className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-600 text-sm">
                                        {selectedWorkspaceForPlan.name}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Plan de Suscripción</label>
                                    <select
                                        value={selectedPlanId}
                                        onChange={(e) => setSelectedPlanId(e.target.value === 'none' ? 'none' : Number(e.target.value))}
                                        className="w-full px-4 py-3 rounded-2xl bg-white border border-slate-200 font-bold text-slate-700 text-sm outline-none focus:border-manevo-teal focus:ring-1 focus:ring-manevo-teal transition-all"
                                    >
                                        <option value="none" disabled>Selecciona un plan...</option>
                                        {plans.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} — ${parseFloat(p.price.toString()).toFixed(2)} / mes ({p.max_users === 0 ? 'Sin límite de usuarios' : `Límite: ${p.max_users} usuarios`})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="flex-1 py-3 border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-manevo-slate font-bold text-sm rounded-2xl transition-all cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updating || selectedPlanId === 'none'}
                                        className="flex-1 py-3 bg-manevo-slate hover:bg-manevo-teal text-white hover:text-black font-black text-sm rounded-2xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
                                    >
                                        {updating ? 'Guardando...' : 'Guardar Cambios'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}
