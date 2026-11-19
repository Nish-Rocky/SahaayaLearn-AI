import React from 'react';
import { Languages, HelpCircle, AlertTriangle, Smartphone, Sparkles } from 'lucide-react';

interface ProblemCard {
  number: string;
  category: string;
  title: string;
  description: string;
  icon: React.ElementType;
  accent: string;
  visual: React.ReactNode;
}

export const ProblemSection: React.FC = () => {
  const problems: ProblemCard[] = [
    {
      number: '01',
      category: 'LANGUAGE BARRIERS',
      title: 'Lost in translation.',
      description: 'Students often encounter academic concepts in languages that are different from the ones they understand most comfortably.',
      icon: Languages,
      accent: 'from-brand-cyan/20 to-brand-blue/20',
      visual: (
        <div className="w-full h-24 rounded-xl bg-brand-surface/60 border border-white/5 p-3 flex items-center justify-between gap-2 overflow-hidden relative">
          <div className="flex flex-col gap-1 z-10">
            <span className="text-[11px] font-mono text-brand-dim uppercase tracking-wider">Home Language</span>
            <span className="text-xs font-semibold text-brand-white bg-brand-deep/80 px-2 py-1 rounded border border-brand-cyan/30">
              ಭಿನ್ನರಾಶಿಗಳು (Fractions)
            </span>
          </div>
          <div className="h-0.5 flex-1 bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-cyan/20 relative mx-2">
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
          </div>
          <div className="flex flex-col gap-1 items-end z-10">
            <span className="text-[11px] font-mono text-brand-dim uppercase tracking-wider">Exam Syllabus</span>
            <span className="text-xs font-semibold text-brand-muted bg-brand-deep/80 px-2 py-1 rounded border border-white/10">
              Fractions & Numerator
            </span>
          </div>
        </div>
      ),
    },
    {
      number: '02',
      category: 'LIMITED PERSONAL GUIDANCE',
      title: 'Questions deserve answers.',
      description: 'Students may not always have a personal tutor available when they get stuck on a difficult concept.',
      icon: HelpCircle,
      accent: 'from-brand-blue/20 to-brand-violet/20',
      visual: (
        <div className="w-full h-24 rounded-xl bg-brand-surface/60 border border-white/5 p-3 flex items-center justify-around gap-2 relative overflow-hidden">
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-brand-deep border border-brand-amber/40 flex items-center justify-center text-xs font-bold text-brand-amber">
              ?
            </div>
            <span className="text-[10px] text-brand-dim">Student Stuck</span>
          </div>
          <div className="w-16 h-px border-t border-dashed border-white/20" />
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan flex items-center justify-center text-xs font-bold text-brand-cyan shadow-glow-cyan/40">
              24/7
            </div>
            <span className="text-[10px] text-brand-cyan">Sahaaya Companion</span>
          </div>
        </div>
      ),
    },
    {
      number: '03',
      category: 'HIDDEN LEARNING GAPS',
      title: "Marks don't tell the whole story.",
      description: 'Getting an answer wrong is only the beginning. Understanding why it happened is what improves learning.',
      icon: AlertTriangle,
      accent: 'from-brand-amber/20 to-brand-violet/20',
      visual: (
        <div className="w-full h-24 rounded-xl bg-brand-surface/60 border border-white/5 p-3 flex items-center justify-between gap-3 relative overflow-hidden">
          <div className="flex-1 bg-red-950/30 border border-red-500/30 rounded-lg p-2 text-center">
            <span className="text-[10px] uppercase font-bold text-red-400 block">Wrong Answer</span>
            <span className="text-xs text-brand-dim line-through">1/3 + 1/3 = 2/6</span>
          </div>
          <div className="text-brand-cyan text-xs font-bold">➔</div>
          <div className="flex-1 bg-emerald-950/30 border border-brand-cyan/40 rounded-lg p-2 text-center">
            <span className="text-[10px] uppercase font-bold text-brand-cyan block">Root Misconception</span>
            <span className="text-xs text-brand-white font-medium">Added denominators</span>
          </div>
        </div>
      ),
    },
    {
      number: '04',
      category: 'DEVICE AND ACCESS GAPS',
      title: 'Learning should be accessible.',
      description: 'Shared smartphones, connectivity limitations and complicated interfaces can create barriers to independent learning.',
      icon: Smartphone,
      accent: 'from-brand-violet/20 to-brand-cyan/20',
      visual: (
        <div className="w-full h-24 rounded-xl bg-brand-surface/60 border border-white/5 p-3 flex items-center justify-between gap-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="w-7 h-10 rounded-md border border-brand-cyan/40 bg-brand-deep flex items-center justify-center">
              <div className="w-4 h-6 rounded-sm bg-brand-cyan/20" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-brand-white">1 Phone</span>
              <span className="text-[10px] text-brand-dim">2-3 Siblings</span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-md bg-brand-deep/80 border border-brand-cyan/30 text-[10px] text-brand-cyan font-mono">
            Isolated Profiles • Offline Pods
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-brand-deep/90 border-t border-white/5" id="approach">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-brand-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-brand-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Educational Challenge</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            Learning should never be{' '}
            <span className="text-gradient-cyan-blue">
              limited by language.
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Millions of learners have the curiosity to learn, but the support they need is not always available in a language or format that works for them.
          </p>
        </div>

        {/* 4 Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {problems.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.number}
                className="group relative rounded-2xl bg-brand-surface/70 border border-white/10 p-7 sm:p-8 backdrop-blur-xl transition-all duration-300 hover:border-brand-cyan/30 hover:bg-brand-surface hover:shadow-glow-cyan/10 hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
              >
                {/* Subtle top corner gradient highlight */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${card.accent} blur-2xl group-hover:scale-125 transition-transform duration-500 pointer-events-none`} />

                <div>
                  {/* Top card bar with number and icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs font-bold tracking-wider text-brand-dim uppercase px-2.5 py-1 rounded-md bg-brand-midnight/60 border border-white/5">
                      CARD {card.number} — {card.category}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-brand-deep border border-brand-cyan/20 flex items-center justify-center text-brand-cyan group-hover:border-brand-cyan/60 group-hover:shadow-glow-cyan/30 transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Card Title */}
                  <h3 className="text-xl sm:text-2xl font-bold text-brand-white mb-3 tracking-tight group-hover:text-brand-white transition-colors">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                {/* Supporting Interactive CSS Visualization */}
                <div className="mt-2 pt-4 border-t border-white/5">
                  {card.visual}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
