import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Input } from '../../components/ui';

export const StudentRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAsStudent, completeOnboarding } = useAuthStore();

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [grade, setGrade] = useState('Class 7');
  const [board, setBoard] = useState('Karnataka State Board');
  const [teachingLang, setTeachingLang] = useState('kn-IN');
  const [academicLang, setAcademicLang] = useState('en-IN');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    'Mathematics',
    'General Science',
  ]);

  const toggleSubject = (s: string) => {
    if (selectedSubjects.includes(s)) {
      setSelectedSubjects(selectedSubjects.filter((item) => item !== s));
    } else {
      setSelectedSubjects([...selectedSubjects, s]);
    }
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsStudent({
      displayName: displayName || 'Learner',
      email: email || undefined,
      role: 'student',
      onboardingComplete: true,
    });
    completeOnboarding({
      displayName: displayName || 'Learner',
      grade: grade as any,
      board: board as any,
      teachingLanguage: teachingLang,
      academicLanguage: academicLang,
      subjects: selectedSubjects,
    });
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-lg w-full mx-auto relative z-10">
        <Link
          to="/login"
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-dim hover:text-brand-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Portals</span>
        </Link>
        <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
          Student Registration
        </span>
      </div>

      {/* Wizard Form Card */}
      <div className="max-w-lg w-full mx-auto my-8 relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center font-bold text-brand-midnight mx-auto shadow-glow-cyan/30">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-brand-white font-heading">
            Create Student Account
          </h1>
          <p className="text-xs text-brand-muted">
            Step {step} of 3 • {step === 1 ? 'Your Identity' : step === 2 ? 'Academics & Board' : 'Language Preferences'}
          </p>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="flex items-center gap-2">
          <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-brand-cyan' : 'bg-white/10'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-brand-cyan' : 'bg-white/10'}`} />
          <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-brand-cyan' : 'bg-white/10'}`} />
        </div>

        <Card className="p-6 md:p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard/95 shadow-2xl">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <Input
                label="Full Name or Preferred Display Name"
                placeholder="e.g. Ananya Sharma"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
              <Input
                type="email"
                label="Email Address (Optional if using Student ID)"
                placeholder="e.g. ananya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                type="password"
                label="Create Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button
                variant="cyan"
                size="md"
                className="w-full text-sm font-bold mt-2"
                onClick={() => setStep(2)}
                disabled={!displayName.trim()}
              >
                Continue to Academics →
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Class / Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
                >
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Education Board</label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
                >
                  <option value="Karnataka State Board">Karnataka State Board</option>
                  <option value="CBSE">CBSE (Central Board of Secondary Education)</option>
                  <option value="ICSE">ICSE</option>
                  <option value="Other State Board">Other State Board</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-2">Select Your Subjects</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Mathematics', 'General Science', 'English', 'Kannada', 'Social Science'].map((sub) => {
                    const isSelected = selectedSubjects.includes(sub);
                    return (
                      <button
                        type="button"
                        key={sub}
                        onClick={() => toggleSubject(sub)}
                        className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all ${
                          isSelected
                            ? 'bg-brand-blue/20 border-brand-cyan text-brand-cyan'
                            : 'bg-brand-surface border-brand-borderSubtle text-brand-muted'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '} {sub}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button variant="cyan" size="md" className="flex-1 font-bold" onClick={() => setStep(3)}>
                  Continue to Languages →
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">
                  I understand concepts best in: (AI Tutor Explanations)
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
                  I want to practise exams in: (Academic Terminology)
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

              <div className="p-3 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl text-xs text-brand-muted">
                💡 Sahaaya will bridge your home language concepts with formal examination English (Language Ladder innovation).
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button variant="cyan" size="md" className="flex-1 font-bold" onClick={handleFinish}>
                  Complete & Launch Workspace →
                </Button>
              </div>
            </div>
          )}
        </Card>

        <div className="text-center text-xs text-brand-dim">
          Already registered?{' '}
          <Link to="/student/login" className="text-brand-cyan font-bold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>

      <div className="text-center text-[11px] text-brand-dim relative z-10">
        © 2026 SahaayaLearn. DPDP 2023 Child Privacy Compliant.
      </div>
    </div>
  );
};
