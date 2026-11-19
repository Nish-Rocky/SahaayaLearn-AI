import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' | 'cyan' | 'surface';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      icon,
      iconPosition = 'left',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-cyan/40 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

    const variantClasses = {
      primary:
        'bg-brand-blue hover:bg-blue-600 text-white shadow-md hover:shadow-brand-blue/30',
      cyan:
        'bg-brand-cyan text-brand-midnight font-semibold hover:bg-cyan-300 shadow-glow-cyan hover:shadow-lg',
      secondary:
        'bg-brand-surface border border-brand-border text-brand-white hover:bg-brand-surfaceCard hover:border-brand-cyan/40',
      surface:
        'bg-brand-surfaceCard hover:bg-brand-surfaceElevated text-brand-white border border-brand-borderSubtle',
      ghost:
        'bg-transparent text-brand-muted hover:text-brand-white hover:bg-white/5',
      outline:
        'bg-transparent border border-brand-border text-brand-cyan hover:bg-brand-cyan/10',
      danger:
        'bg-red-600/90 hover:bg-red-600 text-white shadow-sm',
    };

    const sizeClasses = {
      xs: 'px-2.5 py-1 text-xs gap-1.5',
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-4 py-2 text-sm gap-2',
      lg: 'px-6 py-2.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={twMerge(clsx(baseClasses, variantClasses[variant], sizeClasses[size], className))}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
        )}
        {children}
        {!loading && icon && iconPosition === 'right' && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
