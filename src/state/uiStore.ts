import { create } from 'zustand';
import { NotificationItem } from '../types';

interface UiState {
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  globalVoiceOpen: boolean;
  activeSection: string;
  notifications: NotificationItem[];
  voiceContext: {
    subject?: string;
    topic?: string;
    mode?: string;
  };

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  collapseSidebar: () => void;
  openGlobalVoice: (context?: { subject?: string; topic?: string; mode?: string }) => void;
  closeGlobalVoice: () => void;
  setActiveSection: (section: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'read' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  dismissNotification: (id: string) => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Math Exam in 5 Days',
    body: 'Term 2 Mathematics Examination starts on March 24. 2 topics need revision.',
    type: 'warning',
    read: false,
    createdAt: '2025-03-19T07:00:00Z',
    link: '/student/exams',
  },
  {
    id: 'notif-2',
    title: 'Homework Due Tomorrow',
    body: 'Solve Exercise 2.3: Fraction Division Word Problems.',
    type: 'reminder',
    read: false,
    createdAt: '2025-03-18T18:00:00Z',
    link: '/student/homework',
  },
  {
    id: 'notif-3',
    title: 'Guardian Weekly Report Sent',
    body: 'Your weekly progress summary was delivered to Ramesh Sharma.',
    type: 'info',
    read: true,
    createdAt: '2025-03-17T12:00:00Z',
  },
];

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  globalVoiceOpen: false,
  activeSection: 'dashboard',
  notifications: DEFAULT_NOTIFICATIONS,
  voiceContext: {},

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  collapseSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  openGlobalVoice: (context = {}) => set({ globalVoiceOpen: true, voiceContext: context }),
  closeGlobalVoice: () => set({ globalVoiceOpen: false }),

  setActiveSection: (activeSection) => set({ activeSection }),

  addNotification: (n) => set((state) => ({
    notifications: [
      {
        ...n,
        id: `notif-${Date.now()}`,
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...state.notifications,
    ],
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    ),
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true })),
  })),

  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}));
