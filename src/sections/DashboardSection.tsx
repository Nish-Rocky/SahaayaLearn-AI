import React from 'react';
import { DashboardPreview } from '../components/DashboardPreview.tsx';
import { BarChart2, Sparkles } from 'lucide-react';

export const DashboardSection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-brand-midnight border-t border-white/5" id="dashboard">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>LEARNER PROGRESS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            Progress that means{' '}
            <span className="text-gradient-cyan-blue">
              more than marks.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            True learning happens when students understand why they stumbled, conquer fear, and build enduring conceptual mastery.
          </p>
        </div>

        {/* Dashboard Preview Component */}
        <DashboardPreview />

      </div>
    </section>
  );
};
