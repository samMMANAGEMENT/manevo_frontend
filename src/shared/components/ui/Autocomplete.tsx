import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export interface AutocompleteOption {
    value: string | number;
    label: string;
}

interface AutocompleteProps {
    label?: string;
    value: string | number;
    options: AutocompleteOption[];
    onChange: (value: string | number) => void;
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
}

export const Autocomplete: React.FC<AutocompleteProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder = 'Buscar opción...',
    error,
    className = '',
    disabled = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLInputElement>(null);
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

    // Sync input text when value changes or mounts
    useEffect(() => {
        if (selectedOption) {
            setQuery(selectedOption.label);
        } else {
            setQuery('');
        }
    }, [value, selectedOption]);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const isClickInsideContainer = containerRef.current && containerRef.current.contains(event.target as Node);
            const isClickInsideDropdown = dropdownRef.current && dropdownRef.current.contains(event.target as Node);
            if (!isClickInsideContainer && !isClickInsideDropdown) {
                setIsOpen(false);
                // Reset input to current selected label if closed
                setQuery(selectedOption ? selectedOption.label : '');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [selectedOption]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setIsOpen(true);
    };

    const handleSelect = (opt: AutocompleteOption) => {
        onChange(opt.value);
        setQuery(opt.label);
        setIsOpen(false);
    };

    const handleFocus = () => {
        setIsOpen(true);
        // Clear input to let user see all options easily on click
        setQuery('');
    };

    // Filtered options based on search query
    const filteredOptions = query.trim() === ''
        ? options
        : options.filter(opt =>
            opt.label.toLowerCase().includes(query.toLowerCase())
        );

    return (
        <div ref={containerRef} className={`w-full space-y-2 relative ${className}`}>
            {label && <label className="block text-sm font-bold text-manevo-slate">{label}</label>}

            <div className="relative">
                <input
                    ref={triggerRef}
                    type="text"
                    disabled={disabled}
                    value={query}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    autoComplete="off"
                    className={`w-full px-4 py-3 rounded-xl border text-black bg-white transition-all text-left outline-none pr-10
                        ${error ? 'border-red-500 ring-2 ring-red-500/10' : 'border-gray-200 focus:ring-2 focus:ring-manevo-teal/20 focus:border-manevo-teal'}
                        ${disabled ? 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed' : 'hover:border-gray-300'}
                    `}
                />
                
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[20px] text-gray-400 select-none pointer-events-none">
                    search
                </span>

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
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-400 text-center">No se encontraron resultados</div>
                        ) : (
                            filteredOptions.map(opt => {
                                const isSelected = opt.value === value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => handleSelect(opt)}
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
