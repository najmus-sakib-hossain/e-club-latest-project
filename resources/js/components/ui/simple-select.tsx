import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: string[];
  error?: string;
}

export const Select = ({ label, options, error, className = '', ...props }: SelectProps) => (
  <div className="w-full space-y-1.5">
    {label && (
      <label className="text-sm font-medium text-gray-700">
        {label}{' '}
        {props.required && <span className="text-red-500">*</span>}
      </label>
    )}
    <div className="relative">
      <select
        className={`w-full cursor-pointer appearance-none rounded-lg border border-gray-200 bg-white py-3 pr-10 pl-3 text-gray-700 transition-all outline-none focus:border-[#105D42] focus:ring-2 focus:ring-[#105D42]/20 ${className}`}
        {...props}
      >
        <option value="" disabled>
          Select {label}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);
