import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'blue' | 'green' | 'amber' | 'red' | 'purple' | 'neutral';
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'cyan',
  size = 'md',
  dot = false,
  children,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full select-none';

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
  };

  const variantClasses = {
    cyan: 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30',
    blue: 'bg-brand-blue/15 text-blue-400 border border-brand-blue/30',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    red: 'bg-red-500/15 text-red-400 border border-red-500/30',
    purple: 'bg-brand-violet/15 text-brand-violet border border-brand-violet/30',
    neutral: 'bg-white/10 text-brand-muted border border-white/10',
  };

  const dotColor = {
    cyan: 'bg-brand-cyan',
    blue: 'bg-blue-400',
    green: 'bg-emerald-400',
    amber: 'bg-amber-400',
    red: 'bg-red-400',
    purple: 'bg-brand-violet',
    neutral: 'bg-brand-muted',
  };

  return (
    <span
      className={twMerge(clsx(baseClasses, sizeClasses[size], variantClasses[variant], className))}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor[variant]}`} />}
      {children}
    </span>
  );
};
