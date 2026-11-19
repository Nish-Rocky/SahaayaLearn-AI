import { GroqTutorService } from '../services/groq-tutor.service.js';
import { GeminiService, TutorResponse } from '../services/gemini.service.js';
import { RagService, GroundedContext } from '../services/rag.service.js';
import { MisconceptionEngine, MisconceptionDetectionResult } from '../modules/misconceptions/misconception-engine.js';
import { ProfileRepository, LearnerProfile } from '../database/repositories/profile.repo.js';
import { SessionRepository } from '../database/repositories/session.repo.js';
import { MasteryRepository } from '../database/repositories/mastery.repo.js';
import { SarvamTtsService } from '../services/sarvam-tts.service.js';
import { logger } from '../utils/logger.js';

export interface OrchestrationInput {
  studentProfileId?: string;
  sessionId?: string;
  question: string;
  subject?: string;
  grade?: string;
  teachingLanguage?: string;
  academicLanguage?: string;
  synthesizeVoice?: boolean;
  mode?: string;
}

export interface OrchestrationResult {
  sessionId: string;
  tutorResponse: TutorResponse;
  grounding: GroundedContext;
  misconceptionDiagnosis: MisconceptionDetectionResult;
  providerUsed: 'groq' | 'gemini' | 'offline-curricular';
  modelUsed: string;
  audio?: {
    audioBase64: string;
    format: string;
    durationEstimateSeconds: number;
  };
}

export class AiOrchestrator {
  /**
   * Complete pedagogical pipeline:
   * 1. Profile retrieval
   * 2. Session context & history
   * 3. RAG Textbook Grounding
   * 4. Misconception X-Ray detection
   * 5. Gemini structured reasoning
   * 6. Speech audio synthesis
   * 7. Telemetry & message logging
   */
  static async processTurn(input: OrchestrationInput): Promise<OrchestrationResult> {
    const studentProfileId = input.studentProfileId || '00000000-0000-0000-0000-000000000001';
    
    // 1. Learner profile & preferences
    const learner = await ProfileRepository.getLearnerProfile(studentProfileId);
    const grade = input.grade || 'Class 7';
    const subject = input.subject || 'Mathematics';
    const teachingLanguage = input.teachingLanguage || learner?.preferred_teaching_language || 'kn-IN';
    const academicLanguage = input.academicLanguage || learner?.academic_response_language || 'en-IN';

    // 2. Session management
    let session = input.sessionId ? await SessionRepository.getSession(input.sessionId) : null;
    if (!session) {
      session = await SessionRepository.createSession({
        studentProfileId,
        subject,
        topic: input.question.slice(0, 40),
        teachingLanguage,
        academicLanguage,
      });
    }

    // Save student message
    await SessionRepository.addMessage({
      session_id: session.id,
      speaker: 'student',
      message_text: input.question,
      language_code: teachingLanguage,
      message_type: 'text',
    });

    const recentMsgs = await SessionRepository.getRecentMessages(session.id, 6);
    const conversationHistory = recentMsgs.map((m) => ({ speaker: m.speaker, text: m.message_text }));

    // 3. RAG Knowledge Retrieval
    const grounding = await RagService.retrieve({
      query: input.question,
      subject,
      grade,
      language: teachingLanguage,
      topK: 2,
    });

    // 4. Misconception X-Ray Analysis
    const misconceptionDiagnosis = MisconceptionEngine.diagnose(input.question, input.question);

    if (misconceptionDiagnosis.hasMisconceptionHypothesis) {
      await MisconceptionEngine.recordHypothesis(
        studentProfileId,
        session.id,
        misconceptionDiagnosis,
        `Detected via query: "${input.question}"`
      );
    }

    // 5. AI Reasoning with Groq GPT-OSS (Primary) and Gemini (Secondary)
    const { tutorResponse, providerUsed, modelUsed } = await GroqTutorService.generateTutoringResponse({
      question: input.question,
      grade,
      subject,
      teachingLanguage,
      academicLanguage,
      ragContext: grounding.combinedContextText,
      learnerLevel: learner?.learning_level || 'intermediate',
      recentConversation: conversationHistory,
      mode: input.mode || 'conceptual',
    });

    // Save tutor response
    await SessionRepository.addMessage({
      session_id: session.id,
      speaker: 'tutor',
      message_text: tutorResponse.answer,
      language_code: teachingLanguage,
      message_type: 'text',
      response_metadata: {
        providerUsed,
        modelUsed,
        shortExplanation: tutorResponse.shortExplanation,
        keyTerms: tutorResponse.keyTerms,
        isTextbookGrounded: grounding.isTextbookGrounded,
        sources: grounding.citationMetadata,
      },
    });

    // 6. Audio Speech Synthesis via Sarvam
    let audio: OrchestrationResult['audio'] = undefined;
    if (input.synthesizeVoice) {
      try {
        const tts = await SarvamTtsService.synthesizeSpeech(tutorResponse.answer, teachingLanguage);
        audio = {
          audioBase64: tts.audioBase64,
          format: tts.format,
          durationEstimateSeconds: tts.durationEstimateSeconds,
        };
      } catch (err: any) {
        logger.warn({ err: err.message }, 'Voice synthesis encountered issue, preserving text answer');
      }
    }

    return {
      sessionId: session.id,
      tutorResponse,
      grounding,
      misconceptionDiagnosis,
      providerUsed,
      modelUsed,
      audio,
    };
  }
}
