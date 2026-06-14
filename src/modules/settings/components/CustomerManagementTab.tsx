import { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Select } from '../../../shared/components/ui/Select';
import customerService, { type Customer } from '../services/customerService';
import { useToast } from '../../../shared/providers/ToastProvider';

export default function CustomerManagementTab() {
    const { showToast } = useToast();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [formData, setFormData] = useState<Customer>({
        name: '',
        identification_type: 'CC',
        identification_number: '',
        dv: '',
        email: '',
        phone: '',
        address: '',
        municipality_id: 822,
        type_regime_id: 2,
        type_organization_id: 2
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.obtenerClientes();
            setCustomers(data);
        } catch (error) {
            console.error('Error cargando clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            if (editingId) {
                await customerService.modificarCliente(editingId, formData);
            } else {
                await customerService.guardarCliente(formData);
            }
            resetForm();
            loadCustomers();
            showToast(editingId ? 'Cliente actualizado' : 'Cliente creado', 'success');
        } catch (error: any) {
            showToast(error.response?.data?.message || 'Error al guardar cliente', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (customer: Customer) => {
        setFormData({ ...customer });
        setEditingId(customer.id || null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
        try {
            await customerService.eliminarCliente(id);
            loadCustomers();
            showToast('Cliente eliminado exitosamente', 'success');
        } catch (error) {
            showToast('Error al eliminar cliente', 'error');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            identification_type: 'CC',
            identification_number: '',
            dv: '',
            email: '',
            phone: '',
            address: '',
            municipality_id: 822,
            type_regime_id: 2,
            type_organization_id: 2
        });
        setEditingId(null);
    };

    if (loading && customers.length === 0) {
        return <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Cargando base de datos de clientes...</div>;
    }

    return (
        <div className="space-y-10 animate-fade-in">
            {/* Form Section */}
            <div className="bg-white p-10 rounded-4xl border border-slate-100 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-manevo-teal/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

                <div className="flex items-center gap-6 mb-10 relative z-10">
                    <div className="size-16 rounded-3xl bg-manevo-slate text-manevo-teal flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">{editingId ? 'edit' : 'person_add'}</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-manevo-slate tracking-tight">
                            {editingId ? 'Editar Cliente' : 'Nuevo Cliente'}
                        </h2>
                        <p className="text-slate-400 font-medium">Registra los datos para la facturación y contacto.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Nombre Completo / Razón Social"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <div className="grid grid-cols-4 gap-3">
                            <div className="col-span-1">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tipo</label>
                                <Select
                                    value={formData.identification_type}
                                    onChange={val => setFormData({ ...formData, identification_type: String(val) })}
                                    options={[
                                        { value: 'CC', label: 'CC' },
                                        { value: 'NIT', label: 'NIT' },
                                        { value: 'CE', label: 'CE' }
                                    ]}
                                    className="space-y-0 text-sm font-bold"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="Número Identificación"
                                    value={formData.identification_number}
                                    onChange={e => setFormData({ ...formData, identification_number: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-span-1">
                                <Input
                                    label="DV"
                                    value={formData.dv || ''}
                                    onChange={e => setFormData({ ...formData, dv: e.target.value })}
                                    maxLength={1}
                                    disabled={formData.identification_type !== 'NIT'}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            value={formData.email || ''}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label="Teléfono"
                            value={formData.phone || ''}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                        <Input
                            label="Dirección"
                            value={formData.address || ''}
                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                        />
                    </div>

                    <div className="flex justify-end gap-3">
                        {editingId && (
                            <Button type="button" variant="outline" onClick={resetForm} className="px-8">
                                Cancelar
                            </Button>
                        )}
                        <Button type="submit" disabled={saving} className="bg-manevo-slate text-white px-12 font-black shadow-xl shadow-manevo-slate/20">
                            {saving ? 'Guardando...' : (editingId ? 'ACTUALIZAR CLIENTE' : 'GUARDAR CLIENTE')}
                        </Button>
                    </div>
                </form>
            </div>

            {/* List Section */}
            <div className="bg-white p-10 rounded-4xl border border-slate-100 shadow-xl space-y-8">
                <div className="flex items-center gap-4 border-b border-slate-100 pb-4">
                    <span className="material-symbols-outlined text-manevo-teal">group</span>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Base de Datos de Clientes</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                                <th className="pb-4 pl-4">Identificación</th>
                                <th className="pb-4">Nombre / Razón Social</th>
                                <th className="pb-4">Contacto</th>
                                <th className="pb-4 text-right pr-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {customers.map(customer => (
                                <tr key={customer.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="py-5 pl-4">
                                        <div className="text-xs font-black text-manevo-slate">{customer.identification_number}</div>
                                        <div className="text-[10px] text-slate-400 font-bold">{customer.identification_type}</div>
                                    </td>
                                    <td className="py-5">
                                        <div className="text-sm font-black text-manevo-slate uppercase">{customer.name}</div>
                                    </td>
                                    <td className="py-5">
                                        <div className="text-xs font-medium text-slate-500">{customer.email || 'Sin correo'}</div>
                                        <div className="text-xs font-medium text-slate-400">{customer.phone || 'Sin teléfono'}</div>
                                    </td>
                                    <td className="py-5 text-right pr-4">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(customer)}
                                                className="size-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                            {customer.identification_number !== '2222' && (
                                                <button
                                                    onClick={() => handleDelete(customer.id!)}
                                                    className="size-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:scale-110 active:scale-90 transition-all cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
