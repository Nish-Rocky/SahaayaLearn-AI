import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, Plus, Sparkles, Filter, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, Modal, Input } from '../../components/ui';

export const HomeworkPage: React.FC = () => {
  const navigate = useNavigate();
  const { homework, toggleHomeworkStatus, addHomework, deleteHomework } = useStudentStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [addOpen, setAddOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [dueDate, setDueDate] = useState('2025-03-22');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  const filtered = homework.filter((h) => {
    if (filter === 'pending') return h.status !== 'completed';
    if (filter === 'completed') return h.status === 'completed';
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addHomework({
      studentId: '00000000-0000-0000-0000-000000000001',
      title,
      subject,
      dueDate,
      status: 'not_started',
      priority,
      notes,
    });
    setTitle('');
    setNotes('');
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Homework & Assignments
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Track due dates, complete assignments, and receive step-by-step AI guidance.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddOpen(true)}
        >
          Add Homework
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'all'
              ? 'bg-brand-blue text-white'
              : 'bg-brand-surfaceCard text-brand-muted hover:text-brand-white'
          }`}
        >
          All ({homework.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'pending'
              ? 'bg-brand-blue text-white'
              : 'bg-brand-surfaceCard text-brand-muted hover:text-brand-white'
          }`}
        >
          Pending ({homework.filter((h) => h.status !== 'completed').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
            filter === 'completed'
              ? 'bg-brand-blue text-white'
              : 'bg-brand-surfaceCard text-brand-muted hover:text-brand-white'
          }`}
        >
          Completed ({homework.filter((h) => h.status === 'completed').length})
        </button>
      </div>

      {/* Homework List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isDone = item.status === 'completed';

          return (
            <Card
              key={item.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border transition-all ${
                isDone
                  ? 'opacity-65 bg-white/2 border-white/5'
                  : 'border-brand-borderSubtle hover:border-brand-cyan/30'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <button
                  onClick={() => toggleHomeworkStatus(item.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : 'border-brand-dim hover:border-brand-cyan text-transparent'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        isDone ? 'line-through text-brand-muted' : 'text-brand-white'
                      }`}
                    >
                      {item.title}
                    </span>
                    <Badge
                      variant={
                        item.priority === 'high'
                          ? 'red'
                          : item.priority === 'medium'
                          ? 'amber'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-brand-dim">
                    <span className="text-brand-cyan font-medium">{item.subject}</span>
                    <span>Due: {item.dueDate}</span>
                    {item.assignedBy && <span>Assigned by: {item.assignedBy}</span>}
                  </div>
                  {item.notes && (
                    <p className="text-xs text-brand-muted bg-white/2 p-2 rounded-lg border border-white/5 mt-1.5">
                      💡 {item.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                {!isDone && (
                  <Button
                    variant="cyan"
                    size="xs"
                    icon={<Sparkles className="w-3.5 h-3.5" />}
                    onClick={() =>
                      navigate(
                        `/student/ai-tutor?hw=${encodeURIComponent(item.title)}&subject=${encodeURIComponent(
                          item.subject
                        )}`
                      )
                    }
                  >
                    Solve with AI Guidance
                  </Button>
                )}
                <button
                  onClick={() => deleteHomework(item.id)}
                  className="p-1.5 text-brand-dim hover:text-red-400 rounded-lg hover:bg-white/5 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Homework / Assignment"
        description="Record your homework question or task with subject and deadline."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Question / Exercise Details"
            placeholder="e.g. Chapter 2 Exercise 2.3 Q1 to Q6"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
              >
                <option value="Mathematics">Mathematics</option>
                <option value="General Science">General Science</option>
                <option value="English">English</option>
                <option value="Kannada">Kannada</option>
                <option value="Social Science">Social Science</option>
              </select>
            </div>
            <Input
              type="date"
              label="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <Input
            label="Personal Notes or Teacher Instructions (Optional)"
            placeholder="e.g. Bring graph paper; draw diagrams neatly"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setAddOpen(false)}>
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
