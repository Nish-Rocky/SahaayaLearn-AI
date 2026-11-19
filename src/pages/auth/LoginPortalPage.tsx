import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Briefcase,
  Shield,
  ArrowRight,
  ChevronLeft,
  Sparkles,
} from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';

export const LoginPortalPage: React.FC = () => {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'student',
      title: 'Student Portal',
      subtitle: 'Your personal academic workspace',
      description: 'Access your AI tutor, syllabus, smart study planner, homework, flashcards, and learning twin.',
      path: '/student/login',
      icon: <GraduationCap className="w-8 h-8 text-brand-cyan" />,
      badge: 'Main Portal',
      badgeColor: 'cyan' as const,
      color: 'border-brand-cyan/40 hover:border-brand-cyan hover:shadow-glow-cyan/20',
    },
    {
      id: 'guardian',
      title: 'Parent / Guardian',
      subtitle: 'Family Voice Bridge',
      description: 'Support your child’s learning, listen to weekly spoken summaries, view upcoming exams, and manage consent.',
      path: '/guardian/login',
      icon: <Users className="w-8 h-8 text-brand-violet" />,
      badge: 'Family',
      badgeColor: 'purple' as const,
      color: 'border-brand-violet/40 hover:border-brand-violet hover:shadow-glow-violet/20',
    },
    {
      id: 'teacher',
      title: 'Teacher Portal',
      subtitle: 'Classroom intelligence',
      description: 'Manage class curricula, assign homework, identify common conceptual misconceptions, and track progress.',
      path: '/teacher/login',
      icon: <Briefcase className="w-8 h-8 text-emerald-400" />,
      badge: 'Institutional',
      badgeColor: 'green' as const,
      color: 'border-emerald-500/40 hover:border-emerald-500',
    },
    {
      id: 'admin',
      title: 'Administration',
      subtitle: 'System & curriculum controls',
      description: 'Curriculum versioning, board standards, dataset registry, AI provider health, and system security audits.',
      path: '/admin/login',
      icon: <Shield className="w-8 h-8 text-amber-400" />,
      badge: 'Protected',
      badgeColor: 'amber' as const,
      color: 'border-amber-500/40 hover:border-amber-500',
    },
  ];

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white flex flex-col justify-between p-6 md:p-12 font-sans relative overflow-hidden">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto relative z-10">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-semibold text-brand-dim hover:text-brand-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Landing Page</span>
        </Link>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center font-black text-brand-midnight">
            S
          </div>
          <span className="font-heading font-extrabold text-base tracking-tight text-brand-white">
            Sahaaya<span className="text-brand-cyan">Learn</span>
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-4xl w-full mx-auto py-12 space-y-8 relative z-10 text-center">
        <div className="space-y-3">
          <Badge variant="cyan" size="md">Multi-Role Academic Gateway</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-white font-heading tracking-tight">
            Welcome to SahaayaLearn
          </h1>
          <p className="text-sm md:text-base text-brand-muted max-w-xl mx-auto leading-relaxed">
            Your personal AI-powered academic companion. Select your portal to access your authenticated environment.
          </p>
        </div>

        {/* 4 Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {portals.map((portal) => (
            <Card
              key={portal.id}
              className={`p-6 border bg-brand-surfaceCard/90 hover:bg-brand-surfaceElevated cursor-pointer transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between space-y-4 ${portal.color}`}
              onClick={() => navigate(portal.path)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-105 transition-transform">
                    {portal.icon}
                  </div>
                  <Badge variant={portal.badgeColor} size="sm">
                    {portal.badge}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-brand-white font-heading group-hover:text-brand-cyan transition-colors">
                    {portal.title}
                  </h3>
                  <span className="text-xs font-semibold text-brand-dim block">
                    {portal.subtitle}
                  </span>
                  <p className="text-xs text-brand-muted leading-relaxed pt-1">
                    {portal.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan group-hover:underline pt-2">
                <span>Enter Portal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Card>
          ))}
        </div>

        {/* New Student Registration Link */}
        <div className="pt-4 text-xs text-brand-muted">
          New to SahaayaLearn?{' '}
          <Link to="/student/register" className="text-brand-cyan font-bold hover:underline">
            Create your free student account →
          </Link>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[11px] text-brand-dim relative z-10">
        © 2026 SahaayaLearn. Learning that listens. Teaching that understands.
      </div>
    </div>
  );
};
