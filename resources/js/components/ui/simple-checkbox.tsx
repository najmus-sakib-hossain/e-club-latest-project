import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

export const Checkbox = ({ label, className = '', ...props }: CheckboxProps) => (
  <label className={`group flex cursor-pointer items-center gap-3 select-none ${className}`}>
    <div className="relative flex items-center justify-center">
      <input type="checkbox" className="peer sr-only" {...props} />
      <div className="h-5 w-5 rounded border-2 border-gray-300 bg-white transition-all peer-checked:border-[#105D42] peer-checked:bg-[#105D42]"></div>
      <Check className="absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
    </div>
    <span className="text-sm text-gray-600 transition-colors group-hover:text-gray-900">
      {label}
    </span>
  </label>
);
