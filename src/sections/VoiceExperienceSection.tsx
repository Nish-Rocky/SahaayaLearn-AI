import React from 'react';
import { VoiceDemo } from '../components/VoiceDemo.tsx';
import { Volume2, Sparkles } from 'lucide-react';

export const VoiceExperienceSection: React.FC = () => {
  return (
    <section className="relative py-24 sm:py-32 bg-brand-deep/90 border-t border-white/5" id="voice-demo">
      {/* Background Lighting */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-brand-violet/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <Volume2 className="w-3.5 h-3.5" />
            <span>INTERACTIVE TUTOR PREVIEW</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            Just speak.{' '}
            <span className="text-gradient-cyan-blue">
              Start learning.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            No complicated forms. No difficult navigation. Simply ask, listen, practise and improve.
          </p>
        </div>

        {/* Live Interactive Voice Demo Component */}
        <VoiceDemo />

      </div>
    </section>
  );
};
