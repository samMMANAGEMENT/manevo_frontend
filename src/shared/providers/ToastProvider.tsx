import React, { createContext, useContext, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 4 seconds
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, [removeToast]);

    const getToastStyles = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'bg-emerald-50/90 border-emerald-100/90 text-emerald-600';
            case 'error':
                return 'bg-rose-50/90 border-rose-100/90 text-rose-600';
            case 'info':
            default:
                return 'bg-cyan-50/90 border-cyan-100/90 text-cyan-600';
        }
    };

    const getToastIcon = (type: ToastType) => {
        switch (type) {
            case 'success':
                return 'check_circle';
            case 'error':
                return 'error';
            case 'info':
            default:
                return 'info';
        }
    };

    const toastList = (
        <div className="fixed bottom-5 right-5 z-9999 space-y-3 max-w-sm w-full pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
                        flex items-center gap-3 px-4 py-3.5 rounded-2xl border shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-sm
                        animate-slide-up pointer-events-auto transition-all duration-300
                        ${getToastStyles(toast.type)}
                    `}
                >
                    <span className="material-symbols-outlined text-[20px] shrink-0">
                        {getToastIcon(toast.type)}
                    </span>
                    <p className="text-xs font-bold leading-relaxed">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="ml-auto text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[16px] font-black">close</span>
                    </button>
                </div>
            ))}
        </div>
    );

    const toastRoot = document.getElementById('toast-root') || document.body;

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toasts.length > 0 && createPortal(toastList, toastRoot)}
        </ToastContext.Provider>
    );
};
