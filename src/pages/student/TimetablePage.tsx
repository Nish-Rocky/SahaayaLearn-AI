import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus, Calendar as CalendarIcon, MapPin, User, Trash2, Sparkles, BookOpen } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, Modal, Input, Tabs } from '../../components/ui';

export const TimetablePage: React.FC = () => {
  const navigate = useNavigate();
  const { timetable, addTimetableEntry, deleteTimetableEntry } = useStudentStore();
  const [activeDay, setActiveDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form state for adding class
  const [subject, setSubject] = useState('');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('09:45 AM');
  const [teacher, setTeacher] = useState('');
  const [room, setRoom] = useState('Room 7-A');
  const [day, setDay] = useState<'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday'>('Monday');

  const days = [
    { id: 'Monday', label: 'Monday' },
    { id: 'Tuesday', label: 'Tuesday' },
    { id: 'Wednesday', label: 'Wednesday' },
    { id: 'Thursday', label: 'Thursday' },
    { id: 'Friday', label: 'Friday' },
    { id: 'Saturday', label: 'Saturday' },
  ];

  const currentClasses = timetable.filter((t) => t.day === activeDay);

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;

    addTimetableEntry({
      day: day || activeDay,
      startTime: startTime || '09:00 AM',
      endTime: endTime || '09:45 AM',
      subject: subject.trim(),
      teacher: teacher.trim() || undefined,
      room: room.trim() || 'Room 7-A',
      color: 'blue',
    });

    setSubject('');
    setTeacher('');
    setAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Class Timetable
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Weekly school schedule for Class 7 • Track class timings, rooms, and subject teachers.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setDay(activeDay);
            setAddModalOpen(true);
          }}
        >
          Add Class Entry
        </Button>
      </div>

      {/* Day Selector Tabs */}
      <Tabs
        tabs={days}
        activeTab={activeDay}
        onChange={(id) => setActiveDay(id as any)}
        variant="pill"
      />

      {/* Classes for the Selected Day */}
      <div className="space-y-3">
        {currentClasses.length === 0 ? (
          <Card className="p-12 text-center">
            <Clock className="w-10 h-10 text-brand-dim mx-auto mb-3" />
            <p className="text-sm font-semibold text-brand-white">No classes scheduled for {activeDay}</p>
            <p className="text-xs text-brand-muted mt-1">Enjoy your self-directed study and revision time.</p>
          </Card>
        ) : (
          currentClasses.map((item) => (
            <Card
              key={item.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-brand-borderSubtle hover:border-brand-cyan/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-blue/15 border border-brand-blue/30 flex flex-col items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-brand-cyan" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-white">{item.subject}</span>
                    <Badge variant="cyan" size="sm">{item.room || 'Room 7-A'}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-brand-muted mt-1">
                    <span>{item.startTime} – {item.endTime}</span>
                    {item.teacher && (
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-brand-dim" /> {item.teacher}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="surface"
                  size="xs"
                  icon={<BookOpen className="w-3 h-3 text-brand-cyan" />}
                  onClick={() => navigate('/student/subjects')}
                >
                  Syllabus
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  icon={<Sparkles className="w-3 h-3 text-brand-cyan" />}
                  onClick={() => navigate(`/student/ai-tutor?topic=${encodeURIComponent(item.subject)}`)}
                >
                  Ask AI Tutor
                </Button>
                <button
                  type="button"
                  title="Remove from schedule"
                  onClick={() => deleteTimetableEntry(item.id)}
                  className="p-2 text-brand-dim hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add Timetable Class"
        description="Schedule a class period into your recurring weekly timetable."
      >
        <form onSubmit={handleSaveClass} className="space-y-3">
          <Input
            label="Subject Name"
            placeholder="e.g. Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Time"
              placeholder="e.g. 09:00 AM"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
            <Input
              label="End Time"
              placeholder="e.g. 09:45 AM"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Day of Week</label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value as any)}
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
            >
              {days.map((d) => (
                <option key={d.id} value={d.id}>{d.label}</option>
              ))}
            </select>
          </div>
          <Input
            label="Teacher Name"
            placeholder="e.g. Sunita Rao"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />
          <Input
            label="Room Number"
            placeholder="e.g. Room 7-A"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-3">
            <Button type="button" variant="ghost" onClick={() => setAddModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Save Class</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};