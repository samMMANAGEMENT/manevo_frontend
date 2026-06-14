import { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import servicesModuleService from '../../services/services/servicesModuleService';
import type { MasterService } from '../../services/types/servicesType';
import { useToast } from '../../../shared/providers/ToastProvider';

export default function ServiceManagementTab() {
    const { showToast } = useToast();
    const [services, setServices] = useState<MasterService[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<Partial<MasterService> | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await servicesModuleService.getMasterServices();
            setServices(data);
        } catch (error) {
            console.error('Error cargando servicios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService?.name || !editingService?.price) return;

        try {
            setSaving(true);
            if (editingService.id) {
                await servicesModuleService.updateMasterService(editingService.id, editingService);
            } else {
                await servicesModuleService.createMasterService(editingService);
            }
            await loadServices();
            setIsModalOpen(false);
            setEditingService(null);
            showToast('Servicio guardado exitosamente', 'success');
        } catch (error) {
            console.error('Error guardando servicio:', error);
            showToast('Error al guardar el servicio', 'error');
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-black text-manevo-slate tracking-tight">Gestión de Servicios</h2>
                    <p className="text-slate-400 text-sm">Configura los servicios que ofrece tu establecimiento y sus comisiones.</p>
                </div>
                <Button
                    onClick={() => {
                        setEditingService({ name: '', price: 0, employee_percentage: 0 });
                        setIsModalOpen(true);
                    }}
                    className="bg-manevo-teal hover:bg-manevo-teal/90 text-manevo-slate font-bold rounded-2xl px-6"
                >
                    <span className="material-symbols-outlined mr-2">add</span>
                    Nuevo Servicio
                </Button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Nombre</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Precio Base</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">% Operario</th>
                            <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={4} className="px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                </tr>
                            ))
                        ) : services.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No hay servicios configurados</td>
                            </tr>
                        ) : services.map(service => (
                            <tr key={service.id} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="size-8 rounded-xl bg-manevo-teal/10 flex items-center justify-center text-manevo-teal">
                                            <span className="material-symbols-outlined text-[18px]">construction</span>
                                        </div>
                                        <span className="font-bold text-manevo-slate uppercase tracking-tight">{service.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-black text-manevo-slate">{formatCurrency(service.price)}</td>
                                <td className="px-6 py-4 font-bold text-manevo-teal">{service.employee_percentage}%</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => {
                                            setEditingService(service);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-slate-300 hover:text-manevo-teal transition-colors outline-none cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined">edit</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingService?.id ? "Editar Servicio" : "Crear Nuevo Servicio"}
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <Input
                        label="Nombre del Servicio"
                        placeholder="Ej: Lavado General"
                        value={editingService?.name || ''}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Precio Base (COP)"
                            type="number"
                            placeholder="0"
                            value={editingService?.price || ''}
                            onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                            required
                        />
                        <Input
                            label="% Pago Operario"
                            type="number"
                            placeholder="0"
                            value={editingService?.employee_percentage || ''}
                            onChange={(e) => setEditingService({ ...editingService, employee_percentage: parseFloat(e.target.value) })}
                            required
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)} type="button">Cancelar</Button>
                        <Button className="flex-1" type="submit" disabled={saving}>
                            {saving ? "Guardando..." : "Guardar Servicio"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
