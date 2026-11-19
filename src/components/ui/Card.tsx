import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'bordered' | 'interactive';
  glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', glow = false, children, ...props }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-200';

    const variantClasses = {
      default: 'bg-brand-surface border border-brand-borderSubtle text-brand-white',
      elevated: 'bg-brand-surfaceCard border border-brand-borderSubtle text-brand-white shadow-xl',
      glass: 'bg-brand-surface/70 backdrop-blur-md border border-brand-border/40 text-brand-white',
      bordered: 'bg-transparent border border-brand-border text-brand-white',
      interactive:
        'bg-brand-surface border border-brand-borderSubtle hover:border-brand-cyan/40 hover:bg-brand-surfaceCard cursor-pointer text-brand-white hover:-translate-y-0.5 shadow-sm hover:shadow-glow-cyan/20',
    };

    const glowClass = glow ? 'shadow-glow-cyan border-brand-cyan/40' : '';

    return (
      <div
        ref={ref}
        className={twMerge(clsx(baseClasses, variantClasses[variant], glowClass, className))}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
