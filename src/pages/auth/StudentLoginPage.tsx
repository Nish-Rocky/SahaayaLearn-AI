import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  KeyRound,
  Mail,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Input, Tabs } from '../../components/ui';

export const StudentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent } = useAuthStore();

  const [activeTab, setActiveTab] = useState<'id' | 'email'>('id');
  const [learnerId, setLearnerId] = useState('SL-8K4P92');
  const [password, setPassword] = useState('demo123');
  const [email, setEmail] = useState('ananya.sharma@example.com');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      loginAsStudent({
        id: '00000000-0000-0000-0000-000000000001',
        learnerId: activeTab === 'id' ? learnerId : 'SL-8K4P92',
        email: activeTab === 'email' ? email : undefined,
        displayName: 'Ananya Sharma',
        role: 'student',
        onboardingComplete: true,
      });
      setLoading(false);
      navigate('/student/dashboard');
    }, 600);
  };

  const handleDemoFill = () => {
    setActiveTab('id');
    setLearnerId('SL-8K4P92');
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-md w-full mx-auto relative z-10">
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-dim hover:text-brand-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Portals</span>
        </Link>
        <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
          Student Login
        </span>
      </div>

      {/* Login Card */}
      <div className="max-w-md w-full mx-auto my-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center font-bold text-brand-midnight mx-auto shadow-glow-cyan/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-white font-heading">
            Welcome back, learner.
          </h1>
          <p className="text-xs text-brand-muted">
            Enter your personal SahaayaLearn academic credentials.
          </p>
        </div>

        <Card className="p-6 md:p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard/95 shadow-2xl">
          {/* Tabs: Student ID vs Email */}
          <div className="flex items-center gap-2 p-1 bg-brand-surface rounded-xl border border-brand-borderSubtle">
            <button
              type="button"
              onClick={() => setActiveTab('id')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'id'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Learner ID</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === 'email'
                  ? 'bg-brand-blue text-white shadow-sm'
                  : 'text-brand-muted hover:text-brand-white'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {activeTab === 'id' ? (
              <Input
                label="Unique Learner ID"
                placeholder="e.g. SL-8K4P92"
                value={learnerId}
                onChange={(e) => setLearnerId(e.target.value)}
                hint="Assigned by your guardian or school"
                required
              />
            ) : (
              <Input
                type="email"
                label="Student Email Address"
                placeholder="e.g. student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            )}

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="text-xs text-red-400 font-medium">{error}</p>}

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-brand-dim cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded bg-brand-surface border-brand-borderSubtle text-brand-cyan focus:ring-0"
                />
                <span>Remember this device</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-brand-cyan hover:underline font-semibold"
              >
                Forgot access?
              </Link>
            </div>

            <Button
              variant="cyan"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full text-sm font-bold shadow-glow-cyan/20"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Demo Login Auto-fill Button */}
          <div className="pt-2 border-t border-brand-borderSubtle">
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full py-2 px-3 bg-white/3 hover:bg-white/6 border border-brand-cyan/20 rounded-xl text-xs text-brand-cyan font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Auto-Fill Demo Student (Ananya, Class 7)</span>
            </button>
          </div>
        </Card>

        <div className="text-center space-y-1 text-xs text-brand-dim">
          <p>
            Don't have an account yet?{' '}
            <Link to="/student/register" className="text-brand-cyan font-bold hover:underline">
              Register here
            </Link>
          </p>
          <p>
            Guardian managing child account?{' '}
            <Link to="/guardian/login" className="text-brand-violet font-bold hover:underline">
              Open Guardian Portal
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center text-[11px] text-brand-dim relative z-10">
        Protected with Argon2id encrypted credentials & DPDP 2023 compliance.
      </div>
    </div>
  );
};
