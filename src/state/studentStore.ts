import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  Subject,
  TimetableEntry,
  CalendarEvent,
  HomeworkItem,
  ExamRecord,
  Note,
  Flashcard,
  StudyTask,
  LearningGoal,
  Achievement,
  MisconceptionItem,
  ConceptNode,
} from '../types';
import {
  INITIAL_SUBJECTS,
  INITIAL_TIMETABLE,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_HOMEWORK,
  INITIAL_EXAMS,
  INITIAL_NOTES,
  INITIAL_FLASHCARDS,
  INITIAL_STUDY_TASKS,
  INITIAL_GOALS,
  INITIAL_ACHIEVEMENTS,
  INITIAL_MISCONCEPTIONS,
  INITIAL_CONCEPT_NODES,
} from '../services/mockData';

interface StudentState {
  subjects: Subject[];
  timetable: TimetableEntry[];
  calendarEvents: CalendarEvent[];
  homework: HomeworkItem[];
  exams: ExamRecord[];
  notes: Note[];
  flashcards: Flashcard[];
  studyTasks: StudyTask[];
  goals: LearningGoal[];
  achievements: Achievement[];
  misconceptions: MisconceptionItem[];
  conceptNodes: ConceptNode[];
  activeFocusSession: {
    durationMin: number;
    remainingSeconds: number;
    isRunning: boolean;
    subject?: string;
    topic?: string;
  } | null;

  // Actions
  addHomework: (item: Omit<HomeworkItem, 'id' | 'createdAt'>) => void;
  toggleHomeworkStatus: (id: string) => void;
  deleteHomework: (id: string) => void;

  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  deleteTimetableEntry: (id: string) => void;

  addStudyTask: (task: Omit<StudyTask, 'id'>) => void;
  toggleStudyTaskStatus: (id: string) => void;
  rescheduleTask: (id: string, newDate: string) => void;

  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  togglePinNote: (id: string) => void;

