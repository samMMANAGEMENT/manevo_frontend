import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    label?: string;
    value: string | number;
    options: SelectOption[];
    onChange: (value: string | number) => void;
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export const Select: React.FC<SelectProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder = 'Seleccione una opción',
    error,
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find(opt => opt.value === value);

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updateCoords();
            window.addEventListener('resize', updateCoords);
            window.addEventListener('scroll', updateCoords, true);
        }
        return () => {
            window.removeEventListener('resize', updateCoords);
            window.removeEventListener('scroll', updateCoords, true);
        };
    }, [isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInsideContainer = containerRef.current && containerRef.current.contains(event.target as Node);
            const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target as Node);
            if (!isClickInsideContainer && !isClickInsideDropdown) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (val: string | number) => {
        onChange(val);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={`w-full space-y-2 relative ${className}`}>
            {label && <label className="block text-sm font-bold text-manevo-slate">{label}</label>}
            
            <div className="relative">
                <button
                    ref={triggerRef}
                    type="button"
                    disabled={disabled}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-black bg-white transition-all text-left outline-none cursor-pointer select-none
                        ${error ? 'border-red-500 ring-2 ring-red-500/10' : 'border-gray-200 focus:ring-2 focus:ring-manevo-teal/20 focus:border-manevo-teal'}
                        ${disabled ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-gray-300'}
                    `}
                >
                    <span className={`text-sm ${selectedOption ? 'text-slate-900 font-medium' : 'text-gray-400'}`}>
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    <span className={`material-symbols-outlined text-[20px] text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </button>

                {isOpen && createPortal(
                    <div
                        ref={dropdownRef}
                        style={{
                            position: 'absolute',
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            width: `${coords.width}px`,
                            zIndex: 99999
                        }}
                        className="mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl max-h-60 overflow-y-auto py-1.5 animate-in fade-in slide-in-from-top-2 duration-250"
                    >
                        {options.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">No hay opciones disponibles</div>
                        ) : (
                            options.map(opt => {
                                const isSelected = opt.value === value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt.value)}
                                        className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center justify-between
                                            ${isSelected 
                                                ? 'bg-manevo-teal/10 text-manevo-teal font-extrabold' 
                                                : 'text-slate-700 hover:bg-slate-50 font-medium'
                                            }
                                        `}
                                    >
                                        <span>{opt.label}</span>
                                        {isSelected && (
                                            <span className="material-symbols-outlined text-[18px] text-manevo-teal">check</span>
                                        )}
                                    </button>
                                );
                            })
                        )}
                    </div>,
                    document.body
                )}
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
};
