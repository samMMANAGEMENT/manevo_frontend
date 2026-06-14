import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
    return (
        <div className="w-full space-y-2">
            {label && <label className="block text-sm font-bold text-manevo-slate" htmlFor={props.id}>{label}</label>}
            <div className="relative">
                <input
                    autoComplete='off'
                    className={`w-full px-4 py-3 rounded-xl border text-black border-gray-200 outline-none transition-all placeholder:text-gray-400 ${icon ? 'pr-10' : ''} ${className}`}
                    {...props}
                />
                {icon && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </div>
    );
};
