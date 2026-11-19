import React, { useState } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', label, error, hint, icon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-brand-muted tracking-wide">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 text-brand-dim pointer-events-none flex items-center">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={inputType}
            className={twMerge(
              clsx(
                'w-full bg-brand-surface/90 border border-brand-borderSubtle text-brand-white placeholder-brand-dim text-sm rounded-xl px-3.5 py-2.5 transition-all duration-200 focus:outline-none focus:border-brand-cyan/70 focus:ring-2 focus:ring-brand-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed',
                icon && 'pl-10',
                isPassword && 'pr-10',
                error && 'border-red-500/80 focus:border-red-500 focus:ring-red-500/20',
                className
              )
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-brand-dim hover:text-brand-white transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-brand-dim">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
