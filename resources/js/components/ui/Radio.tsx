import React from 'react';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const Radio = ({ label, className = '', checked, ...props }: RadioProps) => (
    <label
        className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 transition-all ${checked ? 'border-[#105D42] bg-green-50 text-[#105D42]' : 'border-gray-200 text-gray-600 hover:border-gray-300'} ${className}`}
    >
        <div className="relative flex items-center justify-center">
            <input
                type="radio"
                checked={checked}
                className="sr-only"
                {...props}
            />
            <div
                className={`h-4 w-4 rounded-full border ${checked ? 'border-[#105D42]' : 'border-gray-300'} flex items-center justify-center`}
            >
                {checked && (
                    <div className="h-2 w-2 rounded-full bg-[#105D42]" />
                )}
            </div>
        </div>
        <span className="text-sm font-medium">{label}</span>
    </label>
);
