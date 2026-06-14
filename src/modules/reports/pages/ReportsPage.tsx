import { useState, useEffect, useMemo } from 'react';
import type { DashboardSummary } from '../../dashboard/services/dashboardService';
import reportsService from '../services/reportsService';

export default function ReportsPage() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dailyReport, setDailyReport] = useState<DashboardSummary['daily_report'] | null>(null);
    const [loadingDaily, setLoadingDaily] = useState(false);
    const [expandedOperator, setExpandedOperator] = useState<string | null>(null);

    useEffect(() => {
        loadSummary();
    }, []);

    const loadSummary = async () => {
        try {
            setLoading(true);
            const data = await reportsService.getSummary();
            setSummary(data);
            setDailyReport(data.daily_report);
        } catch (error) {
            console.error('Error cargando reportes:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadDailyReport = async (date: string) => {
        try {
            setLoadingDaily(true);
            const data = await reportsService.getDailyReport(date);
            setDailyReport(data);
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
        loadDailyReport(newDateStr);
    };

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

    const maxRevenueValue = useMemo(() => {
        if (!summary?.chart_data) return 1;
        return Math.max(...summary.chart_data.map(d => d.total), 1);
    }, [summary?.chart_data]);

    const maxExpenseValue = useMemo(() => {
        if (!summary?.expense_chart_data) return 1;
        return Math.max(...summary.expense_chart_data.map(d => d.amount), 1);
    }, [summary?.expense_chart_data]);

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="size-16 border-4 border-manevo-teal border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 font-bold animate-pulse text-sm uppercase tracking-widest">Cargando análisis...</p>
                </div>
            </div>
        );
    }

    const marginPct = summary?.metrics.total_revenue
        ? Math.round((summary.metrics.net_profit / summary.metrics.total_revenue) * 100)
        : 0;

    return (
        <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 px-2 md:px-0">

            {/* Hero */}
            <div className="bg-manevo-slate rounded-[24px] md:rounded-[32px] p-6 md:p-8 text-white relative overflow-hidden shadow-2xl shadow-manevo-slate/40">
                <div className="absolute top-0 right-0 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-manevo-teal/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[150px] h-[150px] bg-manevo-teal/5 blur-[60px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none"></div>

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-4">
                            <span className="material-symbols-outlined text-[14px] text-manevo-teal">analytics</span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-manevo-teal">Centro de Análisis</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tightest leading-tight">
                            Reportes &<br /><span className="text-manevo-teal">Métricas</span>
                        </h1>
                        <p className="text-slate-400 text-sm font-medium mt-3">Visión global del desempeño de tu negocio.</p>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Ganancia Neta', value: formatCurrency(summary?.metrics.net_profit || 0), accent: true },
                            { label: 'Ingresos Totales', value: formatCurrency(summary?.metrics.total_revenue || 0), accent: false },
                            { label: 'Gastos Totales', value: formatCurrency(summary?.metrics.total_expenses || 0), accent: false },
                        ].map((item, i) => (
                            <div key={i} className={`p-4 rounded-2xl border ${item.accent ? 'bg-manevo-teal/10 border-manevo-teal/20' : 'bg-white/5 border-white/10'}`}>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 leading-tight">{item.label}</p>
                                <p className={`text-sm font-black leading-tight ${item.accent ? 'text-manevo-teal' : 'text-white'}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {[
                    { label: 'Servicios', val: summary?.metrics.service_revenue, icon: 'construction', color: 'bg-emerald-50 text-emerald-500', isCurrency: true },
                    { label: 'Productos', val: summary?.metrics.inventory_revenue, icon: 'inventory_2', color: 'bg-blue-50 text-blue-500', isCurrency: true },
                    { label: 'Comisiones', val: summary?.metrics.operator_commissions, icon: 'group', color: 'bg-orange-50 text-orange-500', isCurrency: true },
                    { label: 'Pagos Realizados', val: summary?.metrics.operator_paid, icon: 'payments', color: 'bg-teal-50 text-manevo-teal', isCurrency: true },
                    { label: 'Comisiones Pend.', val: summary?.metrics.operator_pending, icon: 'pending_actions', color: 'bg-rose-50 text-rose-500', isCurrency: true },
                    { label: 'Margen Neto', val: marginPct + '%', icon: 'trending_up', color: 'bg-indigo-50 text-indigo-500', isCurrency: false },
                ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-[24px] p-4 border border-slate-100 shadow-md flex items-center gap-3 hover:shadow-lg transition-all">
                        <div className={`size-10 rounded-xl ${stat.color} flex items-center justify-center shrink-0`}>
                            <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                            <h3 className="text-sm font-black text-manevo-slate truncate">
                                {stat.isCurrency ? formatCurrency(stat.val as number || 0) : stat.val}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Revenue Bar Chart */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h4 className="text-base font-black text-manevo-slate">Ingresos últimos 7 días</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Servicios + Productos</p>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest shrink-0">
                            <span className="flex items-center gap-1 text-slate-500">
                                <span className="size-2 rounded-full bg-manevo-teal inline-block"></span>Serv.
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                                <span className="size-2 rounded-full bg-blue-400 inline-block"></span>Prod.
                            </span>
                        </div>
                    </div>

                    <div className="flex items-end gap-2 h-36">
                        {summary?.chart_data.map((day, i) => {
                            const totalPct = maxRevenueValue > 0 ? (day.total / maxRevenueValue) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                                    {/* Tooltip */}
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-manevo-slate text-white text-[9px] font-black rounded-xl px-2.5 py-2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 whitespace-nowrap shadow-xl">
                                        <p className="text-manevo-teal">{formatCurrency(day.total)}</p>
                                        <p className="text-slate-300 mt-0.5">Serv: {formatCurrency(day.services)}</p>
                                        <p className="text-slate-300">Prod: {formatCurrency(day.inventory)}</p>
                                    </div>

                                    {/* Bar wrapper — grows from bottom */}
                                    <div
                                        className="w-full rounded-t-sm overflow-hidden flex flex-col-reverse transition-all duration-300"
                                        style={{ height: `${totalPct}%`, minHeight: day.total > 0 ? '4px' : '0' }}
                                    >
                                        <div className="bg-manevo-teal group-hover:bg-manevo-teal/90 transition-colors" style={{ flex: Math.max(day.services, 0) }}></div>
                                        <div className="bg-blue-400/80 group-hover:bg-blue-400 transition-colors" style={{ flex: Math.max(day.inventory, 0) }}></div>
                                    </div>

                                    <p className="text-[8px] text-slate-400 font-bold shrink-0">
                                        {new Date(day.date + "T00:00:00").toLocaleDateString('es', { weekday: 'short' }).slice(0, 3)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Expense Bar Chart */}
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8">
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h4 className="text-base font-black text-manevo-slate">Gastos últimos 7 días</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Egresos operativos</p>
                        </div>
                        <div className="size-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-xl text-rose-500">trending_down</span>
                        </div>
                    </div>

                    <div className="flex items-end gap-2 h-36">
                        {summary?.expense_chart_data.map((day, i) => {
                            const pct = maxExpenseValue > 0 ? (day.amount / maxExpenseValue) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-manevo-slate text-white text-[9px] font-black rounded-xl px-2.5 py-1.5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 whitespace-nowrap shadow-xl">
                                        {formatCurrency(day.amount)}
                                    </div>
                                    <div
                                        className="w-full rounded-t-sm bg-rose-400/70 group-hover:bg-rose-500 transition-colors"
                                        style={{ height: `${pct}%`, minHeight: day.amount > 0 ? '4px' : '0' }}
                                    ></div>
                                    <p className="text-[8px] text-slate-400 font-bold shrink-0">
                                        {new Date(day.date + "T00:00:00").toLocaleDateString('es', { weekday: 'short' }).slice(0, 3)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Top Operators */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 md:px-8 py-5 border-b border-slate-50 bg-slate-50/20 flex items-center justify-between">
                    <div>
                        <h4 className="text-base font-black text-manevo-slate">Top Operadores</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Por ingresos generados (acumulado)</p>
                    </div>
                    <div className="size-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xl text-indigo-500">leaderboard</span>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    {!summary?.top_operators || summary.top_operators.length === 0 ? (
                        <div className="py-10 text-center text-slate-300 font-bold text-[10px] uppercase">
                            Sin datos de operadores aún
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {summary.top_operators.map((op, i) => {
                                const maxGenerated = summary.top_operators[0]?.total_generated || 1;
                                const barWidth = (op.total_generated / maxGenerated) * 100;
                                const margin = op.total_generated - op.commission;
                                const marginPctOp = op.total_generated > 0
                                    ? ((margin / op.total_generated) * 100).toFixed(1)
                                    : '0';

                                return (
                                    <div key={i}>
                                        <div className="flex items-center gap-4 mb-2">
                                            <div className="size-8 rounded-xl bg-manevo-slate text-manevo-teal flex items-center justify-center font-black text-[10px] shrink-0">
                                                #{i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-sm font-black text-manevo-slate truncate uppercase">{op.name}</p>
                                                    <p className="text-sm font-black text-emerald-500 shrink-0">{formatCurrency(op.total_generated)}</p>
                                                </div>
                                                <div className="flex items-center justify-between gap-2 mt-0.5">
                                                    <p className="text-[9px] font-bold text-slate-400">
                                                        Comisión: <span className="text-rose-400">{formatCurrency(op.commission)}</span>
                                                    </p>
                                                    <p className="text-[9px] font-bold text-slate-400">
                                                        Margen: <span className="text-manevo-teal">{marginPctOp}%</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="ml-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-manevo-teal to-blue-400 rounded-full transition-all duration-700"
                                                style={{ width: `${barWidth}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Audit */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden relative">
                {loadingDaily && (
                    <div className="absolute inset-x-0 bottom-0 top-[64px] bg-white/60 backdrop-blur-[2px] z-50 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                            <div className="size-10 border-4 border-manevo-teal border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-[10px] font-black text-manevo-teal uppercase tracking-widest">Consultando...</p>
                        </div>
                    </div>
                )}

                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/20 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h4 className="text-base font-black text-manevo-slate">Auditoría por Día</h4>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                        <button onClick={() => navigateDay(-1)} disabled={loadingDaily} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-manevo-teal transition-all disabled:opacity-30">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <div className="px-3 py-1 flex items-center gap-2 border-x border-slate-50">
                            <span className="material-symbols-outlined text-[18px] text-manevo-teal">event</span>
                            <span className="font-black text-manevo-slate text-xs uppercase tracking-tighter">
                                {new Date(selectedDate + "T00:00:00").toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                        <button onClick={() => navigateDay(1)} disabled={loadingDaily} className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-manevo-teal transition-all disabled:opacity-30">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>

                <div className={`p-5 md:p-8 transition-opacity ${loadingDaily ? 'opacity-20' : ''}`}>
                    {/* Day summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        {[
                            { label: 'Ingresos', val: formatCurrency(dailyReport?.total_income || 0), icon: 'arrow_upward', color: 'text-emerald-500' },
                            { label: 'Ganancia', val: formatCurrency(dailyReport?.net_profit || 0), icon: 'account_balance', color: 'text-manevo-teal' },
                            { label: 'Gastos', val: formatCurrency(dailyReport?.expenses || 0), icon: 'arrow_downward', color: 'text-rose-500' },
                            { label: 'Servicios', val: String(dailyReport?.services_count || 0), icon: 'construction', color: 'text-blue-500' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
                                <span className={`material-symbols-outlined text-xl ${item.color}`}>{item.icon}</span>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-sm font-black text-manevo-slate">{item.val}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Payment methods */}
                    <div className="flex gap-3 mb-6">
                        <div className="flex-1 flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">💵 Efectivo</span>
                            <span className="text-xs font-black text-emerald-600">{formatCurrency(dailyReport?.payment_methods.cash || 0)}</span>
                        </div>
                        <div className="flex-1 flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-500 uppercase">🏦 Transferencia</span>
                            <span className="text-xs font-black text-blue-600">{formatCurrency(dailyReport?.payment_methods.transfer || 0)}</span>
                        </div>
                    </div>

                    {/* Operators that day */}
                    {dailyReport && dailyReport.operators.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dailyReport.operators.map((op, opIdx) => {
                                const isExpanded = expandedOperator === op.name;
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
                                                <div key={sIdx} className="flex justify-between items-center text-[11px]">
                                                    <span className="text-slate-600 font-medium truncate max-w-[150px]">{service.name}</span>
                                                    <span className="font-black text-manevo-slate shrink-0">
                                                        {formatCurrency(service.gross - (service.gross * (service.commission_percentage / 100)))}
                                                    </span>
                                                </div>
                                            ))}
                                            {!isExpanded && remaining > 0 && (
                                                <button
                                                    onClick={() => setExpandedOperator(op.name)}
                                                    className="w-full text-[9px] font-black text-manevo-teal uppercase border border-manevo-teal/20 py-1.5 rounded-lg hover:bg-manevo-teal/5 transition-colors"
                                                >
                                                    + {remaining} más
                                                </button>
                                            )}
                                            {isExpanded && (
                                                <button
                                                    onClick={() => setExpandedOperator(null)}
                                                    className="w-full text-[9px] font-black text-slate-400 uppercase border border-slate-100 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                                                >
                                                    Colapsar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="py-8 text-center text-slate-300 font-bold text-[10px] uppercase">
                            Sin actividad registrada este día
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
