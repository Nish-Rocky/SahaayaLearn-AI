import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Shield, Globe, Bell, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Badge, Input } from '../../components/ui';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user, studentProfile, setStudentProfile, logout } = useAuthStore();

  const [displayName, setDisplayName] = useState(user?.displayName || 'Ananya Sharma');
  const [teachingLang, setTeachingLang] = useState(studentProfile?.teachingLanguage || 'kn-IN');
  const [academicLang, setAcademicLang] = useState(studentProfile?.academicLanguage || 'en-IN');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setStudentProfile({
      displayName,
      teachingLanguage: teachingLang,
      academicLanguage: academicLang,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-white font-heading">
          Student Profile & Settings
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Manage your personal learning preferences, language bridging, and privacy controls.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-4 border-b border-brand-borderSubtle">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center font-extrabold text-xl text-brand-midnight shadow-glow-cyan/20">
            {displayName.slice(0, 2).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-brand-white">{displayName}</h2>
            <p className="text-xs text-brand-dim">
              Learner ID: <span className="font-mono text-brand-cyan font-bold">{studentProfile?.learnerId || 'SL-8K4P92'}</span>
            </p>
            <p className="text-xs text-brand-muted">
              {studentProfile?.grade || 'Class 7'} • {studentProfile?.board || 'Karnataka State Board'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Preferred Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">
                AI Explanation Language
              </label>
              <select
                value={teachingLang}
                onChange={(e) => setTeachingLang(e.target.value)}
                className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
              >
                <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                <option value="hi-IN">हिन्दी (Hindi)</option>
                <option value="en-IN">English</option>
                <option value="te-IN">తెలుగు (Telugu)</option>
                <option value="ta-IN">தமிழ் (Tamil)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">
                Examination / Academic Language
              </label>
              <select
                value={academicLang}
                onChange={(e) => setAcademicLang(e.target.value)}
                className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
              >
                <option value="en-IN">English (Academic Terms)</option>
                <option value="kn-IN">ಕನ್ನಡ (Kannada Medium)</option>
                <option value="hi-IN">हिन्दी (Hindi Medium)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {saved ? (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Preferences Updated!
              </span>
            ) : <span />}

            <Button variant="primary" type="submit">
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* DPDP 2023 Child Privacy Card */}
      <Card className="p-6 space-y-3 bg-brand-surface border-brand-borderSubtle">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-cyan" />
          <h3 className="text-xs font-bold text-brand-white uppercase tracking-wider">
            Child Data Privacy & Guardian Protection (DPDP 2023)
          </h3>
        </div>
        <p className="text-xs text-brand-muted leading-relaxed">
          SahaayaLearn protects student privacy by default. Voice audio is processed ephemerally with zero permanent voiceprints. Guardian consent is verified and private student tutor conversations are not shared with third parties or advertisers.
        </p>
      </Card>

      {/* Account Switching & Sign Out */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="surface"
          onClick={() => navigate('/login')}
        >
          Switch Account / Portal
        </Button>

        <Button
          variant="danger"
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
  );
};
