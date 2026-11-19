import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { Card, Button, Input } from '../../components/ui';

export const ForgotPasswordPage: React.FC = () => {
  const [emailOrId, setEmailOrId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans">
      <div className="flex items-center justify-between max-w-md w-full mx-auto">
        <Link to="/student/login" className="flex items-center gap-1.5 text-xs font-semibold text-brand-dim hover:text-brand-white">
          <ChevronLeft className="w-4 h-4" /> Back to Student Login
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto my-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center font-bold text-brand-cyan mx-auto">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Account Recovery
          </h1>
          <p className="text-xs text-brand-muted">
            Recover access using your Student ID or linked guardian account.
          </p>
        </div>

        <Card className="p-6 md:p-8 space-y-4 border border-brand-borderSubtle bg-brand-surfaceCard">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Student ID or Registered Email"
                placeholder="e.g. SL-8K4P92 or student@example.com"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                required
              />
              <p className="text-xs text-brand-dim leading-relaxed">
                If your account was created with a Student ID, a recovery PIN will be sent to your linked parent/guardian's email and phone.
              </p>
              <Button variant="cyan" size="lg" type="submit" className="w-full text-sm font-bold">
                Send Recovery Instructions
              </Button>
            </form>
          ) : (
            <div className="space-y-3 text-center py-4">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <p className="text-sm font-bold text-brand-white">Recovery Instructions Dispatched</p>
              <p className="text-xs text-brand-dim">
                Check your linked parent email for the password reset or quick-unlock PIN link.
              </p>
              <Link to="/student/login" className="text-xs text-brand-cyan font-bold hover:underline block pt-2">
                Return to Login →
              </Link>
            </div>
          )}
        </Card>
      </div>

      <div className="text-center text-[11px] text-brand-dim">
        Guardian-Authorized Account Recovery (DPDP 2023 Compliant)
      </div>
    </div>
  );
};
