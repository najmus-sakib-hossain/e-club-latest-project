import React from 'react';

export const CustomButton = ({
    children,
    className = '',
    variant = 'primary',
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'outline';
}) => {
    const baseStyle =
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-transform active:scale-95 duration-200';
    const variants = {
        primary:
            'bg-[#006838] text-white hover:bg-[#00522c] shadow-lg shadow-green-900/20',
        secondary:
            'bg-[#e63946] text-white hover:bg-[#d62839] shadow-lg shadow-red-900/20',
        outline: 'border-2 border-[#006838] text-[#006838] hover:bg-green-50',
    };

    return (
        <button
            className={`${baseStyle} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
