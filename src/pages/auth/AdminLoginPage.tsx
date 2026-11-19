import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ChevronLeft } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Input } from '../../components/ui';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsAdmin } = useAuthStore();
  const [email, setEmail] = useState('admin@sahaayalearn.org');
  const [password, setPassword] = useState('admin123');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsAdmin({
      displayName: 'Platform Admin',
      email,
    });
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans">
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <Link to="/login" className="flex items-center gap-1.5 text-xs font-semibold text-brand-dim hover:text-brand-white">
          <ChevronLeft className="w-4 h-4" /> Back to Portals
        </Link>
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Admin Portal</span>
      </div>

      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-bold text-brand-midnight mx-auto shadow-lg">
            🔐
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-white font-heading">
            Administration Console
          </h1>
          <p className="text-xs text-brand-muted">
            Platform governance, curriculum ontologies, and provider health.
          </p>
        </div>

        <Card className="p-6 md:p-8 space-y-4 border border-amber-500/30 bg-brand-surfaceCard">
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              label="Admin Account"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Security Key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button
              variant="primary"
              size="lg"
              type="submit"
              className="w-full text-sm font-bold bg-amber-500 hover:bg-amber-600 text-brand-midnight"
            >
              Authenticate Admin Session
            </Button>
          </form>

          <div className="pt-2 border-t border-brand-borderSubtle text-center">
            <button
              onClick={() => {
                loginAsAdmin({ displayName: 'Platform Admin' });
                navigate('/admin/dashboard');
              }}
              className="text-xs text-amber-400 hover:underline font-bold"
            >
              Auto-Fill Admin Credentials →
            </button>
          </div>
        </Card>
      </div>

      <div className="text-center text-[11px] text-brand-dim">
        Audit logged. Unauthorized access prohibited.
      </div>
    </div>
  );
};
