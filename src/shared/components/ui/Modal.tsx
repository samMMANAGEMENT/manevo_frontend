import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            // Bloquear el scroll del body cuando el modal está abierto
            document.body.style.overflow = 'hidden';
        }

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const modalContent = (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in pointer-events-auto">
            {/* Backdrop click area */}
            <div className="absolute inset-0 z-0" onClick={onClose}></div>

            <div
                className="bg-white rounded-[24px] md:rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] w-full max-w-md overflow-hidden animate-scale-in relative z-10 border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 md:px-8 py-4 md:py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg md:text-xl font-black text-manevo-slate tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-1.5 md:p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg md:rounded-xl transition-all"
                    >
                        <span className="material-symbols-outlined text-[18px] md:text-[20px]">close</span>
                    </button>
                </div>
                <div className="p-5 md:p-8">
                    {children}
                </div>
            </div>
        </div>
    );

    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return modalContent; // Fallback if modal-root is not found

    return createPortal(modalContent, modalRoot);
};
