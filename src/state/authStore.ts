import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthUser, StudentProfile, GuardianProfile, TeacherProfile, UserRole } from '../types';
import { INITIAL_STUDENT_PROFILE, INITIAL_GUARDIAN_PROFILE, INITIAL_TEACHER_PROFILE } from '../services/mockData';

interface AuthState {
  user: AuthUser | null;
  role: UserRole | null;
  studentProfile: StudentProfile | null;
  guardianProfile: GuardianProfile | null;
  teacherProfile: TeacherProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  loginAsStudent: (user: Partial<AuthUser>) => void;
  loginAsGuardian: (user: Partial<AuthUser>) => void;
  loginAsTeacher: (user: Partial<AuthUser>) => void;
  loginAsAdmin: (user: Partial<AuthUser>) => void;
  setUser: (user: AuthUser | null, role?: UserRole) => void;
  setStudentProfile: (profile: Partial<StudentProfile>) => void;
  completeOnboarding: (data: Partial<StudentProfile>) => void;
  logout: () => void;
  switchProfile: (studentId: string) => void;
}

const DEMO_STUDENT_USER: AuthUser = {
  id: '00000000-0000-0000-0000-000000000001',
  learnerId: 'SL-8K4P92',
  displayName: 'Ananya Sharma',
  role: 'student',
  onboardingComplete: true,
  createdAt: '2025-01-10T00:00:00Z',
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: DEMO_STUDENT_USER, // Seeded with demo student by default for immediate preview!
      role: 'student',
      studentProfile: INITIAL_STUDENT_PROFILE,
      guardianProfile: INITIAL_GUARDIAN_PROFILE,
      teacherProfile: INITIAL_TEACHER_PROFILE,
      isAuthenticated: true,
      isLoading: false,

      loginAsStudent: (customUser) => {
        const user: AuthUser = {
          id: customUser.id || '00000000-0000-0000-0000-000000000001',
          learnerId: customUser.learnerId || 'SL-8K4P92',
          displayName: customUser.displayName || 'Ananya Sharma',
          email: customUser.email,
          role: 'student',
          onboardingComplete: customUser.onboardingComplete !== undefined ? customUser.onboardingComplete : true,
          createdAt: customUser.createdAt || new Date().toISOString(),
        };
        set({
          user,
          role: 'student',
          isAuthenticated: true,
          studentProfile: get().studentProfile || INITIAL_STUDENT_PROFILE,
        });
      },

      loginAsGuardian: (customUser) => {
        const user: AuthUser = {
          id: customUser.id || 'g-user-001',
          displayName: customUser.displayName || 'Ramesh Sharma',
          email: customUser.email || 'ramesh.sharma@example.com',
          role: 'guardian',
          onboardingComplete: true,
          createdAt: new Date().toISOString(),
        };
        set({
          user,
          role: 'guardian',
          isAuthenticated: true,
          guardianProfile: get().guardianProfile || INITIAL_GUARDIAN_PROFILE,
        });
      },

      loginAsTeacher: (customUser) => {
        const user: AuthUser = {
          id: customUser.id || 't-user-001',
          displayName: customUser.displayName || 'Sunita Rao',
          email: customUser.email || 'sunita.rao@adarshaschool.edu.in',
          role: 'teacher',
          onboardingComplete: true,
          createdAt: new Date().toISOString(),
        };
        set({
          user,
          role: 'teacher',
          isAuthenticated: true,
          teacherProfile: get().teacherProfile || INITIAL_TEACHER_PROFILE,
        });
      },

      loginAsAdmin: (customUser) => {
        const user: AuthUser = {
          id: customUser.id || 'admin-001',
          displayName: customUser.displayName || 'Admin Console',
          email: customUser.email || 'admin@sahaayalearn.org',
          role: 'admin',
          onboardingComplete: true,
          createdAt: new Date().toISOString(),
        };
        set({
          user,
          role: 'admin',
          isAuthenticated: true,
        });
      },

      setUser: (user, role) => set({
        user,
        role: role || user?.role || null,
        isAuthenticated: !!user,
      }),

      setStudentProfile: (profile) => set((state) => ({
        studentProfile: state.studentProfile ? { ...state.studentProfile, ...profile } : null,
      })),

      completeOnboarding: (data) => set((state) => {
        const updatedProfile = state.studentProfile
          ? { ...state.studentProfile, ...data, onboardingComplete: true }
          : { ...INITIAL_STUDENT_PROFILE, ...data, onboardingComplete: true };
        const updatedUser = state.user
          ? { ...state.user, onboardingComplete: true }
          : null;
        return {
          studentProfile: updatedProfile,
          user: updatedUser,
        };
      }),

      logout: () => set({
        user: null,
        role: null,
        isAuthenticated: false,
      }),

      switchProfile: (studentId) => {
        // Safe profile switching for shared-device households
        if (studentId === '00000000-0000-0000-0000-000000000001') {
          set({
            user: DEMO_STUDENT_USER,
            role: 'student',
            studentProfile: INITIAL_STUDENT_PROFILE,
            isAuthenticated: true,
          });
        }
      },
    }),
    {
      name: 'sahaaya-auth-storage',
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        studentProfile: state.studentProfile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
