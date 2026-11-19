// Existing landing page types (preserved)
export type LanguageCode = 'kn' | 'hi' | 'en' | 'te' | 'ta' | 'ml' | 'bn' | 'mr';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  samplePhrase: string;
  academicBridgeExample: {
    home: string;
    bridge: string;
    academic: string;
  };
}

export interface LearningStage {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  iconName: string;
}

export interface FeatureInnovation {
  id: string;
  badge: string;
  title: string;
  description: string;
  iconName: string;
  highlightText?: string;
  gridSpan: 'normal' | 'wide' | 'tall';
  visualType: 'network' | 'ladder' | 'realworld' | 'pocket' | 'shield' | 'family';
}

export interface ProblemCardData {
  id: string;
  number: string;
  title: string;
  description: string;
  iconName: string;
  accent: string;
}

export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
  subtext: string;
  iconName: string;
  badge: string;
}

export interface ChatMessage {
  id: string;
  sender: 'student' | 'tutor';
  text: string;
  lang?: string;
  timestamp?: string;
  conceptTag?: string;
  hasAudio?: boolean;
}

export interface SampleTopic {
  id: string;
  title: string;
  subject: string;
  classGrade: string;
  suggestedQuestions: string[];
  conversation: ChatMessage[];
  textbookRef: {
    book: string;
    chapter: string;
    page: number;
    quote: string;
  };
  quizCard?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

// ==========================================
// SAHAAYALEARN PLATFORM DOMAIN TYPES
// ==========================================

export type UserRole = 'student' | 'guardian' | 'teacher' | 'admin';
export type MasteryLevel = 'not_started' | 'introduced' | 'practising' | 'developing' | 'demonstrated' | 'needs_revision';
export type BoardType = 'CBSE' | 'ICSE' | 'Karnataka State Board' | 'Other State Board' | 'Other';
export type GradeType = 'Class 6' | 'Class 7' | 'Class 8' | 'Class 9' | 'Class 10';

export interface AuthUser {
  id: string;
  email?: string;
  learnerId?: string; // e.g. SL-8K4P92
  role: UserRole;
  displayName: string;
  avatarUrl?: string;
  onboardingComplete: boolean;
  createdAt: string;
}

export interface StudentProfile {
  id: string;
  userId: string;
  learnerId: string;
  displayName: string;
  grade: GradeType;
  board: BoardType;
  academicYear: string;
  subjects: string[];
  teachingLanguage: string; // e.g. 'kn-IN'
  academicLanguage: string; // e.g. 'en-IN'
  uiLanguage: string;
  learningLevel: 'beginner' | 'intermediate' | 'advanced';
  studyGoals: string[];
  schoolName?: string;
  guardianId?: string;
  onboardingComplete: boolean;
}

export interface GuardianProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  phone?: string;
  linkedChildren: Array<{
    studentId: string;
    learnerId: string;
    displayName: string;
    grade: string;
    consentGiven: boolean;
  }>;
  verifiedAt?: string;
  consentGivenAt?: string;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  displayName: string;
  email: string;
  schoolName: string;
  classes: Array<{
    id: string;
    name: string;
    grade: GradeType;
    subject: string;
    studentCount: number;
  }>;
}

export interface Subject {
  id: string;
  name: string;
  grade: GradeType;
  board: BoardType;
  chapters: Chapter[];
  icon: string; // Lucide icon name
  colorClass: string;
  enrolmentStatus: 'active' | 'paused' | 'completed';
  masteryScore: number; // 0 - 100
  teacherName?: string;
  description: string;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  order: number;
  topics: Topic[];
  completionPercent: number;
  learningObjectives: string[];
}

export interface Topic {
  id: string;
  chapterId: string;
  title: string;
  mastery: MasteryLevel;
  practiceCount: number;
  lastPractisedAt?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prerequisites?: string[];
  summary?: string;
}

export interface HomeworkItem {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  timeSpentMin?: number;
  assignedBy?: string;
  attachments?: string[];
  aiHintsGiven?: string[];
  createdAt: string;
}

export interface ExamRecord {
  id: string;
  studentId: string;
  name: string;
  subject: string;
  examDate: string;
  chapters: string[];
  totalMarks?: number;
  durationMin?: number;
  prepStatus: 'not_started' | 'in_progress' | 'ready';
  readinessPercentage: number;
  unrevisedTopicsCount: number;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string;
  type: 'exam' | 'assignment' | 'study' | 'holiday' | 'revision';
  subject?: string;
  description?: string;
  completed?: boolean;
}

export interface TimetableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:00 AM"
  subject: string;
  room?: string;
  teacher?: string;
  color?: string;
}

export interface StudyTask {
  id: string;
  studentId: string;
  title: string;
  subject: string;
  scheduledDate: string;
  durationMin: number;
  status: 'pending' | 'done' | 'skipped' | 'rescheduled';
  priority: 'low' | 'medium' | 'high';
  topic?: string;
  completedAt?: string;
}

export interface Note {
  id: string;
  studentId: string;
  title: string;
  content: string;
  subject: string;
  chapter?: string;
  tags: string[];
  isPinned: boolean;
  aiSummary?: string;
  keyTerms?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Flashcard {
  id: string;
  studentId: string;
  front: string;
  back: string;
  subject: string;
  chapter?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReviewAt: string;
  intervalDays: number;
  easeFactor: number;
  reviewCount: number;
  lastRating?: 'again' | 'hard' | 'good' | 'easy';
}

export interface TutorMessage {
  id: string;
  role: 'student' | 'tutor';
  content: string;
  timestamp: string;
  language?: string;
  isTextbookGrounded?: boolean;
  citations?: Array<{ source: string; chapter: string; page?: number; license?: string }>;
  keyTerms?: string[];
  misconceptionDetected?: boolean;
  audioBase64?: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  type: 'daily' | 'weekly' | 'subject' | 'exam';
  targetDate?: string;
  completed: boolean;
  progress: number; // 0-100
  category: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  earnedAt: string;
  category: 'practice' | 'consistency' | 'mastery' | 'milestone';
  badgeColor: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface MisconceptionItem {
  id: string;
  concept: string;
  misconceptionCode: string;
  evidenceSummary: string;
  confidenceLevel: 'low' | 'medium' | 'high';
  verificationStatus: 'suspected' | 'verified' | 'resolved';
  correctionStatus: 'pending' | 'in_remediation' | 'cleared';
  detectedAt: string;
  subject: string;
}

export interface ConceptNode {
  id: string;
  label: string;
  subject: string;
  chapter: string;
  mastery: MasteryLevel;
  score: number; // 0-100
  connections: string[]; // Connected concept IDs
  x?: number;
  y?: number;
}
