import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Mic,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Plus,
  Play,
  Flame,
  Award,
  BookOpen,
  Layers,
  FileText,
  Dna,
  Zap,
  TrendingUp,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { useStudentStore } from '../../state/studentStore';
import { useUiStore } from '../../state/uiStore';
import { Card, Button, Badge, ProgressRing, Modal, Input } from '../../components/ui';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, studentProfile } = useAuthStore();
  const {
    subjects,
    timetable,
    homework,
    exams,
    studyTasks,
    goals,
    notes,
    flashcards,
    toggleHomeworkStatus,
    toggleStudyTaskStatus,
    addHomework,
    startFocusSession,
  } = useStudentStore();
  const { openGlobalVoice } = useUiStore();

  const [addHwOpen, setAddHwOpen] = useState(false);
  const [hwTitle, setHwTitle] = useState('');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwDueDate, setHwDueDate] = useState('2025-03-22');

  const name = user?.displayName || 'Ananya';
  const grade = studentProfile?.grade || 'Class 7';
  const board = studentProfile?.board || 'Karnataka State Board';

  // Current day of week
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = days[new Date().getDay()] || 'Monday';
  const todayClasses = timetable.filter((t) => t.day === (currentDay === 'Sunday' ? 'Monday' : currentDay));

  const pendingHomework = homework.filter((h) => h.status !== 'completed');
  const todayTasks = studyTasks.filter((t) => t.status === 'pending');
  const upcomingExams = exams.filter((e) => e.prepStatus !== 'ready');

  const handleCreateHw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hwTitle.trim()) return;
    addHomework({
      studentId: user?.id || '00000000-0000-0000-0000-000000000001',
      title: hwTitle,
      subject: hwSubject,
      dueDate: hwDueDate,
      status: 'not_started',
      priority: 'medium',
    });
    setHwTitle('');
    setAddHwOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Greeting Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-brand-cyan tracking-wider uppercase">
              Academic Dashboard
            </span>
            <span className="text-xs text-brand-dim">•</span>
            <span className="text-xs text-brand-muted">
              {grade} • {board} • 2025–26
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-white font-heading tracking-tight">
            Good morning, {name}.
          </h1>
          <p className="text-xs md:text-sm text-brand-muted mt-0.5">
            Let's make today a productive learning day. You have{' '}
            <span className="text-brand-cyan font-bold">{pendingHomework.length} homework items</span> and{' '}
            <span className="text-amber-300 font-bold">{todayTasks.length} study tasks</span> planned.
          </p>
        </div>

        {/* Quick Voice Bar Button */}
        <div className="flex items-center gap-3">
          <Button
            variant="cyan"
            size="md"
            icon={<Mic className="w-4 h-4" />}
            onClick={() => openGlobalVoice()}
          >
            Ask Sahaaya Anything
          </Button>
        </div>
      </div>

      {/* 2. Banner: Continue Learning (Hero resume card) */}
      <Card variant="elevated" className="relative overflow-hidden border border-brand-cyan/30 p-6">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-blue/20 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="blue" size="sm">Resume Last Session</Badge>
              <span className="text-xs text-brand-dim">• Mathematics • Chapter 2</span>
            </div>
            <h3 className="text-lg font-bold text-brand-white font-heading">
              Fractions and Decimals: Reciprocals & Division
            </h3>
            <p className="text-xs text-brand-muted">
              You were exploring why dividing fractions requires multiplying by the reciprocal. 1 practice quiz is pending.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              icon={<Play className="w-4 h-4" />}
              onClick={() => navigate('/student/ai-tutor?topic=Fractions')}
            >
              Continue Learning
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => navigate('/student/subjects/subj-math')}
            >
              View Syllabus
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. Grid: Academic Pulse & Smart Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Academic Pulse (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/student/ai-tutor')}
              className="p-3 bg-brand-surfaceCard hover:bg-brand-surfaceElevated border border-brand-borderSubtle hover:border-brand-cyan/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-cyan/15 flex items-center justify-center text-brand-cyan group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-brand-white">Ask AI Tutor</span>
            </button>

            <button
              onClick={() => setAddHwOpen(true)}
              className="p-3 bg-brand-surfaceCard hover:bg-brand-surfaceElevated border border-brand-borderSubtle hover:border-brand-cyan/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-brand-white">Add Homework</span>
            </button>

            <button
              onClick={() => navigate('/student/flashcards')}
              className="p-3 bg-brand-surfaceCard hover:bg-brand-surfaceElevated border border-brand-borderSubtle hover:border-brand-cyan/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-brand-violet/15 flex items-center justify-center text-brand-violet group-hover:scale-110 transition-transform">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-brand-white">Start Revision</span>
            </button>

            <button
              onClick={() => {
                startFocusSession(25, 'Mathematics', 'Fractions');
                navigate('/student/planner');
              }}
              className="p-3 bg-brand-surfaceCard hover:bg-brand-surfaceElevated border border-brand-borderSubtle hover:border-brand-cyan/40 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-brand-white">25m Focus Session</span>
            </button>
          </div>

          {/* Today's Academic Overview */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-cyan" />
                <h3 className="text-sm font-bold text-brand-white font-heading">
                  Today's Timetable & Study Schedule
                </h3>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/student/timetable')}
              >
                Full Timetable →
              </Button>
            </div>

            {/* Timetable row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
              {todayClasses.map((cl) => (
                <div
                  key={cl.id}
                  className="p-3 bg-white/3 border border-white/5 rounded-xl hover:border-brand-cyan/30 transition-colors"
                >
                  <span className="text-[10px] text-brand-dim font-bold block">{cl.startTime}</span>
                  <span className="text-xs font-bold text-brand-white block mt-0.5 truncate">
                    {cl.subject}
                  </span>
                  <span className="text-[10px] text-brand-muted block mt-0.5">{cl.teacher}</span>
                </div>
              ))}
            </div>

            {/* Planned Study Tasks for Today */}
            <div className="pt-2 border-t border-brand-borderSubtle space-y-2">
              <span className="text-xs font-bold text-brand-muted block">Planned Study Tasks</span>
              {todayTasks.length === 0 ? (
                <p className="text-xs text-brand-dim">No tasks remaining for today. Great job!</p>
              ) : (
                todayTasks.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between p-2.5 bg-white/2 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleStudyTaskStatus(t.id)}
                        className="text-brand-dim hover:text-emerald-400 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div>
                        <span className="text-xs font-semibold text-brand-white">{t.title}</span>
                        <span className="text-[10px] text-brand-dim ml-2">{t.subject} • {t.durationMin}m</span>
                      </div>
                    </div>
                    <Badge variant={t.priority === 'high' ? 'red' : 'neutral'} size="sm">
                      {t.priority}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Pending Homework Card */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-brand-white font-heading">
                  Homework Due Soon ({pendingHomework.length})
                </h3>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/student/homework')}
              >
                View All →
              </Button>
            </div>

            <div className="space-y-2.5">
              {pendingHomework.slice(0, 3).map((hw) => (
                <div
                  key={hw.id}
                  className="flex items-center justify-between p-3 bg-brand-surfaceCard border border-brand-borderSubtle rounded-xl hover:border-brand-border/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleHomeworkStatus(hw.id)}
                      className="w-5 h-5 rounded-md border border-brand-dim hover:border-brand-cyan flex items-center justify-center transition-colors"
                    >
                      {hw.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-brand-cyan" />}
                    </button>
                    <div>
                      <span className="text-xs font-semibold text-brand-white block">{hw.title}</span>
                      <span className="text-[10px] text-brand-dim">
                        {hw.subject} • Due {hw.dueDate} {hw.assignedBy ? `• ${hw.assignedBy}` : ''}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="surface"
                    size="xs"
                    onClick={() => navigate(`/student/ai-tutor?hw=${encodeURIComponent(hw.title)}`)}
                  >
                    Solve with AI
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Academic Pulse & Upcoming Exams */}
        <div className="space-y-6">
          {/* Academic Pulse Card */}
          <Card className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-brand-white font-heading">Academic Pulse</h3>
              <TrendingUp className="w-4 h-4 text-brand-cyan" />
            </div>

            {/* Subject Mastery Rings */}
            <div className="grid grid-cols-2 gap-4 py-1">
              <div className="flex flex-col items-center p-3 bg-white/2 rounded-xl text-center">
                <ProgressRing progress={78} size={64} strokeWidth={5} color="#24C8F4" />
                <span className="text-xs font-bold text-brand-white mt-2">Mathematics</span>
                <span className="text-[10px] text-brand-dim">78% Mastery</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white/2 rounded-xl text-center">
                <ProgressRing progress={84} size={64} strokeWidth={5} color="#10B981" />
                <span className="text-xs font-bold text-brand-white mt-2">Science</span>
                <span className="text-[10px] text-brand-dim">84% Mastery</span>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="space-y-2 pt-2 border-t border-brand-borderSubtle">
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-muted">Strong Concept:</span>
                <span className="text-emerald-400 font-bold">Photosynthesis (94%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-muted">Needs Attention:</span>
                <span className="text-amber-400 font-bold">Fraction Division (45%)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-brand-muted">Spoken Hours:</span>
                <span className="text-brand-cyan font-bold">4.2 hrs this week</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={() => navigate('/student/progress')}
            >
              View Academic Twin Analytics →
            </Button>
          </Card>

          {/* Smart AI Recommendations */}
          <Card className="p-6 space-y-3.5 bg-gradient-to-br from-brand-surface to-brand-blue/10 border border-brand-blue/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-cyan" />
              <h3 className="text-xs font-bold text-brand-white font-heading uppercase tracking-wider">
                Smart Recommendations
              </h3>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 bg-brand-surfaceCard rounded-xl border border-brand-borderSubtle">
                <p className="font-semibold text-brand-white">Revise Fraction Reciprocals</p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Your Math Midterm is in 5 days. You missed 1 diagnostic question on reciprocal inversion.
                </p>
                <button
                  onClick={() => navigate('/student/ai-tutor?topic=Reciprocals')}
                  className="text-[11px] text-brand-cyan font-bold mt-1.5 hover:underline flex items-center gap-1"
                >
                  Start 5-min review →
                </button>
              </div>

              <div className="p-2.5 bg-brand-surfaceCard rounded-xl border border-brand-borderSubtle">
                <p className="font-semibold text-brand-white">Science Lab Activity Prep</p>
                <p className="text-[11px] text-brand-muted mt-0.5">
                  Leaf starch test activity scheduled for tomorrow afternoon. Review stomata diagram note.
                </p>
                <button
                  onClick={() => navigate('/student/notes')}
                  className="text-[11px] text-brand-cyan font-bold mt-1.5 hover:underline flex items-center gap-1"
                >
                  Open Notes →
                </button>
              </div>
            </div>
          </Card>

          {/* Upcoming Examinations Countdown */}
          <Card className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-brand-white font-heading uppercase tracking-wider">
                Upcoming Exams
              </h3>
              <Award className="w-4 h-4 text-brand-cyan" />
            </div>

            {upcomingExams.map((ex) => (
              <div
                key={ex.id}
                className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1.5 cursor-pointer hover:border-brand-cyan/30 transition-colors"
                onClick={() => navigate('/student/exams')}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-white">{ex.name}</span>
                  <Badge variant="blue" size="sm">In 5 Days</Badge>
                </div>
                <div className="flex items-center justify-between text-[11px] text-brand-dim">
                  <span>{ex.subject}</span>
                  <span className="text-brand-cyan font-semibold">{ex.readinessPercentage}% Ready</span>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Add Homework Modal */}
      <Modal
        isOpen={addHwOpen}
        onClose={() => setAddHwOpen(false)}
        title="Add New Homework / Assignment"
        description="Record your school homework with due date and subject."
      >
        <form onSubmit={handleCreateHw} className="space-y-4">
          <Input
            label="Homework Title / Question"
            placeholder="e.g. Exercise 2.3 Questions 1 to 5"
            value={hwTitle}
            onChange={(e) => setHwTitle(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Subject</label>
            <select
              value={hwSubject}
              onChange={(e) => setHwSubject(e.target.value)}
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.name} className="bg-brand-surface text-brand-white">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            type="date"
            label="Due Date"
            value={hwDueDate}
            onChange={(e) => setHwDueDate(e.target.value)}
            required
          />
          <div className="flex items-center justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setAddHwOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Homework
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
