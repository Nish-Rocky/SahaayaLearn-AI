import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Public Landing Page (Existing App component)
import { App } from '../App';

// Auth Pages
import { LoginPortalPage } from '../pages/auth/LoginPortalPage';
import { StudentLoginPage } from '../pages/auth/StudentLoginPage';
import { StudentRegisterPage } from '../pages/auth/StudentRegisterPage';
import { GuardianLoginPage } from '../pages/auth/GuardianLoginPage';
import { TeacherLoginPage } from '../pages/auth/TeacherLoginPage';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { OnboardingWizard } from '../pages/onboarding/OnboardingWizard';

// Student Layout & Pages
import { StudentLayout } from '../layouts/StudentLayout';
import { DashboardPage } from '../pages/student/DashboardPage';
import { SubjectsPage } from '../pages/student/SubjectsPage';
import { SubjectDetailPage } from '../pages/student/SubjectDetailPage';
import { TimetablePage } from '../pages/student/TimetablePage';
import { CalendarPage } from '../pages/student/CalendarPage';
import { PlannerPage } from '../pages/student/PlannerPage';
import { HomeworkPage } from '../pages/student/HomeworkPage';
import { ExamsPage } from '../pages/student/ExamsPage';
import { NotesPage } from '../pages/student/NotesPage';
import { FlashcardsPage } from '../pages/student/FlashcardsPage';
import { QuizzesPage } from '../pages/student/QuizzesPage';
import { AiTutorPage } from '../pages/student/AiTutorPage';
import { VoiceTutorPage } from '../pages/student/VoiceTutorPage';
import { TeachBackPage } from '../pages/student/TeachBackPage';
import { LifeToLessonPage } from '../pages/student/LifeToLessonPage';
import { MistakeDnaPage } from '../pages/student/MistakeDnaPage';
import { ConceptGalaxyPage } from '../pages/student/ConceptGalaxyPage';
import { ProgressPage } from '../pages/student/ProgressPage';
import { AchievementsPage } from '../pages/student/AchievementsPage';
import { ProfilePage } from '../pages/student/ProfilePage';

// Other Portals
import { GuardianDashboardPage } from '../pages/guardian/GuardianDashboardPage';
import { TeacherDashboardPage } from '../pages/teacher/TeacherDashboardPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';

export const router = createBrowserRouter([
  // 1. Public Marketing Landing Page
  {
    path: '/',
    element: <App />,
  },

  // 2. Authentication & Onboarding
  {
    path: '/login',
    element: <LoginPortalPage />,
  },
  {
    path: '/student/login',
    element: <StudentLoginPage />,
  },
  {
    path: '/student/register',
    element: <StudentRegisterPage />,
  },
  {
    path: '/guardian/login',
    element: <GuardianLoginPage />,
  },
  {
    path: '/teacher/login',
    element: <TeacherLoginPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/onboarding',
    element: <OnboardingWizard />,
  },

  // 3. Student Academic Portal (authenticated workspace)
  {
    path: '/student',
    element: <StudentLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/student/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'subjects',
        element: <SubjectsPage />,
      },
      {
        path: 'subjects/:subjectId',
        element: <SubjectDetailPage />,
      },
      {
        path: 'syllabus',
        element: <SubjectsPage />,
      },
      {
        path: 'timetable',
        element: <TimetablePage />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'planner',
        element: <PlannerPage />,
      },
      {
        path: 'homework',
        element: <HomeworkPage />,
      },
      {
        path: 'assignments',
        element: <HomeworkPage />,
      },
      {
        path: 'exams',
        element: <ExamsPage />,
      },
      {
        path: 'notes',
        element: <NotesPage />,
      },
      {
        path: 'flashcards',
        element: <FlashcardsPage />,
      },
      {
        path: 'quizzes',
        element: <QuizzesPage />,
      },
      {
        path: 'ai-tutor',
        element: <AiTutorPage />,
      },
      {
        path: 'voice-tutor',
        element: <VoiceTutorPage />,
      },
      {
        path: 'teach-back',
        element: <TeachBackPage />,
      },
      {
        path: 'life-to-lesson',
        element: <LifeToLessonPage />,
      },
      {
        path: 'mistake-dna',
        element: <MistakeDnaPage />,
      },
      {
        path: 'concept-galaxy',
        element: <ConceptGalaxyPage />,
      },
      {
        path: 'progress',
        element: <ProgressPage />,
      },
      {
        path: 'achievements',
        element: <AchievementsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <ProfilePage />,
      },
    ],
  },

  // 4. Guardian Portal
  {
    path: '/guardian/dashboard',
    element: <GuardianDashboardPage />,
  },
  {
    path: '/guardian/children',
    element: <GuardianDashboardPage />,
  },

  // 5. Teacher Portal
  {
    path: '/teacher/dashboard',
    element: <TeacherDashboardPage />,
  },
  {
    path: '/teacher/classes',
    element: <TeacherDashboardPage />,
  },

  // 6. Admin Portal
  {
    path: '/admin/dashboard',
    element: <AdminDashboardPage />,
  },
  {
    path: '/admin/users',
    element: <AdminDashboardPage />,
  },

  // Catch all -> Redirect home
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
