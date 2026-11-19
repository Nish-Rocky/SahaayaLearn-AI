import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Sparkles,
  Zap,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, Modal, Input, ProgressRing } from '../../components/ui';

export const PlannerPage: React.FC = () => {
  const {
    studyTasks,
    toggleStudyTaskStatus,
    addStudyTask,
    rescheduleTask,
    activeFocusSession,
    startFocusSession,
    tickFocusSession,
    stopFocusSession,
  } = useStudentStore();

  const [addOpen, setAddOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskSubject, setTaskSubject] = useState('Mathematics');
  const [taskDuration, setTaskDuration] = useState(25);
  const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

  // Focus Timer Tick effect
  useEffect(() => {
    let interval: any = null;
    if (activeFocusSession && activeFocusSession.isRunning) {
      interval = setInterval(() => {
        tickFocusSession();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeFocusSession, tickFocusSession]);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    addStudyTask({
      studentId: '00000000-0000-0000-0000-000000000001',
      title: taskTitle,
      subject: taskSubject,
      scheduledDate: new Date().toISOString().slice(0, 10),
      durationMin: Number(taskDuration),
      status: 'pending',
      priority: taskPriority,
    });
    setTaskTitle('');
    setAddOpen(false);
  };

  const focusMins = activeFocusSession
    ? Math.floor(activeFocusSession.remainingSeconds / 60)
    : 25;
  const focusSecs = activeFocusSession
    ? activeFocusSession.remainingSeconds % 60
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Smart Study Planner
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Focus sessions, adaptive scheduling, and personalized study tasks.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddOpen(true)}
        >
          Add Study Task
        </Button>
      </div>

      {/* Focus Session Pomodoro Card */}
      <Card className="p-6 bg-gradient-to-r from-brand-surface to-brand-violet/15 border border-brand-violet/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-md">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-violet" />
              <span className="text-xs font-bold text-brand-violet uppercase tracking-wider">
                Focus Studio
              </span>
            </div>
            <h3 className="text-lg font-bold text-brand-white font-heading">
              {activeFocusSession?.subject
                ? `${activeFocusSession.subject}: ${activeFocusSession.topic || 'Dedicated Study'}`
                : 'Deep Focus Session'}
            </h3>
            <p className="text-xs text-brand-muted">
              Choose a duration, eliminate distractions, and make steady academic progress.
            </p>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 pt-2">
              {[15, 25, 40, 50].map((mins) => (
                <button
                  key={mins}
                  onClick={() => startFocusSession(mins, 'Mathematics', 'Fractions')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors ${
                    activeFocusSession?.durationMin === mins
                      ? 'bg-brand-violet text-white'
                      : 'bg-white/5 text-brand-muted hover:text-brand-white'
                  }`}
                >
                  {mins} min
                </button>
              ))}
            </div>
          </div>

          {/* Timer Display */}
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="text-4xl md:text-5xl font-mono font-extrabold text-brand-white tracking-widest bg-brand-surface/90 px-6 py-3 rounded-2xl border border-brand-borderSubtle shadow-inner">
              {focusMins.toString().padStart(2, '0')}:{focusSecs.toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-2">
              {activeFocusSession && activeFocusSession.isRunning ? (
                <Button
                  variant="danger"
                  size="sm"
                  icon={<Pause className="w-4 h-4" />}
                  onClick={stopFocusSession}
                >
                  End Session
                </Button>
              ) : (
                <Button
                  variant="cyan"
                  size="sm"
                  icon={<Play className="w-4 h-4" />}
                  onClick={() => startFocusSession(25, 'Mathematics', 'Fractions')}
                >
                  Start 25m Focus
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Task Checklist */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-brand-white font-heading">
            Today's Planned Study Tasks ({studyTasks.filter((t) => t.status === 'pending').length} pending)
          </h2>
          <span className="text-xs text-brand-dim">
            Adaptive rescheduling active
          </span>
        </div>

        <div className="space-y-2.5">
          {studyTasks.map((task) => {
            const isDone = task.status === 'done';

            return (
              <Card
                key={task.id}
                className={`p-4 flex items-center justify-between transition-all ${
                  isDone ? 'opacity-60 bg-white/2' : 'border-brand-borderSubtle hover:border-brand-cyan/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleStudyTaskStatus(task.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                      isDone
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                        : 'border-brand-dim hover:border-brand-cyan text-transparent'
                    }`}
                  >
                    <CheckSquare className="w-4 h-4" />
                  </button>
                  <div>
                    <span
                      className={`text-xs font-bold block ${
                        isDone ? 'line-through text-brand-muted' : 'text-brand-white'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className="text-[11px] text-brand-dim">
                      {task.subject} • {task.durationMin} mins • Scheduled {task.scheduledDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'amber' : 'neutral'}
                    size="sm"
                  >
                    {task.priority}
                  </Badge>
                  {!isDone && (
                    <Button
                      variant="surface"
                      size="xs"
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        rescheduleTask(task.id, tomorrow.toISOString().slice(0, 10));
                      }}
                    >
                      Move to Tomorrow
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create Study Task"
        description="Add a focused learning task to your daily study routine."
      >
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Description"
            placeholder="e.g. Solve 5 problems on Fraction Addition"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">Subject</label>
              <select
                value={taskSubject}
                onChange={(e) => setTaskSubject(e.target.value)}
                className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-cyan"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="General Science">General Science</option>
                <option value="English">English</option>
                <option value="Kannada">Kannada</option>
              </select>
            </div>
            <Input
              type="number"
              label="Duration (Minutes)"
              value={taskDuration}
              onChange={(e) => setTaskDuration(Number(e.target.value))}
              min={5}
              max={120}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Priority</label>
            <select
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value as any)}
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-cyan"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Task
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
