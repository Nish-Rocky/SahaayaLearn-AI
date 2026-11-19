import React, { useState } from 'react';
import { Ear, MessageSquareCode, PenTool, CheckCircle2, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

interface Stage {
  id: string;
  number: string;
  name: string;
  tagline: string;
  description: string;
  tutorAction: string;
  studentExperience: string;
  icon: React.ElementType;
  color: string;
  glow: string;
}

export const LearningCycle: React.FC = () => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages: Stage[] = [
    {
      id: 'understand',
      number: '01',
      name: 'UNDERSTAND',
      tagline: 'Deep Natural Listening',
      description: 'The companion analyzes student speech, dialetical expressions, and underlying intent without penalizing pronunciation.',
      tutorAction: 'Identifies core question, language nuances, and existing conceptual foundations.',
      studentExperience: 'Can speak naturally in everyday Kannada, Hindi, or English without hesitation.',
      icon: Ear,
      color: 'text-brand-cyan border-brand-cyan bg-brand-cyan/10',
      glow: 'shadow-glow-cyan',
    },
    {
      id: 'explain',
      number: '02',
      name: 'EXPLAIN',
      tagline: 'Textbook-Grounded Clarification',
      description: 'Breaks complex textbook topics into relatable everyday analogies and visualizable real-world examples.',
      tutorAction: 'Synthesizes verified syllabus curriculum with home-language metaphors.',
      studentExperience: 'Receives step-by-step clarity before moving to formal formulas.',
      icon: MessageSquareCode,
      color: 'text-brand-blue border-brand-blue bg-brand-blue/10',
      glow: 'shadow-glow-blue',
    },
    {
      id: 'practice',
      number: '03',
      name: 'PRACTICE',
      tagline: 'Interactive Spoken Drills',
      description: 'Engages learners with gentle, interactive questions and adaptive hints rather than intimidating exams.',
      tutorAction: 'Generates progressive micro-problems calibrated to the student’s immediate level.',
      studentExperience: 'Answers out loud, experimenting with thoughts without fear of grades.',
      icon: PenTool,
      color: 'text-brand-violet border-brand-violet bg-brand-violet/10',
      glow: 'shadow-glow-violet',
    },
    {
      id: 'evaluate',
      number: '04',
      name: 'EVALUATE',
      tagline: 'Sahaaya X-Ray Diagnostics',
      description: 'Pinpoints specific root misconceptions behind errors rather than simply marking answers wrong.',
      tutorAction: 'Differentiates careless mistakes from foundational knowledge gaps.',
      studentExperience: 'Understands the exact "why" behind any misconception instantly.',
      icon: CheckCircle2,
      color: 'text-brand-amber border-brand-amber bg-brand-amber/10',
      glow: 'shadow-glow-cyan',
    },
    {
      id: 'improve',
      number: '05',
      name: 'IMPROVE',
      tagline: 'Academic Ladder Mastery',
      description: 'Bridges conceptual grasp into exam-ready technical terms, reinforcing memory pathways.',
      tutorAction: 'Updates learner mastery map and adapts future question trajectories.',
      studentExperience: 'Gains confidence to explain and write answers in formal exams.',
      icon: TrendingUp,
      color: 'text-emerald-400 border-emerald-400 bg-emerald-400/10',
      glow: 'shadow-glow-cyan',
    },
  ];

  const active = stages[activeStageIndex];
  const Icon = active.icon;

  return (
    <div className="w-full">
      {/* Interactive Horizontal Process Stepper */}
      <div className="relative mb-10 overflow-x-auto pb-4 no-scrollbar">
        {/* Connecting Line */}
        <div className="hidden lg:block absolute top-7 left-12 right-12 h-0.5 bg-brand-surfaceElevated -z-0">
          <div 
            className="h-full bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-violet transition-all duration-500"
            style={{ width: `${(activeStageIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>

        <div className="flex items-center justify-between min-w-[700px] lg:min-w-0 relative z-10">
          {stages.map((stage, idx) => {
            const isSelected = idx === activeStageIndex;
            const isPassed = idx < activeStageIndex;
            const StageIcon = stage.icon;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIndex(idx)}
                className="group flex flex-col items-center focus:outline-none"
              >
                {/* Node Ring */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 relative ${
                    isSelected
                      ? `bg-brand-deep border-2 ${stage.color} ${stage.glow} scale-110`
                      : isPassed
                      ? 'bg-brand-surface border border-brand-cyan/40 text-brand-cyan'
                      : 'bg-brand-surface/60 border border-white/10 text-brand-dim group-hover:border-white/30 group-hover:text-brand-muted'
                  }`}
                >
                  <StageIcon className="w-6 h-6 transition-transform group-hover:scale-110" />
                  
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-cyan animate-ping" />
                  )}
                </div>

                {/* Stage Title */}
                <span className="mt-3 text-xs font-mono font-bold tracking-wider text-brand-dim uppercase">
                  {stage.number}
                </span>
                <span
                  className={`text-xs font-bold tracking-wide mt-0.5 transition-colors ${
                    isSelected ? 'text-brand-white' : 'text-brand-muted group-hover:text-brand-white'
                  }`}
                >
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Expanded Active Stage Detail Card */}
      <div className="rounded-3xl bg-brand-surface/80 border border-brand-cyan/25 p-6 sm:p-10 backdrop-blur-2xl shadow-glass relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Left Column: Stage Overview */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-deep border border-brand-cyan/30 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>STAGE {active.number} • {active.tagline}</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-white tracking-tight mb-4 flex items-center gap-3">
              <span className="text-gradient-cyan-blue">{active.name}</span>
            </h3>

            <p className="text-base sm:text-lg text-brand-white/90 leading-relaxed mb-6 font-normal">
              {active.description}
            </p>

            {/* Two column breakdown: Tutor Action vs Student Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="p-4 rounded-xl bg-brand-deep/60 border border-white/5">
                <span className="text-[11px] font-mono uppercase text-brand-cyan font-bold tracking-wider block mb-1.5">
                  Companion Action
                </span>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {active.tutorAction}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-brand-deep/60 border border-white/5">
                <span className="text-[11px] font-mono uppercase text-brand-violet font-bold tracking-wider block mb-1.5">
                  Learner Experience
                </span>
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                  {active.studentExperience}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Holographic Stage Interactive Visualizer */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-brand-deep/90 border border-white/10 p-6 flex flex-col items-center text-center shadow-inner relative">
              {/* Outer pulsing ring */}
              <div className="w-24 h-24 rounded-full bg-brand-surface border border-brand-cyan/40 flex items-center justify-center mb-4 relative shadow-glow-cyan/20">
                <div className="absolute inset-0 rounded-full border border-dashed border-brand-cyan/30 animate-spin" style={{ animationDuration: '12s' }} />
                <Icon className="w-10 h-10 text-brand-cyan" />
              </div>

              <span className="text-xs font-mono font-bold text-brand-dim uppercase tracking-wider mb-1">
                ADAPTIVE LEARNING CYCLE
              </span>
              <h4 className="text-base font-bold text-brand-white mb-2">
                {active.name}: {active.tagline}
              </h4>
              <p className="text-xs text-brand-muted mb-4">
                Step {active.number} of 05 in the continuous mastery loop.
              </p>

              {/* Next step prompt */}
              <button
                onClick={() => setActiveStageIndex((prev) => (prev + 1) % stages.length)}
                className="inline-flex items-center gap-2 text-xs font-bold text-brand-cyan hover:text-white transition-colors"
              >
                <span>Examine Next Stage</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
