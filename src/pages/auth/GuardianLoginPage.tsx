import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Input } from '../../components/ui';

export const GuardianLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsGuardian } = useAuthStore();
  const [email, setEmail] = useState('ramesh.sharma@example.com');
  const [password, setPassword] = useState('parent123');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      loginAsGuardian({
        id: 'g-user-001',
        displayName: 'Ramesh Sharma',
        email,
      });
      setLoading(false);
      navigate('/guardian/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans">
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <Link to="/login" className="flex items-center gap-1.5 text-xs font-semibold text-brand-dim hover:text-brand-white">
          <ChevronLeft className="w-4 h-4" /> Back to Portals
        </Link>
        <span className="text-xs font-bold text-brand-violet uppercase tracking-wider">Parent Portal</span>
      </div>

      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-violet to-brand-blue flex items-center justify-center font-bold text-white mx-auto shadow-lg">
            👨‍👩‍👧
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-white font-heading">
            Parent & Guardian Sign In
          </h1>
          <p className="text-xs text-brand-muted">
            Family Voice Bridge • Monitor your child's learning journey and manage consent.
          </p>
        </div>

        <Card className="p-6 md:p-8 space-y-4 border border-brand-violet/30 bg-brand-surfaceCard">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Guardian Email"
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
              loading={loading}
              className="w-full text-sm font-bold bg-brand-violet hover:bg-violet-600"
            >
              Sign In to Guardian Portal
            </Button>
          </form>

          <div className="pt-2 border-t border-brand-borderSubtle text-center">
            <button
              onClick={() => {
                loginAsGuardian({ displayName: 'Ramesh Sharma' });
                navigate('/guardian/dashboard');
              }}
              className="text-xs text-brand-violet hover:underline font-bold"
            >
              Auto-Fill Demo Parent Account →
            </button>
          </div>
        </Card>
      </div>

      <div className="text-center text-[11px] text-brand-dim">
        DPDP 2023 Child Consent & Guardian Data Management.
      </div>
    </div>
  );
};
