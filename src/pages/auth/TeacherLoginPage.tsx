import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Briefcase, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Input } from '../../components/ui';

export const TeacherLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsTeacher } = useAuthStore();
  const [email, setEmail] = useState('sunita.rao@adarshaschool.edu.in');
  const [password, setPassword] = useState('teacher123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsTeacher({
      displayName: 'Sunita Rao',
      email,
    });
    navigate('/teacher/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans">
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <Link to="/login" className="flex items-center gap-1.5 text-xs font-semibold text-brand-dim hover:text-brand-white">
          <ChevronLeft className="w-4 h-4" /> Back to Portals
        </Link>
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Teacher Portal</span>
      </div>

      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-white mx-auto shadow-lg">
            👩‍🏫
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-white font-heading">
            Teacher Sign In
          </h1>
          <p className="text-xs text-brand-muted">
            Institutional classroom management & class learning analytics.
          </p>
        </div>

        <Card className="p-6 md:p-8 space-y-4 border border-emerald-500/30 bg-brand-surfaceCard">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Institutional Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full text-sm font-bold bg-emerald-600 hover:bg-emerald-500"
            >
              Sign In to Classroom Portal
            </Button>
          </form>

          <div className="pt-2 border-t border-brand-borderSubtle text-center">
            <button
              onClick={() => {
                loginAsTeacher({ displayName: 'Sunita Rao' });
                navigate('/teacher/dashboard');
              }}
              className="text-xs text-emerald-400 hover:underline font-bold"
            >
              Auto-Fill Demo Teacher Account →
            </button>
          </div>
        </Card>
      </div>

      <div className="text-center text-[11px] text-brand-dim">
        Verified institutional registration required for public deployment.
      </div>
    </div>
  );
};
