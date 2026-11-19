import React, { useState } from 'react';
import { 
  ScanSearch, 
  Languages, 
  Lightbulb, 
  Smartphone, 
  ShieldCheck, 
  Users, 
  Sparkles,
  ArrowUpRight,
  Check
} from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const [activeXRayState, setActiveXRayState] = useState<'scattered' | 'structured'>('structured');
  const [activeLadderStep, setActiveLadderStep] = useState<number>(1);
  const [activeShieldLevel, setActiveShieldLevel] = useState<number>(2);

  return (
    <section className="relative py-24 sm:py-32 bg-brand-deep/80 border-t border-white/5" id="features">
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/4 w-[32rem] h-[32rem] bg-brand-cyan/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-brand-violet/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIX SIGNATURE INNOVATIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            Intelligence that goes{' '}
            <span className="text-gradient-cyan-blue">
              beyond answers.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Every learner is different. SahaayaLearn adapts to the way you understand, practise and grow.
          </p>
        </div>

        {/* Bento Grid: 6 Distinctly Layout Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* ================================================================
              FEATURE 01: SAHAAYA X-RAY (Col span 7 - Large Bento Hero)
             ================================================================ */}
          <div className="lg:col-span-7 rounded-3xl bg-brand-surface/75 border border-white/10 p-7 sm:p-9 backdrop-blur-xl hover:border-brand-cyan/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-cyan uppercase px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
                  INTELLIGENT MISCONCEPTION DETECTION
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-deep border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                  <ScanSearch className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-white mb-3">
                Discover why you got it wrong.
              </h3>

              <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-6">
                SahaayaLearn looks beyond right and wrong answers. It analyses the learner's reasoning, identifies potential conceptual misunderstandings and provides targeted explanations to correct them.
              </p>
            </div>

            {/* Interactive Animated Node Network Visualization */}
            <div className="rounded-2xl bg-brand-deep/80 border border-white/10 p-5 mt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-brand-dim uppercase">Reasoning Node Graph</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveXRayState('scattered')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      activeXRayState === 'scattered'
                        ? 'bg-brand-surface text-brand-amber border border-brand-amber/30'
                        : 'text-brand-dim hover:text-brand-muted'
                    }`}
                  >
                    Raw Misconception
                  </button>
                  <button
                    onClick={() => setActiveXRayState('structured')}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      activeXRayState === 'structured'
                        ? 'bg-brand-surface text-brand-cyan border border-brand-cyan/30'
                        : 'text-brand-dim hover:text-brand-muted'
                    }`}
                  >
                    Structured Knowledge
                  </button>
                </div>
              </div>

              {/* Node Visual Area */}
              <div className="h-32 rounded-xl bg-brand-midnight/60 border border-white/5 relative flex items-center justify-center overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 120">
                  {activeXRayState === 'structured' ? (
                    <>
                      {/* Structured clean hierarchy */}
                      <line x1="80" y1="60" x2="200" y2="40" stroke="#24C8F4" strokeWidth="2" strokeDasharray="4 2" />
                      <line x1="80" y1="60" x2="200" y2="80" stroke="#24C8F4" strokeWidth="2" strokeDasharray="4 2" />
                      <line x1="200" y1="40" x2="320" y2="60" stroke="#3478F6" strokeWidth="2" />
                      <line x1="200" y1="80" x2="320" y2="60" stroke="#8275FF" strokeWidth="2" />

                      <circle cx="80" cy="60" r="10" fill="#0B1C35" stroke="#24C8F4" strokeWidth="3" />
                      <text x="80" y="64" fill="#24C8F4" fontSize="9" textAnchor="middle" fontWeight="bold">Input</text>

                      <circle cx="200" cy="40" r="8" fill="#0B1C35" stroke="#3478F6" strokeWidth="2" />
                      <text x="200" y="43" fill="#EAF7FF" fontSize="7" textAnchor="middle">Part</text>

                      <circle cx="200" cy="80" r="8" fill="#0B1C35" stroke="#8275FF" strokeWidth="2" />
                      <text x="200" y="83" fill="#EAF7FF" fontSize="7" textAnchor="middle">Whole</text>

                      <circle cx="320" cy="60" r="12" fill="#0B1C35" stroke="#24C8F4" strokeWidth="3" />
                      <text x="320" y="64" fill="#24C8F4" fontSize="8" textAnchor="middle" fontWeight="bold">Mastery</text>
                    </>
                  ) : (
                    <>
                      {/* Disjointed confused nodes */}
                      <line x1="60" y1="30" x2="160" y2="90" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
                      <line x1="140" y1="25" x2="270" y2="85" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2 2" />
                      
                      <circle cx="60" cy="30" r="8" fill="#0B1C35" stroke="#F59E0B" strokeWidth="2" />
                      <text x="60" y="33" fill="#F59E0B" fontSize="7" textAnchor="middle">Gap A</text>

                      <circle cx="160" cy="90" r="8" fill="#0B1C35" stroke="#F59E0B" strokeWidth="2" />
                      <text x="160" y="93" fill="#F59E0B" fontSize="7" textAnchor="middle">Confusion</text>

                      <circle cx="270" cy="85" r="8" fill="#0B1C35" stroke="#F59E0B" strokeWidth="2" />
                      <text x="270" y="88" fill="#F59E0B" fontSize="7" textAnchor="middle">Gap B</text>

                      <circle cx="330" cy="35" r="8" fill="#0B1C35" stroke="#F59E0B" strokeWidth="2" />
                      <text x="330" y="38" fill="#F59E0B" fontSize="7" textAnchor="middle">Unlinked</text>
                    </>
                  )}
                </svg>
                <span className="absolute bottom-2 right-3 text-[10px] text-brand-dim font-mono">
                  {activeXRayState === 'structured' ? 'Resolved: Added Denominators error corrected' : 'Unresolved Misconception detected'}
                </span>
              </div>
            </div>
          </div>

          {/* ================================================================
              FEATURE 02: LANGUAGE LADDER (Col span 5 - Tall Bento)
             ================================================================ */}
          <div className="lg:col-span-5 rounded-3xl bg-brand-surface/75 border border-white/10 p-7 sm:p-9 backdrop-blur-xl hover:border-brand-violet/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-violet/10 rounded-full blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-violet uppercase px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30">
                  MULTILINGUAL LEARNING
                </span>
                <div className="w-10 h-10 rounded-xl bg-brand-deep border border-brand-violet/30 flex items-center justify-center text-brand-violet">
                  <Languages className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-2xl font-extrabold text-brand-white mb-3">
                Think in your language.<br />Excel in any language.
              </h3>

              <p className="text-sm text-brand-muted leading-relaxed mb-6">
                Understand a concept in your preferred language, connect it with academic terminology and gradually learn to express your knowledge confidently in examination language.
              </p>
            </div>

            {/* Language Ladder Interactive Stepper */}
            <div className="space-y-2 mt-2">
              {[
                { step: 1, label: 'Home Language', text: 'ನಾಲ್ಕರಲ್ಲಿ ಒಂದು ಪಾಲು (Kannada)', badge: 'Comfort' },
                { step: 2, label: 'Concept Bridge', text: '1 out of 4 equal parts', badge: 'Linkage' },
                { step: 3, label: 'Academic Term', text: 'Numerator 1, Denominator 4', badge: 'Exam Ready' },
              ].map((ladder) => (
                <div
                  key={ladder.step}
                  onClick={() => setActiveLadderStep(ladder.step)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    activeLadderStep === ladder.step
                      ? 'bg-brand-deep border-brand-violet/60 shadow-glow-violet/20'
                      : 'bg-brand-midnight/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-brand-dim mb-1">
                    <span>LADDER STEP 0{ladder.step} • {ladder.label}</span>
                    <span className="text-brand-violet font-semibold">{ladder.badge}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-brand-white">
                    {ladder.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ================================================================
              FEATURE 03: LIFE-TO-LESSON (Col span 4)
             ================================================================ */}
          <div className="lg:col-span-4 rounded-3xl bg-brand-surface/75 border border-white/10 p-7 backdrop-blur-xl hover:border-brand-cyan/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-amber uppercase px-3 py-1 rounded-full bg-brand-amber/10 border border-brand-amber/30">
                  REAL-WORLD LEARNING
                </span>
                <div className="w-9 h-9 rounded-xl bg-brand-deep border border-brand-amber/30 flex items-center justify-center text-brand-amber">
                  <Lightbulb className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-brand-white mb-2">
                Your world becomes your classroom.
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
                Turn mathematical, scientific and academic concepts into interactive challenges inspired by everyday life.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-deep/80 border border-white/10 text-xs">
              <span className="text-[10px] font-mono text-brand-cyan uppercase block mb-1">Everyday Scenario</span>
              <p className="text-brand-white font-medium mb-2">
                "Dividing 4 rotis equally among 5 cousins at dinner."
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-brand-dim">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Maps to: 4/5 proper fraction & ratio</span>
              </div>
            </div>
          </div>

          {/* ================================================================
              FEATURE 04: SHARED-SMARTPHONE LEARNING POCKET (Col span 4)
             ================================================================ */}
          <div className="lg:col-span-4 rounded-3xl bg-brand-surface/75 border border-white/10 p-7 backdrop-blur-xl hover:border-brand-blue/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-blue uppercase px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30">
                  ACCESSIBILITY
                </span>
                <div className="w-9 h-9 rounded-xl bg-brand-deep border border-brand-blue/30 flex items-center justify-center text-brand-blue">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-brand-white mb-2">
                One device. Every learner.
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
                Separate learning journeys, individual progress and downloadable learning capsules make shared-device learning more accessible.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-deep/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-white font-semibold">Ananya (Class 8)</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs opacity-60">
                <span className="text-brand-muted">Karthik (Class 6)</span>
                <span className="text-[10px] text-brand-dim">Offline Capsule Saved</span>
              </div>
            </div>
          </div>

          {/* ================================================================
              FEATURE 05: CONFIDENCE SHIELD (Col span 4)
             ================================================================ */}
          <div className="lg:col-span-4 rounded-3xl bg-brand-surface/75 border border-white/10 p-7 backdrop-blur-xl hover:border-brand-cyan/40 transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-5">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-cyan uppercase px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30">
                  ADAPTIVE TUTORING
                </span>
                <div className="w-9 h-9 rounded-xl bg-brand-deep border border-brand-cyan/30 flex items-center justify-center text-brand-cyan">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-brand-white mb-2">
                Learn without the fear of being wrong.
              </h3>

              <p className="text-xs sm:text-sm text-brand-muted leading-relaxed mb-4">
                From contextual hints to supportive explanations, the tutor adapts to how confidently students understand and answer questions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-deep/80 border border-white/10">
              <div className="flex justify-between text-[11px] text-brand-dim mb-2 font-mono">
                <span>Support Level</span>
                <span className="text-brand-cyan">Shield Level {activeShieldLevel}</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveShieldLevel(lvl)}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                      activeShieldLevel >= lvl
                        ? 'bg-brand-cyan/20 border border-brand-cyan text-brand-cyan'
                        : 'bg-brand-surface text-brand-dim border border-white/5'
                    }`}
                  >
                    Level {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================================================================
              FEATURE 06: SAHAAYA FAMILY BRIDGE (Col span 12 - Wide Bento Banner)
             ================================================================ */}
          <div className="lg:col-span-12 rounded-3xl bg-brand-surface/75 border border-white/10 p-7 sm:p-9 backdrop-blur-xl hover:border-brand-violet/40 transition-all duration-300 flex flex-col lg:flex-row items-center justify-between gap-8 group">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono font-bold tracking-wider text-brand-violet uppercase px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/30">
                  FAMILY CONNECTION
                </span>
                <div className="w-8 h-8 rounded-lg bg-brand-deep border border-brand-violet/30 flex items-center justify-center text-brand-violet">
                  <Users className="w-4 h-4" />
                </div>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-white mb-3">
                Bring families into learning.
              </h3>

              <p className="text-sm sm:text-base text-brand-muted leading-relaxed">
                Optional spoken learning summaries help parents understand a student's progress and discover simple ways to support their education — delivered in their own language without complex educational jargon.
              </p>
            </div>

            {/* Parent Voice Capsule Audio Micro-Player */}
            <div className="w-full lg:w-96 rounded-2xl bg-brand-deep/90 border border-brand-violet/30 p-5 shadow-glass">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-brand-violet font-bold uppercase tracking-wider">
                  Family Spoken Note (Kannada)
                </span>
                <span className="text-[10px] text-brand-dim font-mono">0:42</span>
              </div>
              <p className="text-xs text-brand-white font-medium mb-3 italic">
                "ಇಂದು ಅನನ್ಯ ಭಿನ್ನರಾಶಿಗಳ ಪರಿಕಲ್ಪನೆಯನ್ನು ಚೆನ್ನಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದಾಳೆ..."
              </p>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-brand-violet text-brand-midnight flex items-center justify-center font-bold text-xs">
                  ▶
                </div>
                {/* Audio wave bars */}
                <div className="flex-1 flex items-center gap-1 h-6">
                  {[40, 75, 55, 90, 60, 30, 85, 45, 70, 95, 50, 65, 80, 40].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-brand-violet/60 rounded-full"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
