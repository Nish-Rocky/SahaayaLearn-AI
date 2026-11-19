import React from 'react';
import { ArrowRight, Sparkles, Volume2, ShieldCheck, Heart } from 'lucide-react';

export const FinalCTASection: React.FC = () => {
  const scrollToDemo = () => {
    const el = document.getElementById('voice-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative py-28 sm:py-36 bg-brand-midnight overflow-hidden border-t border-white/5">
      {/* Background Animated Energy Nodes / Glowing Mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] bg-gradient-to-tr from-brand-cyan/15 via-brand-blue/10 to-brand-violet/15 rounded-full blur-[160px] animate-pulse-glow" />
      </div>

      {/* Decorative Network Grid Particles SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1.5" fill="#24C8F4" />
              <path d="M 0 30 L 60 30 M 30 0 L 30 60" stroke="rgba(36,200,244,0.15)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-deep/80 border border-brand-cyan/40 text-brand-cyan text-xs font-bold tracking-wider uppercase backdrop-blur-md mb-8 shadow-glow-cyan/20">
          <Sparkles className="w-4 h-4 text-brand-cyan" />
          <span>JOIN THE VOICE-FIRST LEARNING REVOLUTION</span>
        </div>

        {/* Main Heading */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-white tracking-tight leading-[1.1] mb-6">
          Every learner deserves to be{' '}
          <span className="text-gradient-cyan-blue underline decoration-brand-cyan/30 decoration-wavy underline-offset-8">
            understood.
          </span>
        </h2>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-brand-muted max-w-2xl mx-auto leading-relaxed mb-10">
          Your questions matter. Your language matters. Your learning journey matters.
        </p>

        {/* Primary Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <a
            href="/student/register"
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet text-brand-midnight font-extrabold text-base tracking-wide shadow-glow-cyan hover:shadow-glow-blue transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
          >
            <span>Create Your Free Account</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="/student/dashboard"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-brand-surface border border-brand-cyan/40 hover:border-brand-cyan text-brand-white font-bold text-sm transition-all"
          >
            <span>Launch Student Workspace</span>
          </a>
        </div>

        {/* Supporting Tagline */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-brand-cyan uppercase">
            SahaayaLearn — Your voice. Your language. Your future.
          </p>
          <span className="text-xs text-brand-dim">
            Designed for Classes 6–10 • Multilingual & Textbook-Grounded
          </span>
        </div>

      </div>
    </section>
  );
};
