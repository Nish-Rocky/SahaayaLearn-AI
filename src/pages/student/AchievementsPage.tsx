import React from 'react';
import { Award, CheckCircle2, Flame, Brain, Sparkles, Plus } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, ProgressRing } from '../../components/ui';

export const AchievementsPage: React.FC = () => {
  const { goals, achievements } = useStudentStore();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-white font-heading">
          Goals & Achievements
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Encouraging milestones celebrating real learning consistency and conceptual mastery.
        </p>
      </div>

      {/* Active Learning Goals */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-brand-white font-heading">Active Academic Goals</h2>
          <Badge variant="cyan" size="sm">{goals.filter((g) => g.completed).length}/{goals.length} Completed</Badge>
        </div>

        <div className="space-y-3">
          {goals.map((g) => (
            <div
              key={g.id}
              className="p-3.5 bg-white/2 rounded-xl border border-white/5 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2
                    className={`w-4 h-4 ${g.completed ? 'text-emerald-400' : 'text-brand-dim'}`}
                  />
                  <span className={`text-xs font-bold ${g.completed ? 'line-through text-brand-muted' : 'text-brand-white'}`}>
                    {g.title}
                  </span>
                </div>
                <Badge variant={g.completed ? 'green' : 'blue'} size="sm">
                  {g.type}
                </Badge>
              </div>

              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-brand-cyan h-full rounded-full transition-all duration-500"
                  style={{ width: `${g.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Earned Milestones & Badges */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-brand-white font-heading">Earned Milestone Badges</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach) => (
            <Card
              key={ach.id}
              className="p-5 flex items-start gap-4 border border-brand-borderSubtle hover:border-brand-cyan/40 transition-all"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  ach.badgeColor === 'cyan'
                    ? 'bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30'
                    : ach.badgeColor === 'green'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : ach.badgeColor === 'amber'
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'bg-brand-violet/15 text-brand-violet border border-brand-violet/30'
                }`}
              >
                <Award className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-brand-white block">{ach.title}</span>
                <p className="text-[11px] text-brand-muted leading-relaxed">{ach.description}</p>
                <span className="text-[10px] text-brand-dim block pt-1">Earned on {ach.earnedAt}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
