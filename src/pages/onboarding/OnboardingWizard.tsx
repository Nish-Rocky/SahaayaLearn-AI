import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  BookOpen,
  Globe,
  Clock,
  Target,
  Award,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { Card, Button, Input, Badge } from '../../components/ui';

export const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuthStore();

  const [step, setStep] = useState(1);

  // Wizard state
  const [displayName, setDisplayName] = useState(user?.displayName || 'Ananya');
  const [ageBand, setAgeBand] = useState('12-14 years');
  const [grade, setGrade] = useState('Class 7');
  const [board, setBoard] = useState('Karnataka State Board');
  const [subjects, setSubjects] = useState<string[]>(['Mathematics', 'General Science']);
  const [teachingLang, setTeachingLang] = useState('kn-IN');
  const [academicLang, setAcademicLang] = useState('en-IN');
  const [goals, setGoals] = useState<string[]>([
    'Improve Mathematics',
    'Prepare for upcoming exams',
  ]);
  const [dailyStudyMins, setDailyStudyMins] = useState(45);
  const [baselineAnswers, setBaselineAnswers] = useState<Record<number, number>>({});

  const toggleSubject = (s: string) => {
    setSubjects((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const toggleGoal = (g: string) => {
    setGoals((prev) =>
      prev.includes(g) ? prev.filter((item) => item !== g) : [...prev, g]
    );
  };

  const baselineQuestions = [
    {
      q: 'When we cut a whole roti into 4 equal slices and eat 1 slice, what fraction was eaten?',
      options: ['1/4', '4/1', '1/3', '3/4'],
      correct: 0,
    },
    {
      q: 'Which part of a green plant captures sunlight during photosynthesis?',
      options: ['Roots', 'Chlorophyll in Leaves', 'Flower Petals', 'Bark'],
      correct: 1,
    },
  ];

  const handleFinish = () => {
    completeOnboarding({
      displayName,
      grade: grade as any,
      board: board as any,
      subjects,
      teachingLanguage: teachingLang,
      academicLanguage: academicLang,
      studyGoals: goals,
      onboardingComplete: true,
    });
    navigate('/student/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="max-w-xl w-full mx-auto flex items-center justify-between pb-4 border-b border-brand-borderSubtle">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center font-bold text-brand-midnight">
            S
          </div>
          <span className="font-heading font-extrabold text-sm text-brand-white">
            SahaayaLearn Onboarding
          </span>
        </div>
        <Badge variant="cyan" size="sm">Step {step} of 7</Badge>
      </div>

      {/* Main Wizard Form */}
      <div className="max-w-xl w-full mx-auto my-6 space-y-6">
        {/* Step 1: Personal Profile */}
        {step === 1 && (
          <Card className="p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-cyan uppercase">Step 1 — Profile</span>
              <h2 className="text-2xl font-extrabold text-brand-white font-heading">
                What should we call you?
              </h2>
              <p className="text-xs text-brand-muted">
                Your preferred display name and age band for age-appropriate educational tutoring.
              </p>
            </div>

            <Input
              label="Preferred First Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Ananya"
              required
            />

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">Age Band</label>
              <select
                value={ageBand}
                onChange={(e) => setAgeBand(e.target.value)}
                className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
              >
                <option value="10-12 years">10–12 years (Class 6)</option>
                <option value="12-14 years">12–14 years (Class 7–8)</option>
                <option value="14-16 years">14–16 years (Class 9–10)</option>
              </select>
            </div>

            <div className="pt-2">
              <Button
                variant="cyan"
                size="md"
                className="w-full font-bold"
                onClick={() => setStep(2)}
                disabled={!displayName.trim()}
              >
                Next: Academic Details →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 2: Academic Details */}
        {step === 2 && (
          <Card className="p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-cyan uppercase">Step 2 — Academics</span>
              <h2 className="text-2xl font-extrabold text-brand-white font-heading">
                Your Grade & Board
              </h2>
              <p className="text-xs text-brand-muted">
                We ground tutor explanations and questions in your exact official textbook syllabus.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-brand-muted mb-1.5">Grade</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-cyan"
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
                  className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-cyan"
                >
                  <option value="Karnataka State Board">Karnataka State Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-2">Subjects You Study</label>
              <div className="grid grid-cols-2 gap-2">
                {['Mathematics', 'General Science', 'English', 'Kannada', 'Social Science'].map((sub) => {
                  const isSel = subjects.includes(sub);
                  return (
                    <button
                      type="button"
                      key={sub}
                      onClick={() => toggleSubject(sub)}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border transition-all ${
                        isSel
                          ? 'bg-brand-blue/20 border-brand-cyan text-brand-cyan'
                          : 'bg-brand-surface border-brand-borderSubtle text-brand-muted'
                      }`}
                    >
                      {isSel ? '✓ ' : '+ '} {sub}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={() => setStep(1)}>← Back</Button>
              <Button variant="cyan" size="md" className="flex-1 font-bold" onClick={() => setStep(3)}>
                Next: Language Preferences →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 3: Language Preferences */}
        {step === 3 && (
          <Card className="p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-cyan uppercase">Step 3 — Language Ladder</span>
              <h2 className="text-2xl font-extrabold text-brand-white font-heading">
                Language Preferences
              </h2>
              <p className="text-xs text-brand-muted">
                Learn naturally in your comfortable home language; practise questions in examination language.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">
                AI Explanations (Teaching Language)
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
                Academic & Examination Terms
              </label>
              <select
                value={academicLang}
                onChange={(e) => setAcademicLang(e.target.value)}
                className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
              >
                <option value="en-IN">English (Academic Terms)</option>
                <option value="kn-IN">ಕನ್ನಡ (Kannada Medium)</option>
              </select>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={() => setStep(2)}>← Back</Button>
              <Button variant="cyan" size="md" className="flex-1 font-bold" onClick={() => setStep(4)}>
                Next: Academic Goals →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 4: Academic Goals */}
        {step === 4 && (
          <Card className="p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-cyan uppercase">Step 4 — Study Goals</span>
              <h2 className="text-2xl font-extrabold text-brand-white font-heading">
                What are your main goals?
              </h2>
              <p className="text-xs text-brand-muted">
                Select what you want to achieve with SahaayaLearn.
              </p>
            </div>

            <div className="space-y-2">
              {[
                'Improve Mathematics & Fractions',
                'Prepare for upcoming Midterm Exams',
                'Understand Science concepts deeply',
                'Learn to explain concepts in English',
                'Build a consistent daily study habit',
                'Clear exam fear and build confidence',
              ].map((g) => {
                const isSel = goals.includes(g);
                return (
                  <button
                    type="button"
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className={`w-full p-3.5 rounded-xl text-xs font-bold text-left border transition-all flex items-center justify-between ${
                      isSel
                        ? 'bg-brand-blue/20 border-brand-cyan text-brand-white shadow-sm'
                        : 'bg-brand-surface border-brand-borderSubtle text-brand-muted hover:text-brand-white'
                    }`}
                  >
                    <span>{g}</span>
                    {isSel && <CheckCircle2 className="w-4 h-4 text-brand-cyan" />}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={() => setStep(3)}>← Back</Button>
              <Button variant="cyan" size="md" className="flex-1 font-bold" onClick={() => setStep(5)}>
                Next: Study Routine →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 5: Study Routine */}
        {step === 5 && (
          <Card className="p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard animate-in fade-in">
            <div className="space-y-1">
              <span className="text-xs font-bold text-brand-cyan uppercase">Step 5 — Routine</span>
              <h2 className="text-2xl font-extrabold text-brand-white font-heading">
                Your Daily Study Rhythm
              </h2>
              <p className="text-xs text-brand-muted">
                We'll tailor your smart study planner to your available free time.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1.5">
                Target Daily Study Duration
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[30, 45, 60].map((mins) => (
                  <button
                    type="button"
                    key={mins}
                    onClick={() => setDailyStudyMins(mins)}
                    className={`p-4 rounded-xl border text-center transition-all ${
                      dailyStudyMins === mins
                        ? 'bg-brand-cyan/20 border-brand-cyan text-brand-white'
                        : 'bg-brand-surface border-brand-borderSubtle text-brand-muted'
                    }`}
                  >
                    <span className="text-base font-extrabold block">{mins}m</span>
                    <span className="text-[10px] text-brand-dim">per day</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={() => setStep(4)}>← Back</Button>
              <Button variant="cyan" size="md" className="flex-1 font-bold" onClick={() => setStep(6)}>
                Next: Learning Baseline Check →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 6: Learning Baseline Check */}
        {step === 6 && (
          <Card className="p-8 space-y-5 border border-brand-cyan/30 bg-brand-surfaceCard animate-in fade-in">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-brand-cyan uppercase">Step 6 — Learning Check</span>
                <Badge variant="neutral" size="sm">Not a Test</Badge>
              </div>
              <h2 className="text-2xl font-extrabold text-brand-white font-heading">
                Gentle Diagnostic Check
              </h2>
              <p className="text-xs text-brand-muted">
                This is not an exam. It simply helps Sahaaya understand your starting foundation level.
              </p>
            </div>

            <div className="space-y-4">
              {baselineQuestions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-2">
                  <span className="text-xs font-bold text-brand-white block">
                    {qIdx + 1}. {q.q}
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isSel = baselineAnswers[qIdx] === optIdx;
                      return (
                        <button
                          type="button"
                          key={optIdx}
                          onClick={() => setBaselineAnswers({ ...baselineAnswers, [qIdx]: optIdx })}
                          className={`p-2.5 rounded-xl text-xs font-semibold text-left border transition-all ${
                            isSel
                              ? 'bg-brand-cyan/20 border-brand-cyan text-brand-white'
                              : 'bg-brand-surface border-brand-borderSubtle text-brand-muted hover:text-brand-white'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between gap-3 pt-2">
              <Button variant="ghost" size="md" onClick={() => setStep(5)}>← Back</Button>
              <Button variant="cyan" size="md" className="flex-1 font-bold" onClick={() => setStep(7)}>
                Review & Launch Workspace →
              </Button>
            </div>
          </Card>
        )}

        {/* Step 7: Ready Screen */}
        {step === 7 && (
          <Card className="p-8 text-center space-y-6 border border-brand-cyan/40 bg-brand-surfaceCard animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-blue text-brand-midnight flex items-center justify-center mx-auto shadow-glow-cyan/40">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-extrabold text-brand-white font-heading">
                Your Academic Space is Ready, {displayName}!
              </h2>
              <p className="text-xs text-brand-muted max-w-md mx-auto">
                Your personalized Class 7 Karnataka curriculum workspace, AI tutor, and study timetable are configured.
              </p>
            </div>

            <div className="p-4 bg-white/2 rounded-2xl border border-white/5 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Target Grade:</span>
                <span className="text-brand-white font-bold">{grade} ({board})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Teaching Language:</span>
                <span className="text-brand-cyan font-bold">{teachingLang === 'kn-IN' ? 'Kannada' : 'English'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">First Suggested Activity:</span>
                <span className="text-emerald-400 font-bold">Fractions & Decimals Reciprocals Review</span>
              </div>
            </div>

            <Button
              variant="cyan"
              size="lg"
              className="w-full font-bold shadow-glow-cyan/30 text-sm"
              onClick={handleFinish}
            >
              Enter My Student Dashboard →
            </Button>
          </Card>
        )}
      </div>

      <div className="text-center text-[11px] text-brand-dim">
        SahaayaLearn Academic Architecture • 2026
      </div>
    </div>
  );
};
