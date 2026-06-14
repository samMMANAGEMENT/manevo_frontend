import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => {
    return (
        <div className="flex items-center gap-2 py-1">
            <input
                type="checkbox"
                className={`w-4 h-4 text-manevo-teal border-gray-300 rounded transition-all ${className}`}
                {...props}
            />
            {label && (
                <label htmlFor={props.id} className="text-sm text-gray-500 font-medium select-none cursor-pointer">
                    {label}
                </label>
            )}
        </div>
    );
};
