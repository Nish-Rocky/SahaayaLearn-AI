import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  Sparkles,
  Play,
  Layers,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { useUiStore } from '../../state/uiStore';
import { Card, Button, Badge, ProgressRing } from '../../components/ui';

export const SubjectDetailPage: React.FC = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const { subjects } = useStudentStore();
  const { openGlobalVoice } = useUiStore();

  const subject = subjects.find((s) => s.id === subjectId) || subjects[0];
  const [expandedChapter, setExpandedChapter] = useState<string>(subject.chapters[0]?.id || '');

  return (
    <div className="space-y-6">
      {/* Back button & Subject Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/student/subjects')}
          className="p-2 bg-brand-surfaceCard hover:bg-brand-surfaceElevated border border-brand-borderSubtle rounded-xl text-brand-dim hover:text-brand-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
              {subject.grade} • {subject.board}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            {subject.name}
          </h1>
        </div>
      </div>

      {/* Overview Stat Banner */}
      <Card className="p-6 bg-gradient-to-r from-brand-surface to-brand-blue/15 border border-brand-border/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <p className="text-xs text-brand-muted leading-relaxed">{subject.description}</p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Badge variant="cyan" size="sm">{subject.chapters.length} Chapters</Badge>
              <Badge variant="blue" size="sm">Teacher: {subject.teacherName || 'Assigned'}</Badge>
              <Badge variant="green" size="sm">Active Syllabus 2025–26</Badge>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-right">
              <span className="text-xs text-brand-dim block">Overall Mastery</span>
              <span className="text-xl font-extrabold text-brand-cyan">{subject.masteryScore}%</span>
            </div>
            <ProgressRing progress={subject.masteryScore} size={64} strokeWidth={5} />
          </div>
        </div>
      </Card>

      {/* Chapters & Topics Accordion */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-brand-white font-heading">
          Chapter Syllabus & Learning Objectives
        </h2>

        {subject.chapters.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;

          return (
            <Card
              key={chapter.id}
              className={`p-6 transition-all duration-200 border ${
                isExpanded ? 'border-brand-cyan/40 bg-brand-surfaceCard' : 'border-brand-borderSubtle hover:border-brand-border'
              }`}
            >
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedChapter(isExpanded ? '' : chapter.id)}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-cyan">Chapter {chapter.order}</span>
                    <span className="text-xs text-brand-dim">• {chapter.topics.length} Topics</span>
                  </div>
                  <h3 className="text-base font-bold text-brand-white font-heading">
                    {chapter.title}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-brand-muted">
                    {chapter.completionPercent}% complete
                  </span>
                  <div className="w-20 bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-brand-cyan h-full rounded-full transition-all duration-500"
                      style={{ width: `${chapter.completionPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-5 pt-4 border-t border-brand-borderSubtle space-y-4 animate-in fade-in">
                  {/* Learning Objectives */}
                  {chapter.learningObjectives && chapter.learningObjectives.length > 0 && (
                    <div className="p-3 bg-white/2 rounded-xl border border-white/5 space-y-1.5">
                      <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                        Learning Objectives
                      </span>
                      <ul className="space-y-1">
                        {chapter.learningObjectives.map((obj, i) => (
                          <li key={i} className="text-xs text-brand-dim flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-brand-cyan" />
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Topics List */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider block">
                      Topics & Practice Status
                    </span>
                    {chapter.topics.map((topic) => (
                      <div
                        key={topic.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-brand-surface rounded-xl border border-brand-borderSubtle gap-3"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-brand-white">
                              {topic.title}
                            </span>
                            <Badge
                              variant={
                                topic.mastery === 'demonstrated'
                                  ? 'green'
                                  : topic.mastery === 'developing'
                                  ? 'cyan'
                                  : topic.mastery === 'needs_revision'
                                  ? 'red'
                                  : 'neutral'
                              }
                              size="sm"
                            >
                              {topic.mastery.replace('_', ' ')}
                            </Badge>
                          </div>
                          {topic.summary && (
                            <p className="text-[11px] text-brand-dim">{topic.summary}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="surface"
                            size="xs"
                            icon={<Sparkles className="w-3.5 h-3.5 text-brand-cyan" />}
                            onClick={() =>
                              navigate(
                                `/student/ai-tutor?topic=${encodeURIComponent(topic.title)}&subject=${encodeURIComponent(
                                  subject.name
                                )}`
                              )
                            }
                          >
                            Explain
                          </Button>
                          <Button
                            variant="primary"
                            size="xs"
                            icon={<Play className="w-3.5 h-3.5" />}
                            onClick={() =>
                              navigate(
                                `/student/quizzes?topic=${encodeURIComponent(topic.title)}&subject=${encodeURIComponent(
                                  subject.name
                                )}`
                              )
                            }
                          >
                            Practise
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
