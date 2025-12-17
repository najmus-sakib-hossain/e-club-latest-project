import React from 'react';

export interface JoinButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
}

export const JoinButton = ({
    children,
    variant = 'primary',
    className = '',
    ...props
}: JoinButtonProps) => {
    const baseStyle =
        'px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants = {
        primary:
            'bg-[#105D42] hover:bg-[#0d4a35] text-white shadow-md hover:shadow-lg',
        outline:
            'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
        ghost: 'text-[#105D42] hover:bg-green-50',
        secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
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
