import React, { useState } from 'react';
import { Calendar as CalendarIcon, Plus, Filter, AlertCircle } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, Modal, Input } from '../../components/ui';

export const CalendarPage: React.FC = () => {
  const { calendarEvents, addCalendarEvent } = useStudentStore();
  const [filterType, setFilterType] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2025-03-24');
  const [type, setType] = useState<'exam' | 'assignment' | 'study' | 'holiday' | 'revision'>('exam');
  const [subject, setSubject] = useState('Mathematics');

  const filteredEvents = calendarEvents.filter((ev) =>
    filterType === 'all' ? true : ev.type === filterType
  );

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    addCalendarEvent({
      title,
      date,
      type,
      subject,
    });
    setTitle('');
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Academic Calendar
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Track exam countdowns, homework deadlines, holidays, and revision dates.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddOpen(true)}
        >
          Add Event
        </Button>
      </div>

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {['all', 'exam', 'assignment', 'revision', 'study', 'holiday'].map((f) => (
          <button
            key={f}
            onClick={() => setFilterType(f)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize transition-colors ${
              filterType === f
                ? 'bg-brand-blue text-white'
                : 'bg-brand-surfaceCard text-brand-muted hover:text-brand-white'
            }`}
          >
            {f === 'all' ? 'All Events' : `${f}s`}
          </button>
        ))}
      </div>

      {/* Calendar Event Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((ev) => (
          <Card
            key={ev.id}
            className="p-5 flex items-start justify-between border border-brand-borderSubtle hover:border-brand-cyan/30 transition-all"
          >
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0 border ${
                  ev.type === 'exam'
                    ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                    : ev.type === 'assignment'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                    : ev.type === 'holiday'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-brand-violet/15 border-brand-violet/30 text-brand-violet'
                }`}
              >
                <span className="text-[10px] font-bold uppercase">{ev.date.slice(5, 7)}</span>
                <span className="text-base font-extrabold leading-none">{ev.date.slice(8, 10)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-brand-white">{ev.title}</span>
                  <Badge
                    variant={
                      ev.type === 'exam'
                        ? 'blue'
                        : ev.type === 'assignment'
                        ? 'amber'
                        : ev.type === 'holiday'
                        ? 'green'
                        : 'purple'
                    }
                    size="sm"
                  >
                    {ev.type}
                  </Badge>
                </div>
                <p className="text-[11px] text-brand-dim">
                  {ev.subject ? `${ev.subject} • ` : ''}{ev.time || 'All Day'}
                  {ev.description ? ` • ${ev.description}` : ''}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Calendar Event"
        description="Schedule an exam date, homework submission or study target."
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Event Title"
            placeholder="e.g. Science Midterm Exam"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="date"
            label="Event Date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Event Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
            >
              <option value="exam">Examination</option>
              <option value="assignment">Assignment Due</option>
              <option value="revision">Spaced Revision</option>
              <option value="study">Study Session</option>
              <option value="holiday">Holiday</option>
            </select>
          </div>
          <Input
            label="Subject (Optional)"
            placeholder="e.g. General Science"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
