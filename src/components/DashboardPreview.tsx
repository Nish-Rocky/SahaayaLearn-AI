import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Award, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  Clock, 
  Target
} from 'lucide-react';
import { SahaayaApiClient, ProgressData } from '../services/api.ts';

export const DashboardPreview: React.FC = () => {
  const [activeSubject, setActiveSubject] = useState<'math' | 'science'>('math');
  const [liveProgress, setLiveProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    SahaayaApiClient.getProgress()
      .then((data) => setLiveProgress(data))
      .catch(() => {});
  }, []);

  return (
    <div className="w-full rounded-3xl bg-brand-surface/90 border border-white/10 p-6 sm:p-9 backdrop-blur-2xl shadow-glass">
      
      {/* Dashboard Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider">
              Student Dashboard Preview
            </span>
            <span className="text-[10px] bg-brand-deep border border-brand-cyan/20 px-2 py-0.5 rounded text-brand-dim font-mono">
              Illustrative Sample Data
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-brand-white">
            Ananya Sharma • Class 7 (Karnataka State Board)
          </h3>
        </div>

        {/* Quick Tabs: Subject Filter */}
        <div className="flex items-center gap-2 bg-brand-deep/80 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
          <button
            onClick={() => setActiveSubject('math')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubject === 'math'
                ? 'bg-brand-cyan text-brand-midnight shadow-glow-cyan/20'
                : 'text-brand-muted hover:text-brand-white'
            }`}
          >
            Mathematics
          </button>
          <button
            onClick={() => setActiveSubject('science')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubject === 'science'
                ? 'bg-brand-cyan text-brand-midnight shadow-glow-cyan/20'
                : 'text-brand-muted hover:text-brand-white'
            }`}
          >
            General Science
          </button>
        </div>
      </div>

      {/* Top Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-brand-deep/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-dim text-xs mb-2">
            <span>Overall Concept Mastery</span>
            <Target className="w-4 h-4 text-brand-cyan" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-white">84%</span>
            <span className="text-xs font-mono text-emerald-400 font-semibold">+12% this week</span>
          </div>
          <div className="w-full bg-brand-surface h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-gradient-to-r from-brand-cyan to-brand-blue h-full w-[84%]" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-brand-deep/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-dim text-xs mb-2">
            <span>Spoken Learning Time</span>
            <Clock className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-white">4.2 hrs</span>
            <span className="text-xs font-mono text-brand-dim">Across 18 sessions</span>
          </div>
          <span className="text-[10px] text-brand-dim mt-3">Kannada: 65% • English: 35%</span>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-brand-deep/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-dim text-xs mb-2">
            <span>Resolved Misconceptions</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">7 of 8</span>
            <span className="text-xs font-mono text-emerald-400">87.5% fixed</span>
          </div>
          <span className="text-[10px] text-brand-dim mt-3">Sahaaya X-Ray Diagnostics</span>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-brand-deep/70 border border-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-brand-dim text-xs mb-2">
            <span>Learning Missions</span>
            <Award className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-brand-amber">14</span>
            <span className="text-xs font-mono text-brand-dim">Badges Earned</span>
          </div>
          <span className="text-[10px] text-brand-dim mt-3">Active Streak: 6 Days</span>
        </div>

      </div>

      {/* Middle Grid: Concept Mastery Breakdown vs Misconception History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        
        {/* Left 7 Cols: Concept Mastery Bars */}
        <div className="lg:col-span-7 rounded-2xl bg-brand-deep/60 border border-white/5 p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-brand-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-cyan" />
              <span>{activeSubject === 'math' ? 'Mathematics Topic Mastery' : 'Science Topic Mastery'}</span>
            </h4>
            <span className="text-[11px] font-mono text-brand-dim">Based on Voice Quizzes</span>
          </div>

          <div className="space-y-4">
            {[
              { topic: 'Fractions & Part-Whole Relations', score: 92, status: 'Mastered' },
              { topic: 'Common Denominator Addition', score: 86, status: 'Strong' },
              { topic: 'Improper & Mixed Fractions', score: 74, status: 'Improving' },
              { topic: 'Decimals to Fraction Conversion', score: 62, status: 'Needs Practice' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-brand-white">{item.topic}</span>
                  <span className="text-brand-cyan font-mono font-bold">{item.score}%</span>
                </div>
                <div className="w-full bg-brand-surface h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-cyan to-brand-blue rounded-full transition-all duration-500"
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Sahaaya X-Ray Misconceptions Log */}
        <div className="lg:col-span-5 rounded-2xl bg-brand-deep/60 border border-white/5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-brand-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-brand-amber" />
                <span>Misconception Diagnostics</span>
              </h4>
              <span className="text-[10px] text-brand-amber font-mono bg-brand-amber/10 px-2 py-0.5 rounded border border-brand-amber/30">
                X-Ray Active
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-brand-surface/80 border border-emerald-500/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-white">Adding Denominators (1/3 + 1/3 = 2/6)</span>
                  <span className="text-emerald-400 font-bold text-[10px]">RESOLVED</span>
                </div>
                <p className="text-[11px] text-brand-muted">
                  Understood denominator represents partition size, not addable count.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-brand-surface/80 border border-brand-amber/30 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-brand-white">Bigger denominator = Bigger value</span>
                  <span className="text-brand-amber font-bold text-[10px]">PRACTICING</span>
                </div>
                <p className="text-[11px] text-brand-muted">
                  Assumed 1/8 is larger than 1/4 because 8 is greater than 4. Next exercise queued.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
            <span className="text-brand-dim">Next Recommended Mission:</span>
            <span className="text-brand-cyan font-bold flex items-center gap-1 cursor-pointer hover:underline">
              <span>Visualizing 1/8 vs 1/4 Slices</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Footer Callout for Sample Data */}
      <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-dim gap-2">
        <span>* Illustrative learner telemetry. SahaayaLearn does not publish public analytics or fabricated metrics.</span>
        <span className="font-mono text-brand-cyan">Data Model v2.4 Compliant</span>
      </div>

    </div>
  );
};
