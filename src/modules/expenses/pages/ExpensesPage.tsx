import React, { useEffect, useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Select } from '../../../shared/components/ui/Select';
import expenseService from '../services/expenseService';
import type { Expense, ExpenseCreateDTO } from '../types/expense';

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Form state
    const [form, setForm] = useState<ExpenseCreateDTO>({
        category: 'Servicios',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
        payment_method: 'Efectivo'
    });

    const categories = [
        'Servicios',
        'Arriendo',
        'Nomina',
        'Insumos',
        'Mantenimiento',
        'Publicidad',
        'Otros'
    ];

    const paymentMethods = [
        'Efectivo',
        'Transferencia',
        'Tarjeta',
        'Caja Menor'
    ];

    useEffect(() => {
        loadExpenses();
    }, []);

    const loadExpenses = async () => {
        try {
            setLoading(true);
            const data = await expenseService.getExpenses();
            setExpenses(data);
        } catch (error) {
            console.error('Error al cargar gastos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setIsSaving(true);
            await expenseService.createExpense(form);
            setIsModalOpen(false);
            setForm({
                category: 'Servicios',
                amount: 0,
                date: new Date().toISOString().split('T')[0],
                description: '',
                payment_method: 'Efectivo'
            });
            loadExpenses();
        } catch (error) {
            console.error('Error al guardar gasto:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este registro de gasto?')) return;
        try {
            await expenseService.deleteExpense(id);
            loadExpenses();
        } catch (error) {
            console.error('Error al eliminar gasto:', error);
        }
    };

    const filteredExpenses = expenses.filter(e =>
        e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount), 0);

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            {/* Header section */}
            <div className="relative overflow-hidden bg-manevo-slate rounded-3xl md:rounded-4xl p-6 md:p-10 text-white shadow-2xl shadow-manevo-slate/20">
                <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-manevo-teal/5 blur-2xl md:blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border border-manevo-teal/20">
                            Egresos y Caja
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tightest leading-tight">Control de Gastos</h1>
                        <p className="text-slate-400 font-medium mt-1 text-sm md:text-base">Administra y categoriza cada salida de dinero de tu negocio.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center gap-2 shadow-lg shadow-manevo-teal/20">
                            <span className="material-symbols-outlined">add</span>
                            Registrar Gasto
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all group">
                    <div className="size-16 rounded-2xl bg-manevo-slate flex items-center justify-center text-manevo-teal group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Gastos</p>
                        <p className="text-3xl font-black text-manevo-slate leading-none">{formatCurrency(totalExpenses)}</p>
                    </div>
                </div>
                {/* Categoría más alta (simplificado) */}
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all group">
                    <div className="size-16 rounded-2xl bg-manevo-slate flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">trending_down</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Último Gasto</p>
                        <p className="text-xl font-black text-manevo-slate leading-none">
                            {expenses.length > 0 ? formatCurrency(Number(expenses[0].amount)) : '$ 0'}
                        </p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-xl transition-all group">
                    <div className="size-16 rounded-2xl bg-manevo-slate flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">calendar_today</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Registros</p>
                        <p className="text-3xl font-black text-manevo-slate leading-none">{expenses.length}</p>
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
                            placeholder="Buscar por categoría o descripción..."
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
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Categoría</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Descripción</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Método</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Responsable</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400">Monto</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-wider text-slate-400 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-6" colSpan={7}>
                                            <div className="h-4 bg-slate-100 rounded w-full"></div>
                                        </td>
                                    </tr>
                                ))
                            ) : filteredExpenses.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        No se encontraron registros de gastos.
                                    </td>
                                </tr>
                            ) : filteredExpenses.map((expense) => (
                                <tr key={expense.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                                        {new Date(expense.date).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold border border-slate-200">
                                            {expense.category.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-manevo-slate max-w-xs truncate">
                                        {expense.description || 'Sin descripción'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {expense.payment_method}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {expense.user?.name}
                                    </td>
                                    <td className="px-6 py-4 font-black text-rose-500">
                                        {formatCurrency(expense.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(expense.id)}
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

            {/* Create Gasto Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Registrar Nuevo Gasto"
            >
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-manevo-slate">Categoría</label>
                        <Select
                            value={form.category || ''}
                            onChange={(val) => setForm({ ...form, category: String(val) })}
                            options={categories.map(cat => ({ value: cat, label: cat }))}
                            className="space-y-0 text-sm font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Monto"
                            type="number"
                            required
                            placeholder="0"
                            value={form.amount.toString()}
                            onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) })}
                        />
                        <Input
                            label="Fecha"
                            type="date"
                            required
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-bold text-manevo-slate">Método de Pago</label>
                        <Select
                            value={form.payment_method || ''}
                            onChange={(val) => setForm({ ...form, payment_method: String(val) })}
                            options={paymentMethods.map(m => ({ value: m, label: m }))}
                            className="space-y-0 text-sm font-medium"
                        />
                    </div>

                    <Input
                        label="Descripción / Observaciones"
                        placeholder="Ej: Pago de recibo de energía eléctrica mes de Marzo"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />

                    <div className="pt-4 flex gap-3">
                        <Button variant="ghost" className="flex-1" type="button" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                        <Button className="flex-1" type="submit" disabled={isSaving}>
                            {isSaving ? 'Guardando...' : 'Registrar Gasto'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