  addFlashcard: (card: Omit<Flashcard, 'id' | 'nextReviewAt' | 'intervalDays' | 'easeFactor' | 'reviewCount'>) => void;
  reviewFlashcard: (id: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;

  addExam: (exam: Omit<ExamRecord, 'id' | 'createdAt'>) => void;

  updateTopicMastery: (subjectId: string, topicId: string, mastery: any, scoreDelta: number) => void;

  startFocusSession: (durationMin: number, subject?: string, topic?: string) => void;
  tickFocusSession: () => void;
  stopFocusSession: () => void;

  resetToDefaults: () => void;
}

export const useStudentStore = create<StudentState>()(
  persist(
    (set) => ({
      subjects: INITIAL_SUBJECTS,
      timetable: INITIAL_TIMETABLE,
      calendarEvents: INITIAL_CALENDAR_EVENTS,
      homework: INITIAL_HOMEWORK,
      exams: INITIAL_EXAMS,
      notes: INITIAL_NOTES,
      flashcards: INITIAL_FLASHCARDS,
      studyTasks: INITIAL_STUDY_TASKS,
      goals: INITIAL_GOALS,
      achievements: INITIAL_ACHIEVEMENTS,
      misconceptions: INITIAL_MISCONCEPTIONS,
      conceptNodes: INITIAL_CONCEPT_NODES,
      activeFocusSession: null,

      addHomework: (item) => set((state) => ({
        homework: [
          {
            ...item,
            id: `hw-${Date.now()}`,
            createdAt: new Date().toISOString(),
          },
          ...state.homework,
        ],
      })),

      toggleHomeworkStatus: (id) => set((state) => ({
        homework: state.homework.map((hw) => {
          if (hw.id !== id) return hw;
          const nextStatus = hw.status === 'completed' ? 'in_progress' : 'completed';
          return { ...hw, status: nextStatus };
        }),
      })),

      deleteHomework: (id) => set((state) => ({
        homework: state.homework.filter((hw) => hw.id !== id),
      })),

      addCalendarEvent: (event) => set((state) => ({
        calendarEvents: [
          { ...event, id: `ev-${Date.now()}` },
          ...state.calendarEvents,
        ],
      })),

      addTimetableEntry: (entry) => set((state) => ({
        timetable: [
          ...state.timetable,
          { ...entry, id: `tt-${Date.now()}` },
        ],
      })),

      deleteTimetableEntry: (id) => set((state) => ({
        timetable: state.timetable.filter((t) => t.id !== id),
      })),

      addStudyTask: (task) => set((state) => ({
        studyTasks: [
          { ...task, id: `st-${Date.now()}` },
          ...state.studyTasks,
        ],
      })),

      toggleStudyTaskStatus: (id) => set((state) => ({
        studyTasks: state.studyTasks.map((t) => {
          if (t.id !== id) return t;
          const isDone = t.status === 'done';
          return {
            ...t,
            status: isDone ? 'pending' : 'done',
            completedAt: !isDone ? new Date().toISOString() : undefined,
          };
        }),
      })),

      rescheduleTask: (id, newDate) => set((state) => ({
        studyTasks: state.studyTasks.map((t) =>
          t.id === id ? { ...t, scheduledDate: newDate, status: 'rescheduled' } : t
        ),
      })),

      addNote: (note) => set((state) => ({
        notes: [
          {
            ...note,
            id: `note-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...state.notes,
        ],
      })),

      updateNote: (id, updates) => set((state) => ({
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
        ),
      })),

      deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id),
      })),

      togglePinNote: (id) => set((state) => ({
        notes: state.notes.map((n) =>
          n.id === id ? { ...n, isPinned: !n.isPinned } : n
        ),
      })),

      addFlashcard: (card) => set((state) => ({
        flashcards: [
          {
            ...card,
            id: `fc-${Date.now()}`,
            nextReviewAt: new Date().toISOString(),
            intervalDays: 1,
            easeFactor: 2.5,
            reviewCount: 0,
          },
          ...state.flashcards,
        ],
      })),

      reviewFlashcard: (id, rating) => set((state) => {
        return {
          flashcards: state.flashcards.map((fc) => {
            if (fc.id !== id) return fc;
            let nextInterval = fc.intervalDays;
            let nextEase = fc.easeFactor;

            if (rating === 'again') {
              nextInterval = 1;
              nextEase = Math.max(1.3, nextEase - 0.2);
            } else if (rating === 'hard') {
              nextInterval = Math.max(1, Math.round(fc.intervalDays * 1.2));
              nextEase = Math.max(1.3, nextEase - 0.15);
            } else if (rating === 'good') {
              nextInterval = Math.round(fc.intervalDays * nextEase);
            } else if (rating === 'easy') {
              nextInterval = Math.round(fc.intervalDays * nextEase * 1.3);
              nextEase = nextEase + 0.15;
            }

            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + nextInterval);

            return {
              ...fc,
              reviewCount: fc.reviewCount + 1,
              intervalDays: nextInterval,
              easeFactor: nextEase,
              nextReviewAt: nextDate.toISOString(),
              lastRating: rating,
            };
          }),
        };
      }),

      addExam: (exam) => set((state) => ({
        exams: [
          {
            ...exam,
            id: `ex-${Date.now()}`,
            createdAt: new Date().toISOString(),
          },
          ...state.exams,
        ],
      })),

      updateTopicMastery: (subjectId, topicId, mastery, scoreDelta) => set((state) => ({
        subjects: state.subjects.map((s) => {
          if (s.id !== subjectId) return s;
          const updatedChapters = s.chapters.map((ch) => ({
            ...ch,
            topics: ch.topics.map((top) => {
              if (top.id !== topicId) return top;
              return {
                ...top,
                mastery,
                practiceCount: top.practiceCount + 1,
                lastPractisedAt: new Date().toISOString(),
              };
            }),
          }));
          return {
            ...s,
            masteryScore: Math.min(100, Math.max(0, s.masteryScore + scoreDelta)),
            chapters: updatedChapters,
          };
        }),
      })),

      startFocusSession: (durationMin, subject, topic) => set({
        activeFocusSession: {
          durationMin,
          remainingSeconds: durationMin * 60,
          isRunning: true,
          subject,
          topic,
        },
      }),

      tickFocusSession: () => set((state) => {
        if (!state.activeFocusSession || !state.activeFocusSession.isRunning) return state;
        const nextSeconds = state.activeFocusSession.remainingSeconds - 1;
        if (nextSeconds <= 0) {
          return {
            activeFocusSession: {
              ...state.activeFocusSession,
              remainingSeconds: 0,
              isRunning: false,
            },
          };
        }
        return {
          activeFocusSession: {
            ...state.activeFocusSession,
            remainingSeconds: nextSeconds,
          },
        };
      }),

      stopFocusSession: () => set({ activeFocusSession: null }),

      resetToDefaults: () => set({
        subjects: INITIAL_SUBJECTS,
        timetable: INITIAL_TIMETABLE,
        calendarEvents: INITIAL_CALENDAR_EVENTS,
        homework: INITIAL_HOMEWORK,
        exams: INITIAL_EXAMS,
        notes: INITIAL_NOTES,
        flashcards: INITIAL_FLASHCARDS,
        studyTasks: INITIAL_STUDY_TASKS,
        goals: INITIAL_GOALS,
        achievements: INITIAL_ACHIEVEMENTS,
        misconceptions: INITIAL_MISCONCEPTIONS,
        conceptNodes: INITIAL_CONCEPT_NODES,
      }),
    }),
    {
      name: 'sahaaya-student-storage',
    }
  )
);
