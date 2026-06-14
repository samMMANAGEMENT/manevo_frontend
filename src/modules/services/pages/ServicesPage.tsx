import { useState, useEffect, useMemo } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Select } from '../../../shared/components/ui/Select';
import servicesModuleService from '../services/servicesModuleService';
import operatorService from '../../operator/services/operatorService';
import type { MasterService } from '../types/servicesType';
import type { Operator } from '../../operator/types/operatorType';
import { useToast } from '../../../shared/providers/ToastProvider';

interface SelectedService extends MasterService {
    selectedOperatorId: number;
    discountPercentage: number;
    tempId: string; // Para manejar múltiples del mismo servicio
}

export default function ServicesPage() {
    const { showToast } = useToast();
    const [masterServices, setMasterServices] = useState<MasterService[]>([]);
    const [operators, setOperators] = useState<Operator[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedList, setSelectedList] = useState<SelectedService[]>([]);

    // Checkout state
    const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer' | 'mixed'>('cash');
    const [cashAmount, setCashAmount] = useState<string>('');
    const [transferAmount, setTransferAmount] = useState<string>('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [servicesData, operatorsData] = await Promise.all([
                servicesModuleService.getMasterServices(),
                operatorService.getOperators()
            ]);
            setMasterServices(servicesData);
            setOperators(operatorsData);
        } catch (error) {
            console.error('Error al cargar datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToList = (service: MasterService) => {
        const newItem: SelectedService = {
            ...service,
            selectedOperatorId: operators[0]?.id || 0,
            discountPercentage: 0,
            tempId: Math.random().toString(36).substr(2, 9)
        };
        setSelectedList([...selectedList, newItem]);
    };

    const updateItem = (tempId: string, updates: Partial<SelectedService>) => {
        setSelectedList(prev => prev.map(item =>
            item.tempId === tempId ? { ...item, ...updates } : item
        ));
    };

    const removeFromList = (tempId: string) => {
        setSelectedList(prev => prev.filter(item => item.tempId !== tempId));
    };

    const totalGross = useMemo(() => {
        return selectedList.reduce((acc, item) => acc + Number(item.price), 0);
    }, [selectedList]);

    const totalNet = useMemo(() => {
        return selectedList.reduce((acc, item) => {
            const discount = (item.discountPercentage / 100) * item.price;
            return acc + (item.price - discount);
        }, 0);
    }, [selectedList]);

    const handleCheckout = async () => {
        if (selectedList.length === 0) return;

        try {
            setProcessing(true);
            const orderData = {
                payment_method: paymentMethod,
                cash_amount: paymentMethod === 'mixed' ? parseFloat(cashAmount) : undefined,
                transfer_amount: paymentMethod === 'mixed' ? parseFloat(transferAmount) : undefined,
                items: selectedList.map(item => ({
                    service_id: item.id,
                    operator_id: item.selectedOperatorId,
                    quantity: 1,
                    discount_percentage: item.discountPercentage
                }))
            };

            await servicesModuleService.processOrder(orderData);

            // Reset
            setSelectedList([]);
            setIsCheckoutModalOpen(false);
            setPaymentMethod('cash');
            setCashAmount('');
            setTransferAmount('');

            showToast('Servicios registrados con éxito', 'success');
        } catch (error: any) {
            console.error('Error al procesar registro:', error);
            showToast('Error: ' + (error.response?.data?.error || error.message), 'error');
        } finally {
            setProcessing(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    const filteredServices = masterServices.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col lg:flex-row gap-6 lg:h-[calc(100vh-140px)] animate-fade-in relative pb-20 lg:pb-0">
            {/* Services Catalog */}
            <div className="flex-1 flex flex-col gap-6 min-w-0">
                <div className="bg-manevo-slate p-6 md:p-10 rounded-3xl md:rounded-4xl border border-white/5 shadow-2xl relative overflow-hidden text-white mb-2">
                    <div className="absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 bg-manevo-teal/5 blur-2xl md:blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                    <div className="relative z-10">
                        <span className="inline-flex items-center gap-2 px-3 py-1 bg-manevo-teal/10 text-manevo-teal rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4 border border-manevo-teal/20">
                            Operaciones Diarias
                        </span>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tightest leading-tight">Registro de Servicios</h1>
                        <p className="text-slate-400 font-medium mt-1 text-sm md:text-base">Registra servicios, asigna operarios y aplica descuentos.</p>
                    </div>
                </div>

                <div className="bg-white p-2 md:p-3 rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl flex items-center gap-4 sticky top-16 md:top-20 z-20">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">search</span>
                        <input
                            type="text"
                            placeholder="Buscar servicios..."
                            className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-slate-50 border border-slate-100 rounded-xl md:rounded-2xl text-sm text-black focus:outline-none focus:ring-2 focus:ring-manevo-teal/20 focus:bg-white focus:border-manevo-teal transition-all placeholder:text-slate-400"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 lg:overflow-y-auto no-scrollbar lg:pr-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 pb-4">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse h-40"></div>
                        ))
                    ) : filteredServices.map(service => (
                        <div
                            key={service.id}
                            onClick={() => addToList(service)}
                            className="group relative bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-3 transition-all cursor-pointer shadow-sm hover:border-manevo-teal hover:shadow-2xl hover:shadow-manevo-teal/10 active:scale-95"
                        >
                            <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-manevo-teal group-hover:text-manevo-slate transition-all">
                                <span className="material-symbols-outlined text-2xl">construction</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-manevo-slate text-sm line-clamp-1 uppercase tracking-tight">{service.name}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Servicio Profesional</p>
                            </div>
                            <p className="text-xl font-black text-manevo-slate">{formatCurrency(service.price)}</p>
                            <div className="absolute bottom-4 right-4 text-manevo-teal opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined">add_circle</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Selection List */}
            <div className="w-full lg:w-[450px] flex flex-col gap-6" id="cart-section">
                <div className="flex-1 bg-white rounded-3xl md:rounded-4xl border border-slate-100 shadow-2xl overflow-hidden flex flex-col">
                    <div className="p-6 md:p-8 bg-manevo-slate text-white relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-manevo-teal/10 to-transparent"></div>
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl md:text-2xl font-black tracking-tightest">Servicios Realizados</h3>
                                <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">{selectedList.length} ítems en orden</p>
                            </div>
                            <div className="size-10 md:size-12 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-manevo-teal">
                                <span className="material-symbols-outlined text-xl md:text-2xl">assignment_turned_in</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 custom-scrollbar bg-slate-50/30 min-h-[300px] lg:min-h-0">
                        {selectedList.length === 0 ? (
                            <div className="h-full py-12 lg:py-0 flex flex-col items-center justify-center text-slate-300 gap-4 opacity-60">
                                <div className="size-16 md:size-20 rounded-full bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200">
                                    <span className="material-symbols-outlined text-3xl md:text-4xl">inventory</span>
                                </div>
                                <p className="font-bold text-xs md:text-sm uppercase tracking-widest text-center">Selecciona servicios para<br />empezar el registro</p>
                            </div>
                        ) : selectedList.map(item => (
                            <div key={item.tempId} className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 border border-slate-100 space-y-4 animate-slide-in shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-manevo-teal"></div>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs md:text-sm font-black text-manevo-slate truncate uppercase tracking-tighter">{item.name}</p>
                                        <p className="text-[11px] md:text-xs font-bold text-manevo-teal">{formatCurrency(item.price)}</p>
                                    </div>
                                    <button onClick={() => removeFromList(item.tempId)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors">
                                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">delete</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-2 md:gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Operario</label>
                                        <Select
                                            value={item.selectedOperatorId}
                                            onChange={(val) => updateItem(item.tempId, { selectedOperatorId: Number(val) })}
                                            options={operators.map(op => ({ value: op.id, label: op.user?.name || 'Usuario desconocido' }))}
                                            className="text-[10px] md:text-[11px] font-bold"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest pl-1">Dto. %</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            className="w-full bg-slate-50 border border-slate-100 rounded-lg md:rounded-xl px-2 py-1.5 text-[10px] md:text-[11px] font-black text-manevo-slate focus:outline-none focus:border-manevo-teal transition-colors"
                                            value={item.discountPercentage}
                                            onChange={(e) => updateItem(item.tempId, { discountPercentage: parseFloat(e.target.value) || 0 })}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 md:p-8 bg-white border-t border-slate-100 space-y-4 md:space-y-6">
                        <div className="space-y-2 md:space-y-3">
                            {totalGross > totalNet && (
                                <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest line-through decoration-rose-500/50">
                                    <span>SUBTOTAL BRUTO</span>
                                    <span>{formatCurrency(totalGross)}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center">
                                <span className="text-xs md:text-sm font-black text-manevo-slate uppercase tracking-tighter">Total Neto a Cobrar</span>
                                <span className="text-2xl md:text-3xl font-black text-manevo-slate">
                                    {formatCurrency(totalNet)}
                                </span>
                            </div>
                        </div>
                        <Button
                            fullWidth
                            className="py-4 md:py-5 text-base md:text-lg font-black bg-manevo-slate text-white shadow-2xl shadow-manevo-slate/20 rounded-2xl md:rounded-3xl hover:bg-manevo-slate/90 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                            disabled={selectedList.length === 0}
                            onClick={() => setIsCheckoutModalOpen(true)}
                        >
                            PROCEDER AL PAGO
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Cart Floating Button */}
            <div className="fixed bottom-6 right-6 z-30 lg:hidden">
                <button
                    onClick={() => document.getElementById('cart-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="size-14 rounded-full bg-manevo-slate text-manevo-teal shadow-2xl flex items-center justify-center relative active:scale-90 transition-transform"
                >
                    <span className="material-symbols-outlined">shopping_cart</span>
                    {selectedList.length > 0 && (
                        <span className="absolute -top-1 -right-1 size-6 bg-manevo-teal text-manevo-slate text-[10px] font-black rounded-full flex items-center justify-center border-2 border-manevo-slate">
                            {selectedList.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Checkout Modal */}
            <Modal
                isOpen={isCheckoutModalOpen}
                onClose={() => setIsCheckoutModalOpen(false)}
                title="Consolidar Registro"
            >
                <div className="space-y-6">
                    <div className="text-center bg-manevo-teal/5 p-6 rounded-3xl border border-manevo-teal/10">
                        <p className="text-xs font-bold text-manevo-teal uppercase tracking-widest mb-1">Total Final</p>
                        <h2 className="text-5xl font-black text-manevo-slate">{formatCurrency(totalNet)}</h2>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Método de Recaudo</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['cash', 'transfer', 'mixed'].map((method) => (
                                <button
                                    key={method}
                                    onClick={() => setPaymentMethod(method as any)}
                                    className={`py-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-1
                                        ${paymentMethod === method
                                            ? 'border-manevo-teal bg-manevo-teal/5 text-manevo-teal'
                                            : 'border-slate-100 text-slate-400 hover:border-slate-200'}
                                    `}
                                >
                                    <span className="material-symbols-outlined text-[20px]">
                                        {method === 'cash' ? 'payments' : method === 'transfer' ? 'account_balance' : 'account_balance_wallet'}
                                    </span>
                                    <span className="text-[10px] font-black uppercase">
                                        {method === 'cash' ? 'EFECTIVO' : method === 'transfer' ? 'TRANSF.' : 'MIXTO'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {paymentMethod === 'mixed' && (
                        <div className="grid grid-cols-2 gap-4 animate-slide-in bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <Input
                                label="Efectivo"
                                type="number"
                                placeholder="0"
                                value={cashAmount}
                                onChange={(e) => setCashAmount(e.target.value)}
                            />
                            <Input
                                label="Transferencia"
                                type="number"
                                placeholder="0"
                                value={transferAmount}
                                onChange={(e) => setTransferAmount(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="pt-2 flex gap-3">
                        <Button variant="outline" className="flex-1" onClick={() => setIsCheckoutModalOpen(false)}>Cancelar</Button>
                        <Button
                            className="flex-1 shadow-lg shadow-manevo-teal/20"
                            onClick={handleCheckout}
                            disabled={processing || (paymentMethod === 'mixed' && (!cashAmount || !transferAmount))}
                        >
                            {processing ? 'Registrando...' : 'Finalizar Registro'}
                        </Button>
                    </div>
                    <p className="text-[10px] text-center text-slate-400 font-medium italic">
                        El sistema distribuirá automáticamente los montos para auditoría de caja.
                    </p>
                </div>
            </Modal>
        </div>
    );
}
