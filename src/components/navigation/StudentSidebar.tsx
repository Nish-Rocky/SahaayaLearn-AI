import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Mic,
  GraduationCap,
  Compass,
  BookOpen,
  Calendar,
  Clock,
  CheckSquare,
  FileText,
  Layers,
  Award,
  BarChart3,
  Network,
  Dna,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Users,
} from 'lucide-react';
import { useUiStore } from '../../state/uiStore';
import { useAuthStore } from '../../state/authStore';
import { useStudentStore } from '../../state/studentStore';

interface NavSection {
  title: string;
  items: Array<{
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: string | number;
    badgeColor?: string;
  }>;
}

export const StudentSidebar: React.FC = () => {
  const { sidebarCollapsed, collapseSidebar, openGlobalVoice } = useUiStore();
  const { user, studentProfile, logout } = useAuthStore();
  const { homework, flashcards } = useStudentStore();
  const navigate = useNavigate();

  const pendingHomeworkCount = homework.filter((h) => h.status !== 'completed').length;
  const dueFlashcardsCount = flashcards.length;

  const sections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        {
          path: '/student/dashboard',
          label: 'Overview',
          icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'AI LEARNING',
      items: [
        {
          path: '/student/ai-tutor',
          label: 'Personal AI Tutor',
          icon: <Sparkles className="w-4 h-4 shrink-0 text-brand-cyan" />,
          badge: 'AI',
          badgeColor: 'bg-brand-cyan/20 text-brand-cyan',
        },
        {
          path: '/student/voice-tutor',
          label: 'Voice Assistant',
          icon: <Mic className="w-4 h-4 shrink-0 text-brand-violet" />,
        },
        {
          path: '/student/teach-back',
          label: 'Teach-Back Studio',
          icon: <GraduationCap className="w-4 h-4 shrink-0" />,
        },
        {
          path: '/student/life-to-lesson',
          label: 'Life-to-Lesson',
          icon: <Compass className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'MY ACADEMICS',
      items: [
        {
          path: '/student/subjects',
          label: 'Subjects & Syllabus',
          icon: <BookOpen className="w-4 h-4 shrink-0" />,
        },
        {
          path: '/student/timetable',
          label: 'Class Timetable',
          icon: <Clock className="w-4 h-4 shrink-0" />,
        },
        {
          path: '/student/calendar',
          label: 'Academic Calendar',
          icon: <Calendar className="w-4 h-4 shrink-0" />,
        },
        {
          path: '/student/planner',
          label: 'Smart Study Planner',
          icon: <CheckSquare className="w-4 h-4 shrink-0" />,
        },
        {
          path: '/student/homework',
          label: 'Homework & Tasks',
          icon: <CheckSquare className="w-4 h-4 shrink-0" />,
          badge: pendingHomeworkCount > 0 ? pendingHomeworkCount : undefined,
          badgeColor: 'bg-amber-500/20 text-amber-300',
        },
        {
          path: '/student/exams',
          label: 'Exams & Readiness',
          icon: <Award className="w-4 h-4 shrink-0" />,
          badge: 'Midterm',
          badgeColor: 'bg-blue-500/20 text-blue-300',
        },
      ],
    },
    {
      title: 'STUDY STUDIO',
      items: [
        {
          path: '/student/notes',
          label: 'Smart Notebook',
          icon: <FileText className="w-4 h-4 shrink-0" />,
        },
        {
          path: '/student/flashcards',
          label: 'Memory Flashcards',
          icon: <Layers className="w-4 h-4 shrink-0" />,
          badge: dueFlashcardsCount > 0 ? `${dueFlashcardsCount}` : undefined,
          badgeColor: 'bg-emerald-500/20 text-emerald-300',
        },
      ],
    },
    {
      title: 'ASSESSMENTS & PROGRESS',
      items: [
        {
          path: '/student/mistake-dna',
          label: 'Mistake DNA & X-Ray',
          icon: <Dna className="w-4 h-4 shrink-0 text-brand-cyan" />,
        },
        {
          path: '/student/concept-galaxy',
          label: 'Concept Galaxy',
          icon: <Network className="w-4 h-4 shrink-0 text-brand-violet" />,
        },
        {
          path: '/student/progress',
          label: 'Analytics & Twin',
          icon: <BarChart3 className="w-4 h-4 shrink-0" />,
        },
        {
          path: '/student/achievements',
          label: 'Goals & Badges',
          icon: <Award className="w-4 h-4 shrink-0" />,
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        {
          path: '/student/profile',
          label: 'Profile & Settings',
          icon: <Settings className="w-4 h-4 shrink-0" />,
        },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col bg-brand-surface/95 backdrop-blur-md border-r border-brand-borderSubtle transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-brand-borderSubtle shrink-0">
        <NavLink to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-cyan to-brand-blue flex items-center justify-center shrink-0 shadow-glow-cyan/40">
            <span className="text-brand-midnight font-extrabold text-lg">S</span>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-base tracking-tight text-brand-white leading-none">
                Sahaaya<span className="text-brand-cyan">Learn</span>
              </span>
              <span className="text-[10px] text-brand-dim tracking-wider font-semibold uppercase mt-0.5">
                Academic OS
              </span>
            </div>
          )}
        </NavLink>
        <button
          onClick={collapseSidebar}
          className="text-brand-dim hover:text-brand-white p-1 rounded-lg hover:bg-white/5 transition-colors"
          title={sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Voice Prompt Action Pill */}
      {!sidebarCollapsed && (
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => openGlobalVoice()}
            className="w-full flex items-center justify-between px-3 py-2 bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20 hover:from-brand-cyan/30 hover:to-brand-blue/30 border border-brand-cyan/30 rounded-xl text-left transition-all group shadow-sm"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan animate-pulse" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-brand-white group-hover:text-brand-cyan transition-colors">
                  Ask Sahaaya
                </span>
                <span className="text-[10px] text-brand-dim">Speak in Kannada, Hindi or English</span>
              </div>
            </div>
            <Mic className="w-4 h-4 text-brand-cyan shrink-0" />
          </button>
        </div>
      )}

      {/* Navigation Links Scroll Container */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            {!sidebarCollapsed && (
              <p className="px-3 text-[10px] font-bold text-brand-dim tracking-wider uppercase">
                {section.title}
              </p>
            )}
            {section.items.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group relative ${
                    isActive
                      ? 'bg-brand-blue/20 text-brand-cyan border border-brand-cyan/30 shadow-sm'
                      : 'text-brand-muted hover:text-brand-white hover:bg-white/5'
                  } ${sidebarCollapsed ? 'justify-center px-0' : ''}`
                }
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!sidebarCollapsed && <span className="truncate flex-1">{item.label}</span>}
                {!sidebarCollapsed && item.badge && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold shrink-0 ${
                      item.badgeColor || 'bg-white/10 text-brand-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* Student Profile & Quick Switch Footer */}
      <div className="p-3 border-t border-brand-borderSubtle bg-brand-surfaceElevated/40 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-violet flex items-center justify-center font-bold text-xs text-white shrink-0">
              {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AS'}
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-brand-white truncate">
                  {user?.displayName || 'Ananya Sharma'}
                </span>
                <span className="text-[10px] text-brand-dim truncate">
                  {studentProfile?.grade || 'Class 7'} • {studentProfile?.board || 'Karnataka'}
                </span>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => navigate('/login')}
                className="p-1.5 text-brand-dim hover:text-brand-cyan hover:bg-white/5 rounded-lg transition-colors"
                title="Switch Portal / Profile"
              >
                <Users className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-1.5 text-brand-dim hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
