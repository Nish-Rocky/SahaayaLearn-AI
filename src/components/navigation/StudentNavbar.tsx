import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Mic,
  Calendar as CalendarIcon,
  Search,
  CheckCircle2,
  Sparkles,
  Flame,
} from 'lucide-react';
import { useUiStore } from '../../state/uiStore';
import { useAuthStore } from '../../state/authStore';
import { useStudentStore } from '../../state/studentStore';

export const StudentNavbar: React.FC = () => {
  const { openGlobalVoice, notifications, markAllNotificationsRead } = useUiStore();
  const { user, studentProfile } = useAuthStore();
  const { activeFocusSession } = useStudentStore();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const todayStr = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date());

  return (
    <header className="h-16 border-b border-brand-borderSubtle bg-brand-surface/80 backdrop-blur-md sticky top-0 z-20 px-6 flex items-center justify-between">
      {/* Left: Search & Quick Context */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-brand-dim absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search chapters, concepts, formulas, or notes..."
            className="w-full bg-brand-surfaceCard/70 border border-brand-borderSubtle rounded-xl pl-9 pr-4 py-2 text-xs text-brand-white placeholder-brand-dim focus:outline-none focus:border-brand-cyan/50 focus:ring-1 focus:ring-brand-cyan/20 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                navigate(`/student/ai-tutor?q=${encodeURIComponent((e.target as HTMLInputElement).value)}`);
              }
            }}
          />
        </div>
      </div>

      {/* Center: Active Focus Session Timer Pill (if active) */}
      {activeFocusSession && activeFocusSession.isRunning && (
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 bg-brand-violet/20 border border-brand-violet/40 rounded-full animate-pulse">
          <span className="w-2 h-2 rounded-full bg-brand-violet" />
          <span className="text-xs font-semibold text-brand-white">
            Focus: {Math.floor(activeFocusSession.remainingSeconds / 60)}:
            {(activeFocusSession.remainingSeconds % 60).toString().padStart(2, '0')}
          </span>
          <button
            onClick={() => navigate('/student/planner')}
            className="text-[10px] text-brand-cyan hover:underline ml-1"
          >
            View
          </button>
        </div>
      )}

      {/* Right: Actions, Streaks, Notifications, Profile */}
      <div className="flex items-center gap-3">
        {/* Streak Indicator */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-xl cursor-pointer hover:bg-amber-500/15 transition-colors"
          onClick={() => navigate('/student/achievements')}
          title="7-Day Learning Streak Active!"
        >
          <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-amber-300">7 Days</span>
        </div>

        {/* Global Voice Assistant CTA Button */}
        <button
          onClick={() => openGlobalVoice()}
          className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-brand-cyan/20 to-brand-blue/20 hover:from-brand-cyan/30 hover:to-brand-blue/30 border border-brand-cyan/40 rounded-xl text-brand-white text-xs font-bold transition-all shadow-glow-cyan/20 group select-none"
        >
          <Mic className="w-4 h-4 text-brand-cyan group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Ask Voice Tutor</span>
        </button>

        {/* Today Date Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-brand-muted">
          <CalendarIcon className="w-3.5 h-3.5 text-brand-cyan" />
          <span>{todayStr}</span>
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-brand-dim hover:text-brand-white hover:bg-white/5 rounded-xl transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-brand-surfaceCard border border-brand-border/40 rounded-2xl shadow-2xl p-4 z-40 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-brand-borderSubtle mb-2">
                <span className="text-xs font-bold text-brand-white">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllNotificationsRead()}
                    className="text-[10px] text-brand-cyan hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-brand-dim py-4 text-center">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        if (n.link) navigate(n.link);
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-xl transition-colors cursor-pointer ${
                        n.read ? 'bg-white/2 hover:bg-white/5' : 'bg-brand-blue/10 border border-brand-blue/20'
                      }`}
                    >
                      <p className="text-xs font-bold text-brand-white">{n.title}</p>
                      <p className="text-[11px] text-brand-muted mt-0.5">{n.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar with Link to Profile */}
        <div
          onClick={() => navigate('/student/profile')}
          className="flex items-center gap-2 pl-2 border-l border-brand-borderSubtle cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center font-bold text-xs text-brand-midnight shadow-glow-cyan/20 group-hover:scale-105 transition-transform">
            {user?.displayName ? user.displayName.slice(0, 2).toUpperCase() : 'AS'}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-brand-white group-hover:text-brand-cyan transition-colors">
              {user?.displayName || 'Ananya Sharma'}
            </span>
            <span className="text-[10px] text-brand-dim">
              {studentProfile?.grade || 'Class 7'} • {studentProfile?.board || 'Karnataka'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
