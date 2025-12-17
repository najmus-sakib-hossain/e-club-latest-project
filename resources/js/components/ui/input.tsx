import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, className = '', ...props }, ref) => (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="flex items-center gap-1 text-sm font-medium text-gray-700">
          {label}{' '}
          {props.required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="group relative">
        {Icon && (
          <Icon className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#105D42]" />
        )}
        <input
          ref={ref}
          className={`w-full ${Icon ? 'pl-10' : 'pl-3'} rounded-lg border border-gray-200 bg-white py-2.5 pr-3 transition-all outline-none placeholder:text-gray-400 focus:border-[#105D42] focus:ring-2 focus:ring-[#105D42]/20 ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
