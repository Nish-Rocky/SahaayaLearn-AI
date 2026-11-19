import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Badge, ProgressRing, Button } from '../../components/ui';

export const SubjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { subjects } = useStudentStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Subjects & Syllabus
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Official curriculum map for Class 7 • Karnataka State Board & NCERT aligned.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subjects.map((subject) => {
          const totalTopics = subject.chapters.reduce((acc, ch) => acc + ch.topics.length, 0);
          const demonstratedTopics = subject.chapters.reduce(
            (acc, ch) => acc + ch.topics.filter((t) => t.mastery === 'demonstrated').length,
            0
          );

          return (
            <Card
              key={subject.id}
              variant="interactive"
              className="p-6 flex flex-col justify-between space-y-4"
              onClick={() => navigate(`/student/subjects/${subject.id}`)}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="cyan" size="sm">{subject.chapters.length} Chapters</Badge>
                      <Badge variant="neutral" size="sm">{totalTopics} Topics</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-brand-white font-heading mt-1">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-brand-dim line-clamp-2">{subject.description}</p>
                  </div>
                  <ProgressRing progress={subject.masteryScore} size={54} strokeWidth={4} />
                </div>

                {/* Chapters Preview */}
                <div className="space-y-2 pt-4 mt-2 border-t border-brand-borderSubtle">
                  <span className="text-[11px] font-bold text-brand-dim uppercase tracking-wider block">
                    Curriculum Units
                  </span>
                  <div className="space-y-1.5">
                    {subject.chapters.slice(0, 3).map((ch) => (
                      <div
                        key={ch.id}
                        className="flex items-center justify-between text-xs p-2 bg-white/2 rounded-lg"
                      >
                        <span className="text-brand-white truncate">{ch.order}. {ch.title}</span>
                        <span className="text-brand-cyan text-[11px] font-bold shrink-0 ml-2">
                          {ch.completionPercent}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-brand-dim">
                  Teacher: <strong className="text-brand-muted">{subject.teacherName || 'Curriculum Team'}</strong>
                </span>
                <span className="text-xs font-bold text-brand-cyan flex items-center gap-1 hover:underline">
                  Explore Syllabus <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
