import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Plus,
  CheckCircle2,
  AlertCircle,
  LogOut,
  FileText,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Badge, Modal, Input } from '../../components/ui';

interface Assignment {
  id: string;
  title: string;
  classId: string;
  className: string;
  dueDate: string;
  submittedCount: number;
  totalStudents: number;
  status: 'active' | 'completed';
}

export const TeacherDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { teacherProfile, logout } = useAuthStore();

  const [classes, setClasses] = useState(
    teacherProfile?.classes || [
      { id: 'c-7a', name: 'Class 7-A', grade: 'Class 7', subject: 'Mathematics', studentCount: 38 },
      { id: 'c-8b', name: 'Class 8-B', grade: 'Class 8', subject: 'Mathematics', studentCount: 42 },
    ]
  );

  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: 'asg-1',
      title: 'Exercise 2.3: Fraction Division Word Problems',
      classId: 'c-7a',
      className: 'Class 7-A',
      dueDate: '2025-03-21',
      submittedCount: 28,
      totalStudents: 38,
      status: 'active',
    },
    {
      id: 'asg-2',
      title: 'Chapter 1: Integer Rules Diagnostic Quiz',
      classId: 'c-7a',
      className: 'Class 7-A',
      dueDate: '2025-03-15',
      submittedCount: 37,
      totalStudents: 38,
      status: 'completed',
    },
  ]);

  // Modal states
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [manageClassModalOpen, setManageClassModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(classes[0]);

  // Form state for assignment
  const [newTitle, setNewTitle] = useState('');
  const [targetClassId, setTargetClassId] = useState(classes[0]?.id || 'c-7a');
  const [newDueDate, setNewDueDate] = useState('2025-03-25');
  const [newDescription, setNewDescription] = useState('');

  const mockStudents = [
    { id: 's-1', name: 'Ananya Sharma', mastery: 84, focusArea: 'Reciprocals & Decimals', status: 'On Track' },
    { id: 's-2', name: 'Rohan Desai', mastery: 72, focusArea: 'Denominator LCM', status: 'Needs Practice' },
    { id: 's-3', name: 'Priya Hegde', mastery: 91, focusArea: 'Algebraic Expressions', status: 'Excelling' },
    { id: 's-4', name: 'Kiran Kumar', mastery: 68, focusArea: 'Negative Signs', status: 'Intervention' },
    { id: 's-5', name: 'Sneha Patil', mastery: 88, focusArea: 'Word Problems', status: 'On Track' },
  ];

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const targetClass = classes.find((c) => c.id === targetClassId) || classes[0];

    const newAsg: Assignment = {
      id: `asg-${Date.now()}`,
      title: newTitle.trim(),
      classId: targetClass.id,
      className: targetClass.name,
      dueDate: newDueDate,
      submittedCount: 0,
      totalStudents: targetClass.studentCount,
      status: 'active',
    };

    setAssignments([newAsg, ...assignments]);
    setNewTitle('');
    setNewDescription('');
    setAssignModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white p-6 md:p-10 font-sans max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white shadow-lg">
            👩‍🏫
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-brand-white font-heading">
              Teacher Classroom Portal
            </h1>
            <p className="text-xs text-brand-muted">
              {teacherProfile?.displayName || 'Sunita Rao'} • Adarsha Vidyalaya, Bengaluru
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="surface" size="sm" onClick={() => navigate('/login')}>
            Switch Portal
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<LogOut className="w-4 h-4" />}
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign Out
          </Button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {classes.map((cls) => (
          <Card key={cls.id} className="p-6 space-y-4 border border-brand-borderSubtle hover:border-brand-cyan/40 transition-all">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="cyan" size="sm">{cls.grade}</Badge>
                <h3 className="text-lg font-bold text-brand-white font-heading mt-1">{cls.name}</h3>
                <span className="text-xs text-brand-dim">{cls.subject} • {cls.studentCount} Enrolled Students</span>
              </div>
              <Button
                variant="primary"
                size="xs"
                onClick={() => {
                  setSelectedClass(cls);
                  setManageClassModalOpen(true);
                }}
              >
                Manage Class
              </Button>
            </div>

            <div className="p-3 bg-white/2 rounded-xl text-xs space-y-1">
              <span className="font-bold text-brand-cyan block">Common Class Learning Gap:</span>
              <p className="text-brand-muted">
                14 students in {cls.name} struggled with Fraction Division reciprocals on the last check. Remediation lesson recommended.
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Class Assignments Management */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-brand-white font-heading">Active Class Assignments</h3>
            <p className="text-xs text-brand-muted mt-0.5">Track submission rates and assign homework to cohorts.</p>
          </div>
          <Button
            variant="cyan"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAssignModalOpen(true)}
          >
            Assign Homework
          </Button>
        </div>

        <div className="space-y-2.5">
          {assignments.map((asg) => (
            <div
              key={asg.id}
              className="p-3.5 bg-white/2 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-white/5"
            >
              <div>
                <span className="text-xs font-bold text-brand-white block">
                  {asg.title}
                </span>
                <span className="text-[11px] text-brand-dim">
                  {asg.className} • Due {asg.dueDate} • {asg.submittedCount}/{asg.totalStudents} Submitted
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={asg.status === 'active' ? 'green' : 'neutral'} size="sm">
                  {asg.status === 'active' ? 'Active' : 'Completed'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Assign Homework Modal */}
      <Modal
        isOpen={assignModalOpen}
        onClose={() => setAssignModalOpen(false)}
        title="Assign Homework to Cohort"
        description="Create an assignment for your class with automatic conceptual checking."
      >
        <form onSubmit={handleCreateAssignment} className="space-y-3">
          <Input
            label="Assignment Title"
            placeholder="e.g. Exercise 2.4: Word Problems on Decimals"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Target Class</label>
            <select
              value={targetClassId}
              onChange={(e) => setTargetClassId(e.target.value)}
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} ({c.subject})</option>
              ))}
            </select>
          </div>
          <Input
            type="date"
            label="Due Date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Instructions & Topic Focus</label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Students should solve questions 1 through 8 showing step-by-step reasoning..."
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Assignment
            </Button>
          </div>
        </form>
      </Modal>

      {/* Manage Class Modal */}
      <Modal
        isOpen={manageClassModalOpen}
        onClose={() => setManageClassModalOpen(false)}
        title={`Class Roster: ${selectedClass?.name}`}
        description={`${selectedClass?.studentCount} Enrolled Students • Real-time conceptual mastery breakdown.`}
      >
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {mockStudents.map((s) => (
            <div
              key={s.id}
              className="p-3 bg-white/2 rounded-xl flex items-center justify-between border border-white/5"
            >
              <div>
                <span className="text-xs font-bold text-brand-white block">{s.name}</span>
                <span className="text-[11px] text-brand-dim">Focus: {s.focusArea}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-cyan">{s.mastery}%</span>
                <Badge
                  variant={s.status === 'Excelling' ? 'green' : s.status === 'On Track' ? 'cyan' : 'amber'}
                  size="sm"
                >
                  {s.status}
                </Badge>
              </div>
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button variant="ghost" onClick={() => setManageClassModalOpen(false)}>
              Close Roster
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};