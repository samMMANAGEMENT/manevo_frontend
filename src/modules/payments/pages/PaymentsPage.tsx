import React, { useEffect, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Select } from '../../../shared/components/ui/Select';
import paymentService from '../services/paymentService';
import operatorService from '../../operator/services/operatorService';
import type { OperatorPayment, PendingCommission } from '../types/payment';
import type { Operator } from '../../operator/types/operatorType';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<OperatorPayment[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [pendingCommissions, setPendingCommissions] = useState<PendingCommission[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [selectedOperatorId, setSelectedOperatorId] = useState<number>(0);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [reference, setReference] = useState('');
    const [description, setDescription] = useState('');
    const [isFreePayment, setIsFreePayment] = useState(false);
    const [freeAmount, setFreeAmount] = useState(0);

    // Selected commissions to pay
    const [selectedPerfIds, setSelectedPerfIds] = useState<number[]>([]);

    const paymentMethods = [
        'Efectivo',
        'Transferencia',
        'Caja Menor',
        'Tarjeta'
    ];

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (selectedOperatorId > 0) {
            loadOperatorCommissions(selectedOperatorId);
        } else {
            setPendingCommissions([]);
            setSelectedPerfIds([]);
        }
    }, [selectedOperatorId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [paymentsData, operatorsData] = await Promise.all([
                paymentService.getPayments(),
                operatorService.getOperators()
            ]);
            setPayments(paymentsData);
            setOperators(operatorsData);
        } catch (error) {
            console.error('Error al cargar datos de pagos:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOperatorCommissions = async (opId: number) => {
        try {
            const data = await paymentService.getPendingCommissions(opId);
            setPendingCommissions(data);
            // By default, select all pending commissions
            setSelectedPerfIds(data.map(c => c.id));
        } catch (error) {
            console.error('Error al cargar comisiones del operador:', error);
        }
    };

    const handleCommissionToggle = (id: number) => {
        if (selectedPerfIds.includes(id)) {
            setSelectedPerfIds(selectedPerfIds.filter(pid => pid !== id));
        } else {
            setSelectedPerfIds([...selectedPerfIds, id]);
        }
    };

    // Calculate dynamic commission total
    const selectedCommissionsTotal = pendingCommissions
        .filter(c => selectedPerfIds.includes(c.id))
        .reduce((sum, c) => sum + Number(c.commission_amount), 0);

    const finalAmount = isFreePayment ? freeAmount : selectedCommissionsTotal;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedOperatorId <= 0) {
            alert('Por favor selecciona un operador');
            return;
        }
        if (finalAmount <= 0) {
            alert('El monto del pago debe ser mayor a 0');
            return;
        }

        try {
            setIsSaving(true);
            await paymentService.createPayment({
                operator_id: selectedOperatorId,
                amount: finalAmount,
                payment_date: paymentDate,
                payment_method: paymentMethod,
                status: 'Paid',
                reference: reference || undefined,
                description: description || undefined,
                performance_ids: isFreePayment ? [] : selectedPerfIds
            });

            // Reset states
            setIsModalOpen(false);
            setSelectedOperatorId(0);
            setPaymentMethod('Efectivo');
            setPaymentDate(new Date().toISOString().split('T')[0]);
            setReference('');
            setDescription('');
            setIsFreePayment(false);
            setFreeAmount(0);
            setSelectedPerfIds([]);

            loadData();
        } catch (error) {
            console.error('Error al guardar el pago:', error);
            alert('Error al guardar el pago');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este registro de pago? Se revertirán los servicios enlazados como no pagados.')) return;
        try {
            await paymentService.deletePayment(id);
            loadData();
        } catch (error) {
            console.error('Error al eliminar pago:', error);
        }
    };

    const filteredPayments = payments.filter(p => {
        const opName = p.operator?.user?.name || '';
        const ref = p.reference || '';
        const desc = p.description || '';
        const search = searchTerm.toLowerCase();
        return (
            opName.toLowerCase().includes(search) ||
            ref.toLowerCase().includes(search) ||
            desc.toLowerCase().includes(search) ||
            p.payment_method.toLowerCase().includes(search)
        );
    });

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    const totalPaid = payments.reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header section */}
            <div className="relative overflow-hidden bg-manevo-slate rounded-3xl md:rounded-4xl p-6 md:p-10 text-white shadow-2xl shadow-manevo-slate/20">
                <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-manevo-teal/5 blur-2xl md:blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-manevo-teal/20">
                            Egresos y Nómina
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tightest leading-tight">Pagos a Operadores</h1>
                        <p className="text-slate-400 font-medium mt-1 text-sm md:text-base">Administra y registra los pagos de comisiones por servicios de tus operadores.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center gap-2 shadow-lg shadow-manevo-teal/20">
                            <span className="material-symbols-outlined">payments</span>
                            Registrar Pago
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all group">
                    <div className="size-16 rounded-2xl bg-manevo-slate flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">check_circle</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pagado</p>
                        <p className="text-3xl font-black text-manevo-slate leading-none">{formatCurrency(totalPaid)}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all group">
                    <div className="size-16 rounded-2xl bg-manevo-slate flex items-center justify-center text-manevo-teal group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">badge</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Operadores Activos</p>
                        <p className="text-3xl font-black text-manevo-slate leading-none">{operators.length}</p>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all group">
                    <div className="size-16 rounded-2xl bg-manevo-slate flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">receipt_long</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Transacciones</p>
                        <p className="text-3xl font-black text-manevo-slate leading-none">{payments.length}</p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative w-full max-w-md">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar por empleado, referencia o método..."
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-manevo-teal/20 focus:border-manevo-teal transition-all text-black"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-50 bg-slate-50/20">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Fecha</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Operador</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Concepto / Descripción</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Servicios Enlazados</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Método</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Registrado por</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Monto</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-6" colSpan={8}>
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No se encontraron registros de pagos.
                                    </td>
                                </tr>
                            ) : filteredPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {new Date(payment.payment_date).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-bold text-manevo-slate">
                                        {payment.operator?.user?.name || 'Operador Eliminado'}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 max-w-xs truncate">
                                        {payment.description || 'Sin descripción'}
                                        {payment.reference && (
                                            <span className="block text-[10px] text-slate-400 font-bold">Ref: {payment.reference}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {payment.performances && payment.performances.length > 0 ? (
                                            <span className="px-2.5 py-1 bg-manevo-teal/10 text-black font-bold rounded-full text-[10px] border border-manevo-teal/20">
                                                {payment.performances.length} Servicio(s)
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-full text-[10px] border border-amber-200">
                                                Pago Libre / Adelanto
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {payment.payment_method}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {payment.user?.name || 'Sistema'}
                                    </td>
                                    <td className="px-6 py-4 font-black text-emerald-500 text-base">
                                        {formatCurrency(Number(payment.amount))}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(payment.id)}
                                            className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Payment Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Pago a Operador"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Operator Selection */}
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-manevo-slate">Operador</label>
                        <Select
                            value={selectedOperatorId}
                            onChange={(val) => setSelectedOperatorId(Number(val))}
                            placeholder="Selecciona un operador..."
                            options={operators.map(op => ({ value: op.id, label: op.user?.name || 'Usuario desconocido' }))}
                            className="space-y-0 text-sm font-medium"
                        />
                    </div>

                    {/* Mode selector (Service-commissions vs Free Payment) */}
                    {selectedOperatorId > 0 && (
                        <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100">
                            <div>
                                <p className="text-sm font-bold text-manevo-slate">Registrar como Pago Libre</p>
                                <p className="text-xs text-slate-400 font-medium">Activa para pagar adelantos, bonos o montos manuales libres</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isFreePayment}
                                    onChange={(e) => {
                                        setIsFreePayment(e.target.checked);
                                        setSelectedPerfIds([]);
                                    }}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-manevo-teal"></div>
                            </label>
                        </div>
                    )}

                    {/* Commissions check-list */}
                    {selectedOperatorId > 0 && !isFreePayment && (
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-manevo-slate">Servicios Pendientes por Liquidar</label>
                            {pendingCommissions.length === 0 ? (
                                <p className="text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200 rounded-xl p-3">
                                    Este operador no tiene comisiones de servicios pendientes por liquidar.
                                </p>
                            ) : (
                                <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-56 overflow-y-auto no-scrollbar divide-y divide-slate-100">
                                    {pendingCommissions.map(comm => (
                                        <div
                                            key={comm.id}
                                            onClick={() => handleCommissionToggle(comm.id)}
                                            className={`p-3.5 flex items-center gap-3 hover:bg-slate-50/50 cursor-pointer transition-all ${
                                                selectedPerfIds.includes(comm.id) ? 'bg-manevo-teal/5' : ''
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedPerfIds.includes(comm.id)}
                                                onChange={() => {}} // Handled by div onClick
                                                className="rounded text-manevo-teal focus:ring-manevo-teal"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-bold text-manevo-slate truncate">
                                                    {comm.service?.name}
                                                </p>
                                                <p className="text-[10px] text-slate-400 font-medium">
                                                    Precio: {formatCurrency(Number(comm.price_snapshot))} • Comisión: {Number(comm.commission_percentage_snapshot)}%
                                                </p>
                                                <p className="text-[9px] text-slate-400">
                                                    Fecha: {new Date(comm.created_at).toLocaleDateString('es-CO')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-black text-manevo-slate">
                                                    {formatCurrency(comm.commission_amount)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Numeric Input if Free Payment */}
                    {selectedOperatorId > 0 && isFreePayment && (
                        <Input
                            label="Monto del Pago (COP)"
                            type="number"
                            required
                            placeholder="0"
                            value={freeAmount.toString()}
                            onChange={(e) => setFreeAmount(parseFloat(e.target.value) || 0)}
                        />
                    )}

                    {/* Dynamic total visualization */}
                    {selectedOperatorId > 0 && (
                        <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Total a Liquidar</span>
                            <span className={`text-2xl font-black ${finalAmount > 0 ? 'text-emerald-500' : 'text-slate-400'}`}>
                                {formatCurrency(finalAmount)}
                            </span>
                        </div>
                    )}

                    {/* Additional Payment Metadata */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-manevo-slate">Método de Pago</label>
                            <Select
                                value={paymentMethod}
                                onChange={(val) => setPaymentMethod(String(val))}
                                options={paymentMethods.map(m => ({ value: m, label: m }))}
                                className="space-y-0 text-sm font-medium"
                            />
                        </div>
                        <Input
                            label="Fecha de Pago"
                            type="date"
                            required
                            value={paymentDate}
                            onChange={(e) => setPaymentDate(e.target.value)}
                        />
                    </div>

                    <Input
                        label="Referencia / Recibo de Pago (Opcional)"
                        placeholder="Ej: Transacción #98234 o Caja Menor"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                    />

                    <Input
                        label="Descripción / Observaciones"
                        placeholder="Ej: Liquidación de comisiones semana del 20 al 27 de Mayo"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button className="flex-1" type="submit" disabled={isSaving || finalAmount <= 0}>
                            {isSaving ? 'Registrando...' : 'Registrar Pago'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
