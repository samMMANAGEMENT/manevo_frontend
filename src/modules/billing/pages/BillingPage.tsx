import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Select } from '../../../shared/components/ui/Select';
import billingModuleService from '../services/billingModuleService';
import customerService, { type Customer } from '../../settings/services/customerService';
import type { PendingBillingItem, Invoice } from '../types/billingType';

export default function BillingPage() {
    const [pendingItems, setPendingItems] = useState<PendingBillingItem[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    // Form state
    const [customer, setCustomer] = useState({
        name: '',
        identification: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [pending, history, customerList] = await Promise.all([
                billingModuleService.getPendingItems(),
                billingModuleService.getInvoices(),
                customerService.obtenerClientes()
            ]);
            setPendingItems(pending);
            setInvoices(history);
            setCustomers(customerList);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleSelection = (type: string, id: number) => {
        const key = `${type}-${id}`;
        setSelectedIds(prev =>
            prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
        );
    };

    const selectedItemsData = useMemo(() => {
        return pendingItems.filter(item => selectedIds.includes(`${item.type}-${item.id}`));
    }, [selectedIds, pendingItems]);

    const totalToInvoice = useMemo(() => {
        return selectedItemsData.reduce((acc, item) => acc + Number(item.total), 0);
    }, [selectedItemsData]);

    const handleCreateInvoice = async () => {
        if (selectedItemsData.length === 0) return;

        try {
            setProcessing(true);
            await billingModuleService.createInvoice({
                ...customer,
                customer_name: customer.name,
                customer_identification: customer.identification,
                customer_email: customer.email,
                customer_phone: customer.phone,
                customer_address: customer.address,
                items: selectedItemsData,
                total: totalToInvoice
            });

            alert('Factura enviada con éxito');
            setSelectedIds([]);
            setShowInvoiceModal(false);
            loadData();
        } catch (error: any) {
            console.error('Error al crear factura:', error);
            alert('Error: ' + (error.response?.data?.error || error.message));
        } finally {
            setProcessing(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="flex flex-col gap-8 animate-fade-in pb-10">
            {/* Header Section */}
            <div className="bg-manevo-slate p-8 md:p-12 rounded-4xl border border-white/5 shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-manevo-teal/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-manevo-teal/20">
                            Módulo de Facturación
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tightest leading-tight">Factura Electrónica</h1>
                        <p className="text-slate-400 font-medium mt-2 max-w-xl">Agrupa servicios y ventas POS para emitir facturas electrónicas legales ante la DIAN.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[10px] font-bold text-manevo-teal uppercase tracking-widest mb-1">Pendientes</p>
                            <p className="text-2xl font-black">{pendingItems.length}</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center min-w-[140px]">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Emitidas</p>
                            <p className="text-2xl font-black">{invoices.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left: Pending Items */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-4xl border border-slate-100 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-manevo-slate uppercase tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined text-manevo-teal">pending_actions</span>
                                Transacciones Pendientes
                            </h3>
                            {selectedIds.length > 0 && (
                                <button
                                    onClick={() => setSelectedIds([])}
                                    className="text-xs font-bold text-rose-500 hover:underline"
                                >
                                    Limpiar selección
                                </button>
                            )}
                        </div>
                        <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="p-8 animate-pulse bg-slate-50/30 m-4 rounded-2xl"></div>)
                            ) : pendingItems.length === 0 ? (
                                <div className="p-20 text-center space-y-4 opacity-40">
                                    <span className="material-symbols-outlined text-6xl text-slate-300">task_alt</span>
                                    <p className="font-bold text-slate-400 uppercase tracking-widest text-sm">Todo está al día</p>
                                </div>
                            ) : pendingItems.map(item => (
                                <div
                                    key={`${item.type}-${item.id}`}
                                    onClick={() => toggleSelection(item.type, item.id)}
                                    className={`p-5 flex items-center gap-4 cursor-pointer transition-all hover:bg-slate-50
                                        ${selectedIds.includes(`${item.type}-${item.id}`) ? 'bg-manevo-teal/5 border-l-4 border-l-manevo-teal' : 'border-l-4 border-l-transparent'}
                                    `}
                                >
                                    <div className={`size-10 rounded-xl flex items-center justify-center
                                        ${item.type === 'service' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}
                                    `}>
                                        <span className="material-symbols-outlined">{item.type === 'service' ? 'construction' : 'shopping_bag'}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-manevo-slate text-sm uppercase">{item.description}</h4>
                                            <span className="text-sm font-black text-manevo-slate">{formatCurrency(item.total)}</span>
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium truncate">{item.details}</p>
                                        <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">{formatDate(item.date)}</p>
                                    </div>
                                    <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all
                                        ${selectedIds.includes(`${item.type}-${item.id}`) ? 'bg-manevo-teal border-manevo-teal text-manevo-slate' : 'border-slate-200'}
                                    `}>
                                        {selectedIds.includes(`${item.type}-${item.id}`) && <span className="material-symbols-outlined text-xs font-bold">check</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Summary & Action */}
                <div className="space-y-6">
                    <div className="bg-white rounded-4xl border border-slate-100 shadow-2xl p-8 sticky top-24">
                        <h3 className="text-xl font-black text-manevo-slate mb-6 flex items-center gap-2">
                            Resumen de Factura
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                                <span>Ítems seleccionados</span>
                                <span className="text-manevo-slate">{selectedIds.length}</span>
                            </div>
                            <div className="py-4 border-y border-slate-50 flex justify-between items-center">
                                <span className="text-sm font-black text-manevo-slate uppercase tracking-tighter">Total a Facturar</span>
                                <span className="text-3xl font-black text-manevo-slate">{formatCurrency(totalToInvoice)}</span>
                            </div>
                        </div>

                        <Button
                            fullWidth
                            disabled={selectedIds.length === 0}
                            onClick={() => setShowInvoiceModal(true)}
                            className="py-5 bg-manevo-slate text-white rounded-2xl font-black text-lg shadow-xl shadow-manevo-slate/20 hover:scale-[1.02] active:scale-95 transition-all"
                        >
                            <span className="material-symbols-outlined mr-2">receipt</span>
                            GENERAR FACTURA DIAN
                        </Button>

                        <p className="mt-4 text-[10px] text-slate-400 text-center font-medium italic">
                            Esta acción enviará automáticamente la factura electrónica al proveedor configurado.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom: History */}
            <div className="bg-white rounded-4xl border border-slate-100 shadow-xl overflow-hidden mt-4">
                <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-xl font-black text-manevo-slate uppercase tracking-tight flex items-center gap-2">
                        <span className="material-symbols-outlined text-manevo-teal">history</span>
                        Historial de Facturas Emitidas
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Número</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cliente</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-slate-300 font-bold uppercase tracking-widest text-xs">Aún no hay facturas emitidas</td>
                                </tr>
                            ) : invoices.map(invoice => (
                                <tr key={invoice.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <p className="font-black text-manevo-slate text-sm">{invoice.prefix}{invoice.number}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate w-32">{invoice.cufe || 'Procesando CUFE...'}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-bold text-manevo-slate text-sm">{invoice.customer_name}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{invoice.customer_identification}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-bold text-slate-500">{formatDate(invoice.created_at)}</p>
                                    </td>
                                    <td className="px-8 py-5 font-black text-manevo-slate">
                                        {formatCurrency(invoice.total)}
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border
                                            ${invoice.status === 'sent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                invoice.status === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                    'bg-blue-50 text-blue-600 border-blue-100'}
                                        `}>
                                            {invoice.status === 'sent' ? 'Emitida' : invoice.status === 'error' ? 'Error' : 'Borrador'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex justify-end gap-2">
                                            {invoice.pdf_url && (
                                                <a
                                                    href={invoice.pdf_url}
                                                    target="_blank"
                                                    className="size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-manevo-teal/10 hover:text-manevo-teal transition-all"
                                                    title="Descargar PDF"
                                                >
                                                    <span className="material-symbols-outlined text-xl">picture_as_pdf</span>
                                                </a>
                                            )}
                                            {invoice.xml_url && (
                                                <a
                                                    href={invoice.xml_url}
                                                    target="_blank"
                                                    className="size-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-blue-50 hover:text-blue-500 transition-all"
                                                    title="Descargar XML"
                                                >
                                                    <span className="material-symbols-outlined text-xl">code</span>
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Invoice Modal */}
            <Modal
                isOpen={showInvoiceModal}
                onClose={() => !processing && setShowInvoiceModal(false)}
                title="Datos del Cliente"
            >
                <div className="space-y-6">
                    <div className="bg-manevo-teal/5 p-6 rounded-3xl border border-manevo-teal/10 flex justify-between items-center text-manevo-slate">
                        <span className="text-sm font-black uppercase tracking-tight">Valor de Factura</span>
                        <span className="text-3xl font-black">{formatCurrency(totalToInvoice)}</span>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Seleccionar Cliente Existente</label>
                            <Select
                                value={customers.find(c => c.identification_number === customer.identification)?.id || ''}
                                onChange={(val) => {
                                    const c = customers.find(curr => curr.id === Number(val));
                                    if (c) {
                                        setCustomer({
                                            name: c.name,
                                            identification: c.identification_number,
                                            email: c.email || '',
                                            phone: c.phone || '',
                                            address: c.address || ''
                                        });
                                    } else {
                                        setCustomer({
                                            name: '',
                                            identification: '',
                                            email: '',
                                            phone: '',
                                            address: ''
                                        });
                                    }
                                }}
                                placeholder="-- Nuevo / Manual --"
                                options={customers.map(c => ({ value: c.id || 0, label: `${c.name} (${c.identification_number})` }))}
                                className="space-y-0 text-sm font-bold"
                            />
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-4">
                            <Input
                                label="Nombre / Razón Social"
                                placeholder="Ej: Victor Andres Castro"
                                value={customer.name}
                                onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                            />
                            <Input
                                label="Identificación / NIT"
                                placeholder="Ej: 7573772"
                                value={customer.identification}
                                onChange={(e) => setCustomer({ ...customer, identification: e.target.value })}
                            />
                            <Input
                                label="Correo para Notificación"
                                type="email"
                                placeholder="cliente@correo.com"
                                value={customer.email}
                                onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <Input
                                    label="Teléfono"
                                    placeholder="321 000 0000"
                                    value={customer.phone}
                                    onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                                />
                                <Input
                                    label="Dirección"
                                    placeholder="Cra 123 # 45-67"
                                    value={customer.address}
                                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex gap-4">
                        <Button variant="outline" className="flex-1 py-4 rounded-2xl" onClick={() => setShowInvoiceModal(false)} disabled={processing}>
                            Cancelar
                        </Button>
                        <Button
                            className="flex-1 py-4 rounded-2xl shadow-lg shadow-manevo-teal/20"
                            onClick={handleCreateInvoice}
                            disabled={processing || !customer.name || !customer.identification || !customer.email}
                        >
                            {processing ? 'Enviando DIAN...' : 'Confirmar y Emitir'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
