import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { useToast } from '../../providers/ToastProvider';
import { useCan } from '../../hooks/useCan';
import entityService, { type Entity } from '../../../modules/settings/services/entityService';
import { Select } from '../ui/Select';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import feedbackService from '../../services/feedbackService';

interface HeaderProps {
    onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const location = useLocation();
    const { user } = useAuth();
    const { can } = useCan();
    const { showToast } = useToast();
    
    const [entities, setEntities] = useState<Entity[]>([]);
    const [switching, setSwitching] = useState(false);

    // Feedback States
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [feedbackType, setFeedbackType] = useState<string | number>('Sugerencia');
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submittedSuccess, setSubmittedSuccess] = useState(false);

    const hasPermission = can('change.entity');

    useEffect(() => {
        if (hasPermission) {
            loadEntities();
        }
    }, [hasPermission]);

    const loadEntities = async () => {
        try {
            const data = await entityService.getEntities();
            setEntities(data);
        } catch (error) {
            console.error('Error cargando entidades:', error);
        }
    };

    const handleSelectChange = async (val: string | number) => {
        const newId = typeof val === 'number' ? val : parseInt(val);
        if (!newId || newId === user?.entity_id) return;

        try {
            setSwitching(true);
            const res = await entityService.switchEntity(newId);
            if (res && res.user) {
                const currentUser = localStorage.getItem('user');
                if (currentUser) {
                    const parsed = JSON.parse(currentUser);
                    localStorage.setItem('user', JSON.stringify({ ...parsed, ...res.user }));
                } else {
                    localStorage.setItem('user', JSON.stringify(res.user));
                }
            }
            // Safe window reload to reset the React context cleanly under the new tenant
            window.location.reload();
        } catch (error) {
            console.error('Error al cambiar de entidad:', error);
            showToast('No se pudo cambiar de entidad de trabajo.', 'error');
        } finally {
            setSwitching(false);
        }
    };

    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!feedbackType || !rating || !message.trim()) return;

        try {
            setIsSubmitting(true);
            await feedbackService.sendFeedback({
                type: String(feedbackType),
                rating,
                message
            });
            setSubmittedSuccess(true);
            // Reset form
            setFeedbackType('Sugerencia');
            setRating(5);
            setMessage('');
        } catch (error) {
            console.error('Error al enviar feedback:', error);
            showToast('Hubo un error al enviar el comentario.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Get page title from path
    const getPageTitle = () => {
        const path = location.pathname.split('/').pop() || 'Dashboard';
        return path.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            <div className="flex items-center gap-2 md:gap-4">
                {/* Hamburger Menu for Mobile */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>

                <h1 className="text-lg md:text-xl font-extrabold text-manevo-slate tracking-tight truncate max-w-[150px] md:max-w-none">
                    {getPageTitle()}
                </h1>

                <div className="hidden sm:block h-4 w-px bg-gray-200"></div>

                {hasPermission ? (
                    <div className="hidden sm:flex items-center gap-2">
                        <Select
                            value={user?.entity_id || ''}
                            onChange={handleSelectChange}
                            disabled={switching}
                            options={entities.map(ent => ({ value: ent.id, label: ent.name }))}
                            className="w-44 text-xs"
                        />
                    </div>
                ) : (
                    <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">
                        <span className="material-symbols-outlined text-[16px] text-manevo-teal">verified</span>
                        <span className="hidden md:inline">Workspace Activo</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                {/* Search Bar - Hidden on Mobile */}
                <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 px-4 py-2 rounded-xl text-gray-400 hover:ring-2 hover:ring-manevo-teal/20 transition-all">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                    <input
                        type="text"
                        placeholder="Buscar..."
                        className="bg-transparent border-none outline-none text-sm text-manevo-slate font-medium placeholder:text-gray-400 w-32 xl:w-48"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 md:gap-3">
                    <button className="size-9 md:size-10 flex items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:bg-manevo-teal/10 hover:text-manevo-teal hover:border-manevo-teal/20 transition-all relative">
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">notifications</span>
                        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white"></span>
                    </button>

                    <button 
                        onClick={() => { setIsFeedbackOpen(true); setSubmittedSuccess(false); }}
                        className="hidden sm:flex size-9 md:size-10 items-center justify-center rounded-xl bg-gray-50 border border-gray-100 text-gray-500 hover:bg-manevo-teal/10 hover:text-manevo-teal hover:border-manevo-teal/20 transition-all cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">help</span>
                    </button>
                </div>
            </div>

            <Modal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                title="Enviar Comentarios y Sugerencias"
            >
                {submittedSuccess ? (
                    <div className="text-center py-6 space-y-4 animate-in fade-in zoom-in duration-300">
                        <div className="size-16 bg-manevo-teal/10 rounded-full flex items-center justify-center mx-auto text-manevo-teal">
                            <span className="material-symbols-outlined text-[36px] font-bold">check_circle</span>
                        </div>
                        <h3 className="text-xl font-bold text-manevo-slate">¡Gracias por tu aporte!</h3>
                        <p className="text-sm text-gray-500 leading-relaxed px-4">
                            Tus sugerencias e informes nos ayudan a perfeccionar Manevo diariamente para ofrecerte una experiencia excepcional.
                        </p>
                        <div className="pt-2">
                            <Button 
                                onClick={() => setIsFeedbackOpen(false)}
                                className="px-6 py-2.5 bg-manevo-teal hover:bg-manevo-teal/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-manevo-teal/20 transition-all cursor-pointer"
                            >
                                Entendido
                            </Button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-5 pt-2">
                        <p className="text-sm text-gray-500 leading-relaxed">
                            ¿Tienes alguna sugerencia de mejora, encontraste un problema o deseas felicitarnos? Escríbenos, te escuchamos.
                        </p>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-manevo-slate">Tipo de Comentario</label>
                            <Select
                                value={feedbackType}
                                onChange={(val) => setFeedbackType(val)}
                                options={[
                                    { value: 'Sugerencia', label: 'Sugerencia de Mejora' },
                                    { value: 'Error', label: 'Reportar un Problema / Error' },
                                    { value: 'Felicitacion', label: 'Felicitación / Comentario Positivo' },
                                    { value: 'Otro', label: 'Otro' }
                                ]}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-manevo-slate text-center">¿Cómo calificarías tu experiencia?</label>
                            <div className="flex justify-center gap-3 py-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="p-1 focus:outline-none transition-all active:scale-95 hover:scale-110 cursor-pointer"
                                    >
                                        <span 
                                            className={`material-symbols-outlined text-[32px] transition-all duration-200
                                                ${rating >= star ? 'text-amber-400 fill-amber-400 font-bold scale-105' : 'text-slate-200'}
                                            `}
                                            style={{ fontVariationSettings: rating >= star ? "'FILL' 1" : "'FILL' 0" }}
                                        >
                                            star
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-bold text-manevo-slate" htmlFor="feedback-message">Tu Mensaje</label>
                            <textarea
                                id="feedback-message"
                                rows={4}
                                required
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Describe detalladamente tus comentarios, sugerencias o el inconveniente detectado..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-black bg-white focus:ring-2 focus:ring-manevo-teal/20 focus:border-manevo-teal outline-none transition-all text-sm font-medium placeholder:text-gray-400 resize-none"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsFeedbackOpen(false)}
                                className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-manevo-slate bg-white hover:bg-slate-50 transition-all cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !message.trim()}
                                className="px-5 py-2.5 bg-manevo-teal hover:bg-manevo-teal/90 text-white rounded-xl font-bold text-sm shadow-lg shadow-manevo-teal/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        <span>Enviando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[18px]">send</span>
                                        <span>Enviar Comentarios</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </Modal>
        </header>
    );
}
