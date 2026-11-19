import React from 'react';
import { BarChart3, TrendingUp, Clock, CheckCircle2, Award, Sparkles, BookOpen } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Badge, ProgressRing, Button } from '../../components/ui';

export const ProgressPage: React.FC = () => {
  const { subjects, homework, studyTasks } = useStudentStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-white font-heading">
          Academic Twin & Learning Analytics
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Evidence-grounded model of your demonstrated understanding, learning velocity, and retention trends.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-brand-cyan/30">
          <span className="text-[10px] text-brand-dim uppercase font-bold tracking-wider">
            Overall Curriculum Mastery
          </span>
          <span className="text-2xl font-extrabold text-brand-cyan block mt-1">81%</span>
          <span className="text-[11px] text-brand-dim mt-0.5 block">+6% over last 14 days</span>
        </Card>

        <Card className="p-5 border-brand-violet/30">
          <span className="text-[10px] text-brand-dim uppercase font-bold tracking-wider">
            Spoken Learning Hours
          </span>
          <span className="text-2xl font-extrabold text-brand-violet block mt-1">12.4 hrs</span>
          <span className="text-[11px] text-brand-dim mt-0.5 block">Kannada (68%) • English (32%)</span>
        </Card>

        <Card className="p-5 border-emerald-500/30">
          <span className="text-[10px] text-brand-dim uppercase font-bold tracking-wider">
            Active Learning Streak
          </span>
          <span className="text-2xl font-extrabold text-emerald-400 block mt-1">7 Days</span>
          <span className="text-[11px] text-brand-dim mt-0.5 block">Consistent daily study</span>
        </Card>

        <Card className="p-5 border-amber-500/30">
          <span className="text-[10px] text-brand-dim uppercase font-bold tracking-wider">
            Completed Study Tasks
          </span>
          <span className="text-2xl font-extrabold text-amber-300 block mt-1">
            {studyTasks.filter((t) => t.status === 'done').length + 8}
          </span>
          <span className="text-[11px] text-brand-dim mt-0.5 block">On track for Term Midterms</span>
        </Card>
      </div>

      {/* Subject-Level Performance Breakdown */}
      <Card className="p-6 space-y-4">
        <h3 className="text-sm font-bold text-brand-white font-heading">
          Subject-Level Mastery & Practice History
        </h3>

        <div className="space-y-4">
          {subjects.map((sub) => (
            <div key={sub.id} className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-brand-white">{sub.name}</span>
                  <span className="text-xs text-brand-dim ml-2">{sub.grade} • {sub.board}</span>
                </div>
                <span className="text-sm font-extrabold text-brand-cyan">{sub.masteryScore}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-brand-blue to-brand-cyan h-full rounded-full transition-all duration-700"
                  style={{ width: `${sub.masteryScore}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-brand-dim">
                <span>{sub.chapters.length} Units</span>
                <span>Active Syllabus</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
