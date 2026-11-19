import { supabase } from '../supabase.js';

export interface ConceptMasteryRecord {
  id: string;
  student_profile_id: string;
  subject: string;
  concept: string;
  mastery_score: number; // 0.0 to 1.0
  attempts_count: number;
  last_practised_at: string;
  last_assessment_result?: boolean;
}

export interface StudentMisconceptionRecord {
  id: string;
  student_profile_id: string;
  session_id?: string;
  concept: string;
  misconception_code: string;
  evidence_summary: string;
  confidence_level: 'hypothesis' | 'confirmed' | 'resolved';
  verification_status: 'in_review' | 'verified' | 'dismissed';
  correction_status: 'pending' | 'in_progress' | 'corrected';
  detected_at: string;
  resolved_at?: string;
}

// In-memory telemetry cache
const memoryMastery = new Map<string, ConceptMasteryRecord>();
const memoryMisconceptions = new Map<string, StudentMisconceptionRecord>();

// Pre-populate realistic learner baseline
const defaultStudentId = '00000000-0000-0000-0000-000000000001';

const seedMastery: ConceptMasteryRecord[] = [
  {
    id: 'm1',
    student_profile_id: defaultStudentId,
    subject: 'Mathematics',
    concept: 'Fractions & Part-Whole Relations',
    mastery_score: 0.92,
    attempts_count: 8,
    last_practised_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    last_assessment_result: true,
  },
  {
    id: 'm2',
    student_profile_id: defaultStudentId,
    subject: 'Mathematics',
    concept: 'Common Denominator Addition',
    mastery_score: 0.86,
    attempts_count: 6,
    last_practised_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    last_assessment_result: true,
  },
  {
    id: 'm3',
    student_profile_id: defaultStudentId,
    subject: 'Mathematics',
    concept: 'Improper & Mixed Fractions',
    mastery_score: 0.74,
    attempts_count: 5,
    last_practised_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    last_assessment_result: true,
  },
  {
    id: 'm4',
    student_profile_id: defaultStudentId,
    subject: 'Mathematics',
    concept: 'Decimals to Fraction Conversion',
    mastery_score: 0.62,
    attempts_count: 4,
    last_practised_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    last_assessment_result: false,
  },
];

seedMastery.forEach((item) => {
  memoryMastery.set(`${item.student_profile_id}:${item.subject}:${item.concept}`, item);
});

const seedMisconceptions: StudentMisconceptionRecord[] = [
  {
    id: 'disc-1',
    student_profile_id: defaultStudentId,
    concept: 'Fractions Addition',
    misconception_code: 'ADD_NUMERATOR_AND_DENOMINATOR',
    evidence_summary: 'Student answered 1/3 + 1/3 = 2/6. Corrected via pizza slice partition analogy.',
    confidence_level: 'resolved',
    verification_status: 'verified',
    correction_status: 'corrected',
    detected_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    resolved_at: new Date(Date.now() - 3600000 * 40).toISOString(),
  },
  {
    id: 'disc-2',
    student_profile_id: defaultStudentId,
    concept: 'Fraction Magnitude',
    misconception_code: 'LARGER_DENOMINATOR_LARGER_VALUE',
    evidence_summary: 'Hypothesized 1/8 is larger than 1/4 because 8 > 4.',
    confidence_level: 'confirmed',
    verification_status: 'verified',
    correction_status: 'in_progress',
    detected_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

seedMisconceptions.forEach((item) => {
  memoryMisconceptions.set(item.id, item);
});

export class MasteryRepository {
  static async getStudentMastery(studentProfileId: string, subject?: string): Promise<ConceptMasteryRecord[]> {
    if (supabase) {
      let query = supabase.from('concept_mastery').select('*').eq('student_profile_id', studentProfileId);
      if (subject) query = query.eq('subject', subject);
      const { data } = await query;
      if (data && data.length > 0) return data as ConceptMasteryRecord[];
    }
    const all = Array.from(memoryMastery.values()).filter((m) => m.student_profile_id === studentProfileId);
    return subject ? all.filter((m) => m.subject.toLowerCase() === subject.toLowerCase()) : all;
  }

  static async updateMastery(params: {
    studentProfileId: string;
    subject: string;
    concept: string;
    isCorrect: boolean;
    hintsUsed: number;
    selfReportedConfidence?: string;
  }): Promise<ConceptMasteryRecord> {
    const key = `${params.studentProfileId}:${params.subject}:${params.concept}`;
    const existing = memoryMastery.get(key) || {
      id: `mast_${Date.now()}`,
      student_profile_id: params.studentProfileId,
      subject: params.subject,
      concept: params.concept,
      mastery_score: 0.5,
      attempts_count: 0,
      last_practised_at: new Date().toISOString(),
    };

    // Adaptive scoring formula
    let delta = params.isCorrect ? 0.08 : -0.06;
    if (params.hintsUsed > 0 && params.isCorrect) delta = 0.04;
    if (params.selfReportedConfidence === 'completely_sure' && params.isCorrect) delta += 0.03;

    const newScore = Math.min(1.0, Math.max(0.0, Number((existing.mastery_score + delta).toFixed(2))));

    const updated: ConceptMasteryRecord = {
      ...existing,
      mastery_score: newScore,
      attempts_count: existing.attempts_count + 1,
      last_practised_at: new Date().toISOString(),
      last_assessment_result: params.isCorrect,
    };

    memoryMastery.set(key, updated);

    if (supabase) {
      await supabase.from('concept_mastery').upsert(updated);
    }

    return updated;
  }

  static async recordMisconception(record: Omit<StudentMisconceptionRecord, 'id' | 'detected_at'>): Promise<StudentMisconceptionRecord> {
    const full: StudentMisconceptionRecord = {
      ...record,
      id: `disc_${Date.now()}`,
      detected_at: new Date().toISOString(),
    };

    memoryMisconceptions.set(full.id, full);

    if (supabase) {
      await supabase.from('student_misconceptions').insert(full);
    }

    return full;
  }

  static async getStudentMisconceptions(studentProfileId: string): Promise<StudentMisconceptionRecord[]> {
    if (supabase) {
      const { data } = await supabase.from('student_misconceptions').select('*').eq('student_profile_id', studentProfileId);
      if (data && data.length > 0) return data as StudentMisconceptionRecord[];
    }
    return Array.from(memoryMisconceptions.values()).filter((m) => m.student_profile_id === studentProfileId);
  }
}
