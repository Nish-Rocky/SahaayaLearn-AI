import { generateSessionId } from '../utils/ids.js';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export interface VoiceSessionState {
  id: string;
  studentProfileId?: string;
  inputLanguage: string;
  outputLanguage: string;
  createdAt: number;
  expiresAt: number;
  isActive: boolean;
  isInterrupted: boolean;
}

export class VoiceSessionManager {
  private static sessions = new Map<string, VoiceSessionState>();

  static createSession(params: {
    studentProfileId?: string;
    inputLanguage?: string;
    outputLanguage?: string;
  }): VoiceSessionState {
    const id = generateSessionId();
    const ttlMs = env.VOICE_SESSION_TTL_SECONDS * 1000;
    const now = Date.now();

    const session: VoiceSessionState = {
      id,
      studentProfileId: params.studentProfileId,
      inputLanguage: params.inputLanguage || env.DEFAULT_LANGUAGE,
      outputLanguage: params.outputLanguage || env.DEFAULT_LANGUAGE,
      createdAt: now,
      expiresAt: now + ttlMs,
      isActive: true,
      isInterrupted: false,
    };

    this.sessions.set(id, session);
    logger.info({ sessionId: id }, 'Voice session established');
    return session;
  }

  static getSession(sessionId: string): VoiceSessionState | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    if (Date.now() > session.expiresAt) {
      session.isActive = false;
      this.sessions.delete(sessionId);
      return null;
    }
    return session;
  }

  static interrupt(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isInterrupted = true;
      logger.info({ sessionId }, 'Voice session interrupted by user');
    }
  }

  static endSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.sessions.delete(sessionId);
      logger.info({ sessionId }, 'Voice session closed');
    }
  }
}
