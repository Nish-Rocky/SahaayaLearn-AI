import React from 'react';
import { LearningCycle } from '../components/LearningCycle.tsx';
import { Sparkles } from 'lucide-react';

export const SolutionSection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-brand-midnight border-t border-white/5" id="solution">
      {/* Ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-violet/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-brand-cyan/30 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>MEET YOUR LEARNING COMPANION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            Not another chatbot.<br />
            <span className="text-gradient-cyan-blue">
              A tutor that understands how you learn.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            SahaayaLearn transforms learning into a natural voice conversation. It listens to your questions, understands your difficulties and adapts its explanations to help you learn independently.
          </p>
        </div>

        {/* 5-Stage Learning Cycle Interactive Diagram */}
        <LearningCycle />

      </div>
    </section>
  );
};
