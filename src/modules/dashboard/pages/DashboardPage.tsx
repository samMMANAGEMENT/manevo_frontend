import { useState, useEffect } from 'react';
import dashboardService, { type DashboardSummary } from '../services/dashboardService';
import paymentService from '../../payments/services/paymentService';
import { Button } from '../../../shared/components/ui/Button';
import { Modal } from '../../../shared/components/ui/Modal';
import { Select } from '../../../shared/components/ui/Select';
import { useToast } from '../../../shared/providers/ToastProvider';

export default function DashboardPage() {
    const { showToast } = useToast();
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingDaily, setLoadingDaily] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [expandedOperators, setExpandedOperators] = useState<string[]>([]);

    // Quick pay modal states
    const [quickPayOpen, setQuickPayOpen] = useState(false);
    const [quickPayData, setQuickPayData] = useState<{
        operatorId: number;
        operatorName: string;
        amount: number;
    } | null>(null);
    const [quickPayMethod, setQuickPayMethod] = useState('Efectivo');
    const [quickPaySaving, setQuickPaySaving] = useState(false);
    const [quickPayCommissions, setQuickPayCommissions] = useState<any[]>([]);
    const [quickPaySelectedIds, setQuickPaySelectedIds] = useState<number[]>([]);
    const [quickPayIsFree, setQuickPayIsFree] = useState(false);
    const [quickPayFreeAmount, setQuickPayFreeAmount] = useState(0);

    useEffect(() => {
        // Initial load
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            const data = await dashboardService.getSummary(selectedDate);
            setSummary(data);
        } catch (error) {
            console.error('Error cargando dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleQuickPayOpen = async (operatorId: number, operatorName: string, amount: number) => {
        try {
            setQuickPayOpen(true);
            setQuickPayData({ operatorId, operatorName, amount });
            setQuickPayMethod('Efectivo');
            setQuickPayIsFree(false);
            setQuickPayFreeAmount(0);
            
            // Load pending commissions for check-list and partial pay support
            const data = await paymentService.getPendingCommissions(operatorId);
            setQuickPayCommissions(data);
            setQuickPaySelectedIds(data.map(c => c.id));
        } catch (error) {
            console.error('Error cargando comisiones para pago rápido:', error);
        }
    };

    const finalQuickPayAmount = quickPayIsFree 
        ? quickPayFreeAmount 
        : quickPayCommissions.filter(c => quickPaySelectedIds.includes(c.id)).reduce((sum, c) => sum + Number(c.commission_amount), 0);

    const handleQuickPaySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickPayData) return;
        if (finalQuickPayAmount <= 0) {
            showToast('El monto del pago debe ser mayor a 0', 'error');
            return;
        }

        try {
            setQuickPaySaving(true);
            await paymentService.createPayment({
                operator_id: quickPayData.operatorId,
                amount: finalQuickPayAmount,
                payment_date: new Date().toISOString().split('T')[0],
                payment_method: quickPayMethod,
                status: 'Paid',
                description: `Liquidación rápida desde consola - ${quickPayData.operatorName}`,
                performance_ids: quickPayIsFree ? [] : quickPaySelectedIds
            });
            setQuickPayOpen(false);
            setQuickPayData(null);
            showToast('Pago rápido registrado con éxito', 'success');
            loadDashboard();
        } catch (error) {
            console.error('Error al registrar pago rápido:', error);
            showToast('Error al registrar pago rápido', 'error');
        } finally {
            setQuickPaySaving(false);
        }
    };

    const loadDailyOnly = async (date: string) => {
        try {
            setLoadingDaily(true);
            const dailyData = await dashboardService.getDailyReport(date);
            setSummary(prev => prev ? { ...prev, daily_report: dailyData } : null);
        } catch (error) {
            console.error('Error cargando reporte diario:', error);
        } finally {
            setLoadingDaily(false);
        }
    };

    const navigateDay = (days: number) => {
        const date = new Date(selectedDate + "T00:00:00");
        date.setDate(date.getDate() + days);
        const newDateStr = date.toISOString().split('T')[0];
        setSelectedDate(newDateStr);
        loadDailyOnly(newDateStr);
    };

    const toggleOperator = (name: string) => {
        setExpandedOperators(prev =>
            prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
        );
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-16 border-4 border-manevo-teal border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Sincronizando consola operativa...</p>
                </div>
            </div>
        );
    }

    const report = summary?.daily_report;

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 px-2 md:px-0">
            {/* COMPACT Hero Section */}
            <div className="bg-manevo-slate rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-manevo-slate/40">
                <div className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-manevo-teal/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                            <span className="size-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Global Insights</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tightest leading-tight">
                            Consola <br /><span className="text-manevo-teal">Empresarial</span>
                        </h1>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[24px] p-5 md:p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Ganancia Operativa (Acum)</p>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
                                {formatCurrency(summary?.metrics.net_profit || 0)}
                            </h2>
                        </div>
                        <div className="flex gap-6 border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 text-center md:text-right">
                            <div>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Ingresos</p>
                                <p className="text-sm md:text-lg font-black text-white">{formatCurrency(summary?.metrics.total_revenue || 0)}</p>
                            </div>
                            <div>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Comisiones</p>
                                <p className="text-sm md:text-lg font-black text-rose-400">-{formatCurrency(summary?.metrics.operator_commissions || 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Report Section with LOCAL LOADING */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden relative">
                {/* LOCAL SKELETON LAYER */}
                {loadingDaily && (
                    <div className="absolute inset-x-0 bottom-0 top-[64px] bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="size-10 border-4 border-manevo-teal border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Consultando fecha...</p>
                        </div>
                    </div>
                )}

                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h4 className="text-lg font-black text-manevo-slate">Auditoría Diaria</h4>
                    </div>

                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                        <button onClick={() => navigateDay(-1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-manevo-teal transition-all disabled:opacity-30" disabled={loadingDaily}>
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <div className="px-3 py-1 flex items-center gap-2 border-x border-slate-50">
                            <span className="material-symbols-outlined text-[18px] text-manevo-teal">event</span>
                            <span className="font-black text-manevo-slate text-xs uppercase tracking-tighter">
                                {new Date(selectedDate + "T00:00:00").toLocaleDateString('es', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                        <button onClick={() => navigateDay(1)} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-manevo-teal transition-all disabled:opacity-30" disabled={loadingDaily}>
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>

                <div className="p-5 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Metrics Section */}
                    <div className={`lg:col-span-3 space-y-6 ${loadingDaily ? 'opacity-20 transition-opacity' : ''}`}>
                        <div className="p-5 bg-manevo-slate rounded-3xl border border-manevo-teal/10">
                            <p className="text-[9px] font-black text-manevo-teal uppercase tracking-widest mb-1">Ganancia Local</p>
                            <h5 className="text-2xl font-black text-manevo-teal">{formatCurrency(report?.net_profit || 0)}</h5>
                            <p className="text-[10px] font-bold text-manevo-teal/60 mt-0.5">{report?.profit_percentage}% del total</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            {[
                                { label: 'Ingresos', val: report?.total_income },
                                { label: 'Ventas Prod', val: report?.product_sales },
                                { label: 'Servicios', val: report?.services_count, noCurr: true }
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 rounded-2xl">
                                    <span className="text-[9px] font-black text-black uppercase">{item.label}</span>
                                    <span className="text-sm font-black text-manevo-slate">
                                        {item.noCurr ? item.val : formatCurrency(item.val || 0)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-4 border-t border-slate-50 space-y-2">
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                                <span className="text-sm">💵 <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">Efectivo</span></span>
                                <span className="text-xs font-black text-emerald-600">{formatCurrency(report?.payment_methods.cash || 0)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                                <span className="text-sm">🏦 <span className="text-[10px] font-bold text-slate-500 uppercase ml-1">Transf.</span></span>
                                <span className="text-xs font-black text-blue-600">{formatCurrency(report?.payment_methods.transfer || 0)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Operator List Section */}
                    <div className={`lg:col-span-9 space-y-4 ${loadingDaily ? 'opacity-20 transition-opacity' : ''}`}>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-2">Desglose por Empleado</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {report?.operators.map((op, opIdx) => {
                                const isExpanded = expandedOperators.includes(op.name);
                                const displayedServices = isExpanded ? op.services : op.services.slice(0, 2);
                                const remaining = op.services.length - 2;

                                return (
                                    <div key={opIdx} className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden h-fit">
                                        <div className="p-4 flex items-center gap-3 border-b border-slate-50 bg-slate-50/10">
                                            <div className="size-9 rounded-xl bg-manevo-slate text-manevo-teal flex items-center justify-center font-black text-[10px] uppercase">
                                                {op.initials}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h5 className="font-black text-manevo-slate text-xs truncate uppercase leading-tight mb-0.5">{op.name}</h5>
                                                <p className="text-[8px] font-bold text-emerald-500 uppercase">{formatCurrency(op.profit)} Ganado</p>
                                            </div>
                                        </div>

                                        <div className="p-4 space-y-3">
                                            {displayedServices.map((service, sIdx) => (
                                                <div key={sIdx} className="flex justify-between items-center text-[11px] group">
                                                    <span className="text-slate-600 font-medium truncate max-w-[150px]">{service.name}</span>
                                                    <span className="font-black text-manevo-slate shrink-0">
                                                        {formatCurrency(service.gross - (service.gross * (service.commission_percentage / 100)))}
                                                    </span>
                                                </div>
                                            ))}

                                            {!isExpanded && remaining > 0 && (
                                                <button onClick={() => toggleOperator(op.name)} className="w-full text-[9px] font-black text-manevo-teal uppercase border border-manevo-teal/20 py-1.5 rounded-lg hover:bg-manevo-teal/5">
                                                    + {remaining} más
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {report?.operators.length === 0 && (
                                <div className="col-span-1 md:col-span-2 py-10 text-center text-slate-300 font-bold text-[10px] uppercase">
                                    Sin actividad este día
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* General Metrics - Static context */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                    { label: 'Servicios', val: summary?.metrics.service_revenue, icon: 'construction', color: 'bg-emerald-50 text-emerald-500' },
                    { label: 'Productos', val: summary?.metrics.inventory_revenue, icon: 'inventory_2', color: 'bg-blue-50 text-blue-500' },
                    { label: 'Gastos', val: summary?.metrics.total_expenses, icon: 'receipt_long', color: 'bg-orange-50 text-orange-500' },
                    { label: 'Pagos Realizados', val: summary?.metrics.operator_paid, icon: 'payments', color: 'bg-teal-50 text-manevo-teal' },
                    { label: 'Comisiones Pend.', val: summary?.metrics.operator_pending, icon: 'pending_actions', color: 'bg-rose-50 text-rose-500' },
                    { label: 'Rendimiento', val: (summary?.metrics.total_revenue ? Math.round((summary.metrics.net_profit / summary.metrics.total_revenue) * 100) : 0) + "%", icon: 'trending_up', color: 'bg-indigo-50 text-indigo-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-md flex items-center gap-3">
                        <div className={`size-10 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h3 className="text-sm md:text-base font-black text-manevo-slate truncate">
                                {typeof stat.val === 'number' ? formatCurrency(stat.val) : stat.val}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Payout Section */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl p-6 md:p-8">
                <div className="mb-6">
                    <h4 className="text-lg font-black text-manevo-slate uppercase tracking-tight">Liquidación Rápida de Comisiones</h4>
                    <p className="text-slate-400 text-xs font-medium mt-0.5">Liquida las ganancias y comisiones acumuladas de tus operadores al instante.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {!summary?.pending_by_operator || summary.pending_by_operator.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-400 font-bold text-xs uppercase bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            No hay comisiones acumuladas pendientes de pago
                        </div>
                    ) : (
                        summary.pending_by_operator.map((op, idx) => (
                            <div key={idx} className="bg-slate-50/40 p-5 rounded-[24px] border border-slate-100 flex flex-col justify-between gap-4 hover:shadow-lg transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="size-11 rounded-2xl bg-manevo-slate text-manevo-teal flex items-center justify-center font-black text-sm uppercase">
                                        {op.operator_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h5 className="font-black text-manevo-slate text-xs uppercase tracking-tight leading-none mb-1">{op.operator_name}</h5>
                                        <p className="text-[10px] text-slate-400 font-bold">{op.services_count} servicio(s) completado(s)</p>
                                    </div>
                                </div>

                                <div className="flex items-end justify-between pt-2 border-t border-slate-100/50">
                                    <div>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total Pendiente</p>
                                        <p className="text-lg font-black text-rose-500 leading-none">{formatCurrency(op.pending_amount)}</p>
                                    </div>

                                    <Button
                                        onClick={() => handleQuickPayOpen(op.operator_id, op.operator_name, op.pending_amount)}
                                        className="py-2 px-3 text-xs flex items-center gap-1.5 shadow-md shadow-manevo-teal/10 shrink-0"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">payments</span>
                                        Liquidar
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Pay Modal Dialog */}
            <Modal
                isOpen={quickPayOpen}
                onClose={() => {
                    setQuickPayOpen(false);
                    setQuickPayData(null);
                }}
                title="Registrar Liquidación de Comisiones"
            >
                {quickPayData && (
                    <form onSubmit={handleQuickPaySubmit} className="space-y-5">
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Operador</span>
                                <span className="font-black text-manevo-slate uppercase">{quickPayData.operatorName}</span>
                            </div>
                            
                            {/* Toggle for general advance / partial payout amount */}
                            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-manevo-slate">Pago Parcial Libre / Adelanto</p>
                                    <p className="text-[9px] text-slate-400 font-medium">Paga un monto manual arbitrario como adelanto</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={quickPayIsFree}
                                        onChange={(e) => {
                                            setQuickPayIsFree(e.target.checked);
                                            setQuickPaySelectedIds([]);
                                        }}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-manevo-teal"></div>
                                </label>
                            </div>
                        </div>

                        {/* If not free payment: list services with checkboxes */}
                        {!quickPayIsFree && (
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Selecciona Servicios a Liquidar</label>
                                {quickPayCommissions.length === 0 ? (
                                    <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200 rounded-xl p-3">
                                        No hay servicios individuales pendientes por liquidar.
                                    </p>
                                ) : (
                                    <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-100 no-scrollbar">
                                        {quickPayCommissions.map(comm => (
                                            <div
                                                key={comm.id}
                                                onClick={() => {
                                                    if (quickPaySelectedIds.includes(comm.id)) {
                                                        setQuickPaySelectedIds(quickPaySelectedIds.filter(id => id !== comm.id));
                                                    } else {
                                                        setQuickPaySelectedIds([...quickPaySelectedIds, comm.id]);
                                                    }
                                                }}
                                                className={`p-3 flex items-center gap-3 hover:bg-slate-50/50 cursor-pointer transition-all ${
                                                    quickPaySelectedIds.includes(comm.id) ? 'bg-manevo-teal/5' : ''
                                                }`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={quickPaySelectedIds.includes(comm.id)}
                                                    onChange={() => {}} // Handled by div onClick
                                                    className="rounded text-manevo-teal focus:ring-manevo-teal"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-bold text-manevo-slate truncate">
                                                        {comm.service?.name}
                                                    </p>
                                                    <p className="text-[9px] text-slate-400 font-medium">
                                                        {formatCurrency(Number(comm.price_snapshot))} • {Number(comm.commission_percentage_snapshot)}%
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-black text-manevo-slate">
                                                        {formatCurrency(comm.commission_amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Numeric input if custom amount (free payment) */}
                        {quickPayIsFree && (
                            <div className="space-y-2">
                                <label className="block text-sm font-bold text-manevo-slate">Monto del Pago Parcial (COP)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-manevo-teal/20 focus:border-manevo-teal outline-none transition-all text-sm font-medium text-black bg-white"
                                    value={quickPayFreeAmount.toString()}
                                    onChange={(e) => setQuickPayFreeAmount(parseFloat(e.target.value) || 0)}
                                />
                            </div>
                        )}

                        {/* Display final computed amount */}
                        <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total a Liquidar</span>
                            <span className={`text-xl font-black ${finalQuickPayAmount > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {formatCurrency(finalQuickPayAmount)}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-manevo-slate">Método de Pago</label>
                            <Select
                                value={quickPayMethod}
                                onChange={(val) => setQuickPayMethod(String(val))}
                                options={[
                                    { value: 'Efectivo', label: 'Efectivo' },
                                    { value: 'Transferencia', label: 'Transferencia' },
                                    { value: 'Caja Menor', label: 'Caja Menor' },
                                    { value: 'Tarjeta', label: 'Tarjeta' }
                                ]}
                                className="space-y-0 text-sm font-medium"
                            />
                        </div>

                        <p className="text-[10px] text-slate-400 font-bold bg-amber-50 border border-amber-200 rounded-xl p-3">
                            ⚠️ Al confirmar, el pago parcial se registrará en el historial de caja y se reducirá proporcionalmente el balance pendiente del operador.
                        </p>

                        <div className="pt-4 flex gap-3">
                            <Button variant="ghost" className="flex-1" type="button" onClick={() => {
                                setQuickPayOpen(false);
                                setQuickPayData(null);
                            }}>Cancelar</Button>
                            <Button className="flex-1" type="submit" disabled={quickPaySaving || finalQuickPayAmount <= 0}>
                                {quickPaySaving ? 'Registrando...' : 'Confirmar y Pagar'}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </div>
    );
}
