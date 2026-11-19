import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Award,
  Calendar,
  Volume2,
  VolumeX,
  CheckCircle2,
  LogOut,
  Sparkles,
  ArrowRight,
  KeyRound,
  Lock,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Badge, ProgressRing, Modal, Input } from '../../components/ui';
import { audioPlaybackService } from '../../services/audioPlayback';

export const GuardianDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { guardianProfile, logout } = useAuthStore();
  const [playingReport, setPlayingReport] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const handlePlaySpokenReport = () => {
    if (playingReport) {
      audioPlaybackService.stop();
      setPlayingReport(false);
      return;
    }

    setPlayingReport(true);
    audioPlaybackService.speakText({
      text: 'ನಮಸ್ಕಾರ, ಅನನ್ಯಾ ಈ ವಾರ ಗಣಿತ ಮತ್ತು ವಿಜ್ಞಾನದಲ್ಲಿ ಅತ್ಯುತ್ತಮ ಪ್ರಗತಿ ಸಾಧಿಸಿದ್ದಾರೆ. ಭಿನ್ನರಾಶಿಗಳ ಪರಿಕಲ್ಪನೆಯನ್ನು ಚೆನ್ನಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದಾರೆ. ಮುಂದಿನ ವಾರ ಮಾರ್ಚ್ ೨೪ ರಂದು ಮಧ್ಯಂತರ ಪರೀಕ್ಷೆ ಇರುತ್ತದೆ. ದಿನವೂ ನಿಯಮಿತವಾಗಿ ಕಲಿಯುತ್ತಿದ್ದಾರೆ.',
      languageCode: 'kn-IN',
      onEnd: () => setPlayingReport(false),
    });
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setResetModalOpen(false);
      setNewPassword('');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white p-6 md:p-10 font-sans max-w-6xl mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-borderSubtle">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-blue flex items-center justify-center font-bold text-white shadow-lg">
            👨‍👩‍👧
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-brand-white font-heading">
              Parent & Guardian Portal
            </h1>
            <p className="text-xs text-brand-muted">
              Monitoring and supporting Ananya Sharma • Class 7 (Karnataka Board)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="surface"
            size="sm"
            onClick={() => navigate('/login')}
          >
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

      {/* DPDP Consent Status Notice */}
      <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-brand-white">
              Verified Guardian Consent (DPDP Act 2023 Compliant)
            </span>
            <p className="text-[11px] text-brand-dim">
              Verified by Ramesh Sharma on Jan 15, 2025. Private student conversations are shielded; only aggregate progress is visible.
            </p>
          </div>
        </div>
        <Badge variant="green" size="sm">Active Consent</Badge>
      </div>

      {/* Spoken Weekly Progress Report Audio Banner */}
      <Card className="p-6 bg-gradient-to-r from-brand-surface to-brand-blue/20 border border-brand-cyan/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">Family Voice Bridge</Badge>
              <span className="text-xs text-brand-dim">• Weekly Spoken Update in Kannada</span>
            </div>
            <h3 className="text-lg font-bold text-brand-white font-heading">
              Weekly Audio Learning Summary: March 11–18
            </h3>
            <p className="text-xs text-brand-muted">
              Listen to a 1-minute parent-friendly spoken report detailing Ananya's math improvement, science lab prep, and upcoming midterm dates.
            </p>
          </div>

          <div className="shrink-0">
            <Button
              variant={playingReport ? 'surface' : 'cyan'}
              size="md"
              icon={playingReport ? <VolumeX className="w-4 h-4 text-brand-cyan" /> : <Volume2 className="w-4 h-4" />}
              onClick={handlePlaySpokenReport}
            >
              {playingReport ? 'Stop Audio' : 'Listen in Kannada'}
            </Button>
          </div>
        </div>
      </Card>

      {/* Child Academic Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-brand-white font-heading uppercase tracking-wider">
            Curriculum Mastery
          </h3>
          <div className="flex items-center justify-center py-2">
            <ProgressRing progress={81} size={84} strokeWidth={7} />
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-brand-muted">Mathematics:</span>
              <span className="text-brand-cyan font-bold">78%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-muted">General Science:</span>
              <span className="text-emerald-400 font-bold">84%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-brand-muted">Kannada:</span>
              <span className="text-brand-violet font-bold">90%</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-brand-white font-heading uppercase tracking-wider">
            Study Habits & Dedication
          </h3>
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-white/2 rounded-xl">
              <span className="text-xs text-brand-dim block">Weekly Spoken Learning:</span>
              <span className="text-base font-extrabold text-brand-white">4.2 hours</span>
            </div>
            <div className="p-3 bg-white/2 rounded-xl">
              <span className="text-xs text-brand-dim block">Learning Consistency Streak:</span>
              <span className="text-base font-extrabold text-emerald-400">7 Consecutive Days</span>
            </div>
            <div className="p-3 bg-white/2 rounded-xl">
              <span className="text-xs text-brand-dim block">Completed Homework:</span>
              <span className="text-base font-extrabold text-brand-cyan">14 assignments</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-brand-white font-heading uppercase tracking-wider">
            Upcoming Key Events
          </h3>
          <div className="space-y-2.5 pt-1">
            <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
              <span className="text-xs font-bold text-brand-white block">
                Math Midterm Exam
              </span>
              <span className="text-[11px] text-brand-cyan font-semibold">March 24, 2025</span>
              <p className="text-[11px] text-brand-dim">Covers Fractions, Integers, Simple Equations.</p>
            </div>
            <div className="p-3 bg-white/2 border border-white/5 rounded-xl space-y-1">
              <span className="text-xs font-bold text-brand-white block">
                Science Midterm Exam
              </span>
              <span className="text-[11px] text-brand-cyan font-semibold">March 28, 2025</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Student Account Credential Recovery Assistance */}
      <Card className="p-6 space-y-4 bg-brand-surfaceCard border-brand-borderSubtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-brand-white font-heading">
              Child Account Security & Recovery
            </h3>
            <p className="text-xs text-brand-muted">
              Learner ID: <strong className="text-brand-cyan font-mono">SL-8K4P92</strong>. If your child forgets their password or loses trusted device unlock, you can reset their access credentials securely from this portal.
            </p>
          </div>
          <Button
            variant="surface"
            size="sm"
            icon={<KeyRound className="w-4 h-4 text-brand-cyan" />}
            onClick={() => setResetModalOpen(true)}
          >
            Reset Password
          </Button>
        </div>
      </Card>

      {/* Reset Modal */}
      <Modal
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Reset Child Access Password"
        description="Issue a new password for Learner ID SL-8K4P92."
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <Input
            type="password"
            label="New Temporary Password"
            placeholder="Minimum 6 characters"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {resetSuccess && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Password successfully reset! Your child can now sign in.</span>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setResetModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Confirm Reset
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};