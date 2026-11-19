import React, { useRef, useMemo } from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress.ts';
import { useFrameSequence } from '../hooks/useFrameSequence.ts';
import { useReducedMotion } from '../hooks/useReducedMotion.ts';
import { ScrollFrameCanvas } from './ScrollFrameCanvas.tsx';
import { Sparkles, ArrowRight, Play, Volume2, Globe, Cpu, ShieldCheck } from 'lucide-react';

const STORY_PHASES = [
  {
    range: [0.0, 0.20],
    tag: 'PHASE 01',
    heading: 'Your voice is the beginning.',
    description: 'Speak in Kannada, Hindi, or your mother tongue. The companion listens without judgment.',
    icon: Volume2,
  },
  {
    range: [0.20, 0.40],
    tag: 'PHASE 02',
    heading: 'Understanding every language.',
    description: 'Acoustic nuances and dialect nuances mapped to deep conceptual comprehension.',
    icon: Globe,
  },
  {
    range: [0.40, 0.60],
    tag: 'PHASE 03',
    heading: 'Turning questions into knowledge.',
    description: 'Textbook-grounded knowledge graphs crystallise raw questions into structured clarity.',
    icon: Cpu,
  },
  {
    range: [0.60, 0.80],
    tag: 'PHASE 04',
    heading: 'Learning that adapts to you.',
    description: 'Dynamic pacing, contextual analogies, and real-time misconception detection.',
    icon: Sparkles,
  },
  {
    range: [0.80, 1.00],
    tag: 'PHASE 05',
    heading: 'Confidence begins with understanding.',
    description: 'From spoken doubt to academic mastery. Bridging home language to exam success.',
    icon: ShieldCheck,
  },
];

