import { supabase } from '../supabase.js';
import { generateId } from '../../utils/ids.js';

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  display_name: string;
  role: 'student' | 'guardian' | 'educator' | 'admin';
  preferred_language: string;
  grade: string;
  school_board: string;
  created_at: string;
  updated_at: string;
}

export interface LearnerProfile {
  id: string;
  profile_id: string;
  learning_level: 'foundation' | 'intermediate' | 'advanced';
  preferred_teaching_language: string;
  academic_response_language: string;
  preferred_explanation_style: 'analogies' | 'visual_step_by_step' | 'concise';
  selected_subjects: string[];
  accessibility_preferences: {
    reducedMotion: boolean;
    screenReaderOptimized: boolean;
    fontSize: string;
  };
  pin_hash?: string;
}

// In-memory fallback storage
const memoryProfiles = new Map<string, UserProfile>();
const memoryLearners = new Map<string, LearnerProfile>();

// Seed default student demo profile
const defaultProfile: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  display_name: 'Ananya Sharma',
  role: 'student',
  preferred_language: 'kn-IN',
  grade: 'Class 7',
  school_board: 'Karnataka State Board',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const defaultLearner: LearnerProfile = {
  id: '00000000-0000-0000-0000-000000000002',
  profile_id: defaultProfile.id,
  learning_level: 'intermediate',
  preferred_teaching_language: 'kn-IN',
  academic_response_language: 'en-IN',
  preferred_explanation_style: 'analogies',
  selected_subjects: ['Mathematics', 'Science'],
  accessibility_preferences: {
    reducedMotion: false,
    screenReaderOptimized: false,
    fontSize: 'medium',
  },
};

memoryProfiles.set(defaultProfile.id, defaultProfile);
memoryLearners.set(defaultProfile.id, defaultLearner);

export class ProfileRepository {
  static async getById(profileId: string): Promise<UserProfile | null> {
    if (supabase) {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', profileId).single();
      if (!error && data) return data as UserProfile;
    }
    return memoryProfiles.get(profileId) || null;
  }

  static async getLearnerProfile(profileId: string): Promise<LearnerProfile | null> {
    if (supabase) {
      const { data, error } = await supabase.from('learner_profiles').select('*').eq('profile_id', profileId).single();
      if (!error && data) return data as LearnerProfile;
    }
    return memoryLearners.get(profileId) || null;
  }

  static async createGuestProfile(name: string, grade = 'Class 7', language = 'kn-IN'): Promise<{ profile: UserProfile; learner: LearnerProfile }> {
    const profileId = generateId('usr');
    const profile: UserProfile = {
      id: profileId,
      display_name: name,
      role: 'student',
      preferred_language: language,
      grade,
      school_board: 'Karnataka State Board',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const learner: LearnerProfile = {
      id: generateId('lrn'),
      profile_id: profileId,
      learning_level: 'intermediate',
      preferred_teaching_language: language,
      academic_response_language: 'en-IN',
      preferred_explanation_style: 'analogies',
      selected_subjects: ['Mathematics', 'Science'],
      accessibility_preferences: {
        reducedMotion: false,
        screenReaderOptimized: false,
        fontSize: 'medium',
      },
    };

    if (supabase) {
      await supabase.from('profiles').insert(profile);
      await supabase.from('learner_profiles').insert(learner);
    }

    memoryProfiles.set(profileId, profile);
    memoryLearners.set(profileId, learner);

    return { profile, learner };
  }

  static async updatePreferences(profileId: string, updates: Partial<LearnerProfile>): Promise<LearnerProfile> {
    const existing = await this.getLearnerProfile(profileId) || defaultLearner;
    const merged = { ...existing, ...updates };

    if (supabase) {
      await supabase.from('learner_profiles').upsert(merged);
    }

    memoryLearners.set(profileId, merged);
    return merged;
  }

  static getDefaultProfile(): { profile: UserProfile; learner: LearnerProfile } {
    return { profile: defaultProfile, learner: defaultLearner };
  }
}
