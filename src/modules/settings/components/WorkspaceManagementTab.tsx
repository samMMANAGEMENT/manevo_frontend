import { useState, useEffect } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';
import entityService, { type Entity } from '../services/entityService';
import { useToast } from '../../../shared/providers/ToastProvider';

export default function WorkspaceManagementTab() {
    const { showToast } = useToast();
    const [entity, setEntity] = useState<Entity | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadEntity();
    }, []);

    const loadEntity = async () => {
        try {
            setLoading(true);
            const data = await entityService.getMyEntity();
            setEntity(data);
        } catch (error) {
            console.error('Error cargando workspace:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!entity) return;

        try {
            setSaving(true);
            await entityService.updateEntity(entity.id, {
                name: entity.name,
                description: entity.description
            });
            showToast('Información del workspace actualizada correctamente', 'success');
        } catch (error) {
            console.error('Error actualizando workspace:', error);
            showToast('Error al actualizar la información del workspace', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-white p-12 rounded-4xl border border-slate-100 shadow-xl flex items-center justify-center animate-pulse">
                <div className="text-slate-400 font-bold text-lg uppercase tracking-widest">Sincronizando Workspace...</div>
            </div>
        );
    }

    return (
        <div className="bg-white p-12 rounded-4xl border border-slate-100 shadow-xl space-y-10 animate-fade-in relative overflow-hidden">
            {/* Gradient Accent */}
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-manevo-teal to-blue-500"></div>

            <div className="flex items-center gap-6">
                <div className="size-20 rounded-[28px] bg-manevo-teal/10 flex items-center justify-center text-manevo-teal border border-manevo-teal/20 shadow-inner">
                    <span className="material-symbols-outlined text-4xl">workspaces</span>
                </div>
                <div>
                    <h2 className="text-3xl font-black text-manevo-slate tracking-tight">Mi Workspace</h2>
                    <p className="text-slate-400 font-medium">Gestiona la identidad y descripción principal de tu entorno de trabajo.</p>
                </div>
            </div>

            <form onSubmit={handleSave} className="space-y-8 max-w-2xl">
                <div className="space-y-6">
                    <Input
                        label="Nombre del Workspace"
                        placeholder="Ej: Workspace de Samuel Pineda"
                        value={entity?.name || ''}
                        onChange={(e) => entity && setEntity({ ...entity, name: e.target.value })}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Descripción del Ambiente</label>
                        <textarea
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-manevo-slate min-h-[120px] focus:outline-none focus:ring-2 focus:ring-manevo-teal/20 transition-all resize-none"
                            placeholder="Contenido descriptivo del workspace..."
                            value={entity?.description || ''}
                            onChange={(e) => entity && setEntity({ ...entity, description: e.target.value })}
                        />
                    </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                    <Button
                        type="submit"
                        disabled={saving}
                        className="bg-manevo-slate text-white px-10 py-4 rounded-2xl font-black text-lg shadow-xl shadow-manevo-slate/20 hover:scale-[1.02] active:scale-95 transition-all w-full sm:w-auto"
                    >
                        {saving ? 'Guardando Workspace...' : 'GUARDAR CAMBIOS'}
                    </Button>

                    <div className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        <span className="material-symbols-outlined text-sm">info</span>
                        ID del ambiente: {entity?.id}
                    </div>
                </div>
            </form>
        </div>
    );
}
