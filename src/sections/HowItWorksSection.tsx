import React, { useState } from 'react';
import { Mic, Cpu, Compass, HelpCircle, Trophy, Sparkles } from 'lucide-react';

interface StepItem {
  number: string;
  badge: string;
  title: string;
  description: string;
  icon: React.ElementType;
  visual: React.ReactNode;
}

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps: StepItem[] = [
    {
      number: '01',
      badge: 'STEP 01 — ASK',
      title: 'Speak naturally in your preferred language.',
      description: 'Learners ask questions simply by pressing the microphone or speaking naturally. No keyboards, no formal spellings required.',
      icon: Mic,
      visual: (
        <div className="w-full h-44 rounded-2xl bg-brand-deep/90 border border-brand-cyan/20 p-5 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="flex items-center gap-1.5 h-16 w-full justify-center max-w-xs">
            {[20, 45, 80, 50, 95, 30, 70, 100, 60, 85, 40, 90, 55, 30, 65].map((h, i) => (
              <div
                key={i}
                className="w-2 bg-gradient-to-t from-brand-cyan to-brand-blue rounded-full animate-wave"
                style={{
                  height: `${h}%`,
                  animationDelay: `${i * 0.08}s`,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-brand-cyan mt-3 tracking-wider uppercase">
            Acoustic Signal Captured • Kannada / Hindi
          </span>
        </div>
      ),
    },
    {
      number: '02',
      badge: 'STEP 02 — UNDERSTAND',
      title: 'Identifies the question & retrieves verified curriculum.',
      description: 'The companion analyzes the student’s intent and grounds the explanation against the State Board or NCERT textbook syllabus.',
      icon: Cpu,
      visual: (
        <div className="w-full h-44 rounded-2xl bg-brand-deep/90 border border-brand-blue/20 p-5 flex flex-col items-center justify-center relative">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-surface border border-brand-cyan/40 text-brand-cyan text-xs font-mono">
              Natural Speech
            </div>
            <div className="w-8 h-px bg-brand-cyan animate-pulse" />
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center text-brand-midnight font-bold shadow-glow-cyan">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="w-8 h-px bg-brand-blue animate-pulse" />
            <div className="p-3 rounded-xl bg-brand-surface border border-brand-blue/40 text-brand-white text-xs font-mono">
              NCERT Ch. 7
            </div>
          </div>
          <span className="text-xs font-mono text-brand-blue mt-4 tracking-wider uppercase">
            Grounded Semantic Alignment
          </span>
        </div>
      ),
    },
    {
      number: '03',
      badge: 'STEP 03 — EXPLAIN',
      title: 'Receive step-by-step explanations with relatable examples.',
      description: 'Abstract concepts are illuminated through familiar everyday analogies before academic mathematical notation is introduced.',
      icon: Compass,
      visual: (
        <div className="w-full h-44 rounded-2xl bg-brand-deep/90 border border-brand-violet/20 p-5 flex flex-col justify-center relative">
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-brand-surface border border-white/10 text-xs text-brand-muted">
              <span className="text-brand-cyan font-bold mr-2">1. Analogy:</span> Imagine 4 equal slices of bread.
            </div>
            <div className="p-2.5 rounded-lg bg-brand-surface border border-brand-violet/30 text-xs text-brand-white font-medium">
              <span className="text-brand-violet font-bold mr-2">2. Concept:</span> 2 slices = 2/4 = 1/2 of the whole.
            </div>
          </div>
          <span className="text-xs font-mono text-brand-violet mt-3 tracking-wider uppercase text-center">
            Abstract ➔ Intuitive Bridge
          </span>
        </div>
      ),
    },
    {
      number: '04',
      badge: 'STEP 04 — PRACTISE',
      title: 'Answer interactive questions & receive contextual hints.',
      description: 'Short spoken quizzes test comprehension. If a learner hesitates, the Confidence Shield provides supportive clues.',
      icon: HelpCircle,
      visual: (
        <div className="w-full h-44 rounded-2xl bg-brand-deep/90 border border-brand-amber/20 p-5 flex flex-col justify-center relative">
          <div className="p-3 rounded-xl bg-brand-surface border border-brand-amber/30 mb-2">
            <span className="text-[10px] font-mono text-brand-amber uppercase block">Spoken Prompt</span>
            <p className="text-xs text-brand-white font-semibold">"If you eat 3 of 4 slices, what fraction remains?"</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-brand-dim">Learner responds:</span>
            <span className="text-xs text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              "1/4 slice!"
            </span>
          </div>
        </div>
      ),
    },
    {
      number: '05',
      badge: 'STEP 05 — IMPROVE',
      title: 'Your learning journey adapts as you become more confident.',
      description: 'Mastery maps update dynamically. Past misconceptions are catalogued to ensure long-term retention and exam confidence.',
      icon: Trophy,
      visual: (
        <div className="w-full h-44 rounded-2xl bg-brand-deep/90 border border-emerald-500/20 p-5 flex flex-col items-center justify-center relative">
          <div className="flex items-center gap-3">
            {[
              { label: 'Basic Parts', done: true },
              { label: 'Equal Shares', done: true },
              { label: 'Equivalent', done: true },
              { label: 'Mixed', done: false },
            ].map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  node.done ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-400' : 'bg-brand-surface border border-white/10 text-brand-dim'
                }`}>
                  {node.done ? '✓' : i + 1}
                </div>
                <span className="text-[9px] text-brand-dim font-mono">{node.label}</span>
              </div>
            ))}
          </div>
          <span className="text-xs font-mono text-emerald-400 mt-4 tracking-wider uppercase">
            Mastery Score: 88% (+14% this session)
          </span>
        </div>
      ),
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-brand-midnight border-t border-white/5" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>HOW SAHAAYALEARN WORKS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            From a simple question to{' '}
            <span className="text-gradient-cyan-blue">
              real understanding.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Follow the 5-step journey that turns spoken curiosity into exam-ready confidence.
          </p>
        </div>

        {/* Step Tabs / Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {steps.map((st, i) => (
            <button
              key={st.number}
              onClick={() => setActiveStep(i)}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap transition-all ${
                activeStep === i
                  ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-brand-midnight shadow-glow-cyan/40 font-bold'
                  : 'bg-brand-surface/60 text-brand-muted hover:text-brand-white hover:bg-brand-surface border border-white/5'
              }`}
            >
              Step {st.number} • {st.title.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* Active Step Hero Card */}
        <div className="rounded-3xl bg-brand-surface/80 border border-brand-cyan/25 p-7 sm:p-12 backdrop-blur-2xl shadow-glass">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider block mb-2">
                {steps[activeStep].badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-white mb-4">
                {steps[activeStep].title}
              </h3>
              <p className="text-base text-brand-muted leading-relaxed mb-6">
                {steps[activeStep].description}
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                  className="px-4 py-2 rounded-xl bg-brand-deep border border-white/10 text-xs font-medium text-brand-muted hover:text-brand-white"
                >
                  Previous Step
                </button>
                <button
                  onClick={() => setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                  className="px-4 py-2 rounded-xl bg-brand-surface border border-brand-cyan/40 text-xs font-bold text-brand-cyan hover:bg-brand-deep"
                >
                  Next Step ({steps[(activeStep + 1) % steps.length].number})
                </button>
              </div>
            </div>

            {/* Right Interactive Visual */}
            <div className="lg:col-span-5">
              {steps[activeStep].visual}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
