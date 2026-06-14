import { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import { Modal } from '../../../shared/components/ui/Modal';
import { Select } from '../../../shared/components/ui/Select';
import userManagementService, { type User, type Role } from '../services/userManagementService';

export default function UserManagementTab() {
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        id: undefined as number | undefined,
        name: '',
        email: '',
        password: '',
        role: '',
        type_document: 'CC',
        document: '',
        mobile: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [usersData, rolesData] = await Promise.all([
                userManagementService.getUsers(),
                userManagementService.getRoles()
            ]);
            setUsers(usersData);
            setRoles(rolesData);
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (user: User) => {
        setFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '', // Empty password means no change
            role: user.roles?.[0]?.name || '',
            type_document: user.operator?.type_document || 'CC',
            document: user.operator?.document || '',
            mobile: user.operator?.mobile || ''
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await userManagementService.saveUser(formData);
            await loadData();
            setIsModalOpen(false);
        } catch (error: any) {
            console.error('Error guardando usuario:', error);
            alert(error.response?.data?.message || 'Error al guardar el usuario');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-black text-manevo-slate tracking-tight">Usuarios y Accesos</h2>
                    <p className="text-slate-400 text-xs md:text-sm font-medium">Gestiona quiénes pueden entrar al sistema y sus permisos.</p>
                </div>
                <Button
                    onClick={() => {
                        setFormData({
                            id: undefined,
                            name: '',
                            email: '',
                            password: '',
                            role: roles[0]?.name || '',
                            type_document: 'CC',
                            document: '',
                            mobile: ''
                        });
                        setIsModalOpen(true);
                    }}
                    className="w-full sm:w-auto bg-manevo-teal hover:bg-manevo-teal/90 text-manevo-slate font-bold rounded-2xl px-4 md:px-6 text-sm"
                >
                    <span className="material-symbols-outlined mr-2 text-[20px]">person_add</span>
                    Nuevo Usuario
                </Button>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[600px] md:min-w-0">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Usuario</th>
                                <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Documento</th>
                                <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Rol</th>
                                <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400">Contacto</th>
                                <th className="px-4 md:px-6 py-4 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-4 md:px-6 py-8"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                                    </tr>
                                ))
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 md:px-6 py-12 text-center text-slate-400 font-medium italic text-sm">No hay usuarios registrados</td>
                                </tr>
                            ) : users.map(user => (
                                <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="size-8 md:size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-manevo-teal/10 group-hover:text-manevo-teal transition-all">
                                                <span className="material-symbols-outlined text-[18px] md:text-[20px]">person</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-manevo-slate uppercase tracking-tight text-[12px] md:text-sm truncate">{user.name}</p>
                                                <p className="text-[10px] md:text-[11px] text-slate-400 font-medium truncate">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                        <p className="text-[11px] md:text-xs font-black text-manevo-slate">
                                            {user.operator?.type_document} {user.operator?.document || 'N/A'}
                                        </p>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4">
                                        <span className="px-2 md:px-3 py-0.5 md:py-1 bg-slate-100 text-slate-500 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest group-hover:bg-manevo-teal/10 group-hover:text-manevo-teal transition-colors whitespace-nowrap">
                                            {user.roles?.[0]?.name || 'Sin Rol'}
                                        </span>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                                        <p className="text-[11px] md:text-xs font-bold text-slate-400">{user.operator?.mobile || 'N/A'}</p>
                                    </td>
                                    <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="size-7 md:size-8 rounded-lg text-slate-300 hover:text-manevo-teal hover:bg-manevo-teal/5 transition-all outline-none"
                                        >
                                            <span className="material-symbols-outlined text-[18px] md:text-[20px]">edit</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={formData.id ? "Editar Usuario" : "Crear Nuevo Usuario"}
            >
                <form onSubmit={handleSave} className="space-y-5 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Nombre Completo"
                            placeholder="Nombre del operario"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <div className="space-y-2">
                            <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Rol en el Sistema</label>
                            <Select
                                value={formData.role}
                                onChange={(val) => setFormData({ ...formData, role: String(val) })}
                                placeholder="Seleccionar Rol"
                                options={roles.map(role => ({ value: role.name, label: role.name }))}
                                className="space-y-0 text-sm font-bold"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            placeholder="email@ejemplo.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                        <Input
                            label={formData.id ? "Nueva Contraseña (Opcional)" : "Contraseña"}
                            type="password"
                            placeholder="******"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!formData.id}
                        />
                    </div>

                    <div className="bg-slate-50 p-4 md:p-6 rounded-2xl md:rounded-3xl space-y-4 border border-slate-100">
                        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Datos de Operador</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-2 col-span-1">
                                <label className="text-[9px] md:text-[10px] font-black text-slate-400 pl-1 uppercase">Tipo Doc</label>
                                <Select
                                    value={formData.type_document}
                                    onChange={(val) => setFormData({ ...formData, type_document: String(val) })}
                                    options={[
                                        { value: 'CC', label: 'CC' },
                                        { value: 'CE', label: 'CE' },
                                        { value: 'NIT', label: 'NIT' }
                                    ]}
                                    className="space-y-0 text-xs font-bold"
                                />
                            </div>
                            <div className="col-span-2">
                                <Input
                                    label="Número de Documento"
                                    placeholder="12345678"
                                    value={formData.document}
                                    onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <Input
                            label="Teléfono Móvil"
                            placeholder="321 000 0000"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1 text-sm" onClick={() => setIsModalOpen(false)} type="button">Cancelar</Button>
                        <Button className="flex-1 shadow-lg shadow-manevo-teal/20 text-sm" type="submit" disabled={saving}>
                            {saving ? "Guardando..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
