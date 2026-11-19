import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award,
  Calendar,
  Clock,
  Plus,
  Play,
  CheckCircle2,
  AlertTriangle,
  Brain,
  ShieldCheck,
} from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, Modal, Input, ProgressRing } from '../../components/ui';

export const ExamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { exams, addExam } = useStudentStore();
  const [addOpen, setAddOpen] = useState(false);
  const [mockGenOpen, setMockGenOpen] = useState(false);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('Mathematics');
  const [examDate, setExamDate] = useState('2025-03-24');
  const [totalMarks, setTotalMarks] = useState(50);
  const [durationMin, setDurationMin] = useState(90);

  const handleAddExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addExam({
      studentId: '00000000-0000-0000-0000-000000000001',
      name,
      subject,
      examDate,
      chapters: ['Chapter 1', 'Chapter 2'],
      totalMarks: Number(totalMarks),
      durationMin: Number(durationMin),
      prepStatus: 'in_progress',
      readinessPercentage: 75,
      unrevisedTopicsCount: 3,
    });
    setName('');
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Exams & Readiness Dashboard
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Exam countdowns, syllabus coverage, and AI mock examination generator.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="cyan"
            size="sm"
            icon={<Brain className="w-4 h-4" />}
            onClick={() => setMockGenOpen(true)}
          >
            Generate Mock Test
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => setAddOpen(true)}
          >
            Add Exam
          </Button>
        </div>
      </div>

      {/* Active Exam Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exams.map((ex) => {
          const daysLeft = Math.max(
            1,
            Math.ceil((new Date(ex.examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          );

          return (
            <Card
              key={ex.id}
              className="p-6 border border-brand-borderSubtle hover:border-brand-cyan/40 transition-all flex flex-col justify-between space-y-5"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="blue" size="sm">{daysLeft} Days Left</Badge>
                      <Badge variant="neutral" size="sm">{ex.totalMarks} Marks • {ex.durationMin}m</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-brand-white font-heading mt-1">
                      {ex.name}
                    </h3>
                    <span className="text-xs font-semibold text-brand-cyan">{ex.subject}</span>
                  </div>
                  <ProgressRing progress={ex.readinessPercentage} size={58} strokeWidth={5} />
                </div>

                {/* Exam readiness indicators */}
                <div className="space-y-2 pt-4 border-t border-brand-borderSubtle mt-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-muted">Date:</span>
                    <span className="text-brand-white font-bold">{ex.examDate}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-muted">Syllabus Covered:</span>
                    <span className="text-emerald-400 font-bold">{ex.chapters.join(', ')}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-brand-muted">Unrevised Topics:</span>
                    <span className="text-amber-300 font-bold">{ex.unrevisedTopicsCount} topics</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="surface"
                  size="xs"
                  onClick={() => navigate(`/student/ai-tutor?exam=${encodeURIComponent(ex.name)}`)}
                >
                  AI Revision Plan
                </Button>
                <Button
                  variant="cyan"
                  size="xs"
                  icon={<Play className="w-3.5 h-3.5" />}
                  onClick={() => setMockGenOpen(true)}
                >
                  Start Practice Test
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Mock Exam Generator Modal */}
      <Modal
        isOpen={mockGenOpen}
        onClose={() => setMockGenOpen(false)}
        title="Sahaaya AI Mock Test Generator"
        description="Generates an original exam-standard paper based on Class 7 Karnataka / NCERT blueprint."
      >
        <div className="space-y-4">
          <div className="p-3 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl flex items-center gap-2.5 text-xs text-brand-cyan">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              Exam Integrity Mode: AI tutor hints will be paused during this test. Detailed explanations will unlock upon submission.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Subject</label>
            <select className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan">
              <option value="Mathematics">Mathematics (Fractions, Integers, Simple Equations)</option>
              <option value="General Science">General Science (Nutrition, Heat, Chemical Changes)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">Question Count</label>
              <select className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan">
                <option value="10">10 Questions (Quick Review)</option>
                <option value="20">20 Questions (Standard Mock)</option>
                <option value="30">30 Questions (Full Paper)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">Time Limit</label>
              <select className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan">
                <option value="30">30 Minutes</option>
                <option value="60">60 Minutes</option>
                <option value="90">90 Minutes</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" onClick={() => setMockGenOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="cyan"
              icon={<Play className="w-4 h-4" />}
              onClick={() => {
                setMockGenOpen(false);
                navigate('/student/quizzes?mock=true');
              }}
            >
              Begin Timed Test
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Exam Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Schedule Upcoming Examination"
        description="Add your school examination date and syllabus to generate a study countdown."
      >
        <form onSubmit={handleAddExam} className="space-y-4">
          <Input
            label="Examination Name"
            placeholder="e.g. Midterm Mathematics Exam"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            label="Exam Date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              type="number"
              label="Total Marks"
              value={totalMarks}
              onChange={(e) => setTotalMarks(Number(e.target.value))}
            />
            <Input
              type="number"
              label="Duration (Minutes)"
              value={durationMin}
              onChange={(e) => setDurationMin(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Exam
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
