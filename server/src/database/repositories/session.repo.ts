import { supabase } from '../supabase.js';
import { generateSessionId } from '../../utils/ids.js';

export interface LearningSession {
  id: string;
  student_profile_id: string;
  session_type: string;
  subject: string;
  topic: string;
  teaching_language: string;
  academic_language: string;
  session_summary?: string;
  started_at: string;
  ended_at?: string;
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  speaker: 'student' | 'tutor' | 'system';
  message_text: string;
  language_code: string;
  message_type: 'text' | 'speech_transcription' | 'spoken_synthesis' | 'diagnostic_prompt';
  response_metadata?: Record<string, unknown>;
  created_at: string;
}

const memorySessions = new Map<string, LearningSession>();
const memoryMessages = new Map<string, ConversationMessage[]>();

export class SessionRepository {
  static async createSession(params: {
    studentProfileId: string;
    subject: string;
    topic: string;
    teachingLanguage?: string;
    academicLanguage?: string;
    sessionType?: string;
  }): Promise<LearningSession> {
    const session: LearningSession = {
      id: generateSessionId(),
      student_profile_id: params.studentProfileId,
      session_type: params.sessionType || 'voice_tutor',
      subject: params.subject,
      topic: params.topic,
      teaching_language: params.teachingLanguage || 'kn-IN',
      academic_language: params.academicLanguage || 'en-IN',
      started_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('learning_sessions').insert(session);
    }

    memorySessions.set(session.id, session);
    memoryMessages.set(session.id, []);
    return session;
  }

  static async getSession(sessionId: string): Promise<LearningSession | null> {
    if (supabase) {
      const { data } = await supabase.from('learning_sessions').select('*').eq('id', sessionId).single();
      if (data) return data as LearningSession;
    }
    return memorySessions.get(sessionId) || null;
  }

  static async addMessage(msg: Omit<ConversationMessage, 'id' | 'created_at'>): Promise<ConversationMessage> {
    const fullMsg: ConversationMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('conversation_messages').insert(fullMsg);
    }

    const currentList = memoryMessages.get(msg.session_id) || [];
    currentList.push(fullMsg);
    memoryMessages.set(msg.session_id, currentList);

    return fullMsg;
  }

  static async getRecentMessages(sessionId: string, limit = 8): Promise<ConversationMessage[]> {
    if (supabase) {
      const { data } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false })
        .limit(limit);
      if (data) return (data as ConversationMessage[]).reverse();
    }
    const msgs = memoryMessages.get(sessionId) || [];
    return msgs.slice(-limit);
  }
}
