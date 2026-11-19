import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'pill' | 'underline' | 'cards';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  variant = 'pill',
}) => {
  if (variant === 'pill') {
    return (
      <div className={twMerge(clsx('flex items-center gap-1.5 p-1 bg-brand-surface border border-brand-borderSubtle rounded-xl', className))}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={clsx(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 select-none',
                isActive
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-white hover:bg-white/5'
              )}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={clsx(
                    'px-1.5 py-0.2 rounded-full text-[10px]',
                    isActive ? 'bg-white/20 text-white' : 'bg-brand-surfaceCard text-brand-muted'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={twMerge(clsx('flex items-center border-b border-brand-borderSubtle gap-6', className))}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 py-3 text-sm font-semibold border-b-2 -mb-px transition-all select-none',
              isActive
                ? 'border-brand-cyan text-brand-cyan'
                : 'border-transparent text-brand-muted hover:text-brand-white'
            )}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-brand-surfaceCard text-brand-muted">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
