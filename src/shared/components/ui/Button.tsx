import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles = 'px-4 py-2.5 rounded-xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-manevo-teal text-manevo-slate shadow-lg shadow-manevo-teal/20 hover:shadow-manevo-teal/40 hover:brightness-105',
        secondary: 'bg-white/10 text-white border border-white/20 backdrop-blur-sm hover:bg-white/20',
        outline: 'border border-white/10 text-white hover:bg-white/5',
        ghost: 'text-gray-400 hover:text-white transition-colors',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