export const HeroScrollExperience: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { progress, isVisible } = useScrollProgress(containerRef);
  const {
    totalFrames,
    loadedCount,
    loadProgress,
    getFrame,
    prefetchRange,
  } = useFrameSequence({ autoBackgroundLoad: true, concurrency: 5 });

  // Map progress [0, 1] to frame [1, totalFrames]
  const currentFrameIndex = useMemo(() => {
    const rawIndex = Math.round(progress * (totalFrames - 1)) + 1;
    return Math.max(1, Math.min(totalFrames, rawIndex));
  }, [progress, totalFrames]);

  // Determine active storytelling phase
  const activePhase = useMemo(() => {
    const found = STORY_PHASES.find(
      (phase) => progress >= phase.range[0] && progress <= phase.range[1]
    );
    return found || STORY_PHASES[0];
  }, [progress]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-[360vh] bg-brand-midnight"
      id="hero"
    >
      {/* Sticky Fullscreen 100svh Viewport */}
      <div className="sticky top-0 w-full h-screen h-[100svh] overflow-hidden flex flex-col justify-between">
        
        {/* Full-bleed Canvas Background */}
        <div className="absolute inset-0 z-0">
          <ScrollFrameCanvas
            currentFrameIndex={currentFrameIndex}
            getFrame={getFrame}
            prefetchRange={prefetchRange}
            isVisible={isVisible}
            prefersReducedMotion={prefersReducedMotion}
          />
        </div>

        {/* Ambient Radial Lighting on Canvas */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] bg-brand-violet/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Hero Content Overlay Layer */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between pt-24 sm:pt-28 pb-8 pointer-events-none">
          
          {/* Top/Middle Left: Headline, Badge, Description, CTAs */}
          <div className="max-w-2xl mt-4 sm:mt-8 pointer-events-auto">
            {/* Introductory Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-deep/80 border border-brand-border text-brand-cyan text-xs font-semibold tracking-wider uppercase backdrop-blur-md mb-5 shadow-glow-cyan/20">
              <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
              <span>THE FUTURE OF PERSONAL LEARNING</span>
            </div>

            {/* Confident Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-white leading-[1.08] mb-6">
              Learning that{' '}
              <span className="text-gradient-cyan-blue underline decoration-brand-cyan/40 decoration-wavy decoration-2 underline-offset-8">
                listens
              </span>
              .<br />
              Teaching that{' '}
              <span className="text-brand-white">
                understands.
              </span>
            </h1>

            {/* Supporting Description */}
            <p className="text-base sm:text-lg lg:text-xl text-brand-muted font-normal leading-relaxed mb-8 max-w-xl">
              Meet your multilingual AI learning companion. Ask questions in your language, understand every concept and learn with confidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <a
                href="/student/dashboard"
                className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet text-brand-midnight font-bold text-sm tracking-wide shadow-glow-cyan hover:shadow-glow-blue transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Launch Student Workspace</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </a>

              <a
                href="/login"
                className="group inline-flex items-center gap-2.5 px-5 py-3.5 rounded-xl bg-brand-surface/70 hover:bg-brand-surface border border-brand-cyan/30 hover:border-brand-cyan text-brand-white text-sm font-medium backdrop-blur-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-brand-cyan" />
                <span>Select Portal / Sign In</span>
              </a>

              <button
                onClick={() => scrollToSection('voice-demo')}
                className="group inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-brand-dim hover:text-brand-white text-xs font-medium transition-colors"
              >
                <span>Try Voice Demo ↓</span>
              </button>
            </div>

            {/* Subtle supporting line */}
            <p className="text-xs sm:text-sm text-brand-dim font-medium tracking-wide">
              Your voice. Your language. Your future.
            </p>
          </div>

          {/* Bottom Bar: Synchronised Storytelling Microcopy & Scroll / Frame Status */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pointer-events-auto pt-4 border-t border-white/5">
            
            {/* Storytelling Phase Card (Fades dynamically as user scrubs) */}
            <div className="bg-brand-deep/85 border border-brand-cyan/25 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-glass max-w-md w-full transition-all duration-500 transform">
              <div className="flex items-center gap-2 text-brand-cyan text-xs font-bold tracking-widest uppercase mb-1.5">
                <activePhase.icon className="w-3.5 h-3.5" />
                <span>{activePhase.tag}</span>
                <span className="text-brand-dim">•</span>
                <span className="text-brand-muted">Scroll Story</span>
              </div>
              <h4 className="text-base sm:text-lg font-bold text-brand-white transition-opacity duration-300">
                {activePhase.heading}
              </h4>
              <p className="text-xs sm:text-sm text-brand-muted mt-1 leading-relaxed">
                {activePhase.description}
              </p>
            </div>

            {/* Right: Interactive Frame Scrubber Status & Scroll Cue */}
            <div className="flex items-center gap-4 self-end md:self-auto">
              {/* Progress & Frame Counter Badge */}
              <div className="bg-brand-deep/80 border border-white/10 rounded-xl px-4 py-2.5 backdrop-blur-md flex items-center gap-3">
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold tracking-wider text-brand-dim uppercase">
                    3D Neural Scrub
                  </span>
                  <span className="text-xs font-mono font-bold text-brand-cyan">
                    Frame {currentFrameIndex} / {totalFrames}
                  </span>
                </div>
                
                {/* Visual Progress Arc or Bar */}
                <div className="w-16 h-1.5 bg-brand-surface rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-brand-cyan to-brand-violet transition-all duration-100 ease-out"
                    style={{ width: `${Math.round(progress * 100)}%` }}
                  />
                </div>
              </div>

              {/* Scroll Indicator Icon */}
              <div className="hidden sm:flex flex-col items-center gap-1.5 text-brand-dim">
                <div className="w-5 h-9 rounded-full border-2 border-brand-cyan/40 flex items-start justify-center p-1">
                  <div className="w-1 h-2 rounded-full bg-brand-cyan animate-bounce" />
                </div>
                <span className="text-[10px] uppercase tracking-wider font-semibold">
                  Scroll
                </span>
              </div>
            </div>

          </div>

        </div>

        {/* Minimalist Top Edge Loading Progress Bar (fades out when fully cached) */}
        {loadProgress < 1 && (
          <div className="absolute top-0 left-0 right-0 h-1 bg-brand-surface/40 z-50">
            <div 
              className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue transition-all duration-300"
              style={{ width: `${Math.round(loadProgress * 100)}%` }}
              title={`Preloading frames: ${loadedCount}/${totalFrames}`}
            />
          </div>
        )}

      </div>
    </div>
  );
};
