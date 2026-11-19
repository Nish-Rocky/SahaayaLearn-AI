import { SpeechRecoveryService } from './speech-recovery.service.js';

export interface ProcessedTranscript {
  turnId: string;
  transcript: string;
  confidence: number;
  languageCode: string;
  needsAcousticClarification: boolean;
  clarificationPrompt?: string;
}

export class TranscriptService {
  private static processedTurnIds = new Set<string>();

  /**
   * Evaluates incoming transcript for acoustic clarity and dedupes turns
   */
  static processTurnTranscript(params: {
    turnId: string;
    transcript: string;
    confidence: number;
    languageCode: string;
  }): ProcessedTranscript {
    const { turnId, transcript, confidence, languageCode } = params;

    // Check if turn was already processed to prevent duplicate executions
    if (this.processedTurnIds.has(turnId)) {
      return {
        turnId,
        transcript,
        confidence,
        languageCode,
        needsAcousticClarification: false,
      };
    }
    this.processedTurnIds.add(turnId);

    // Keep set bounded
    if (this.processedTurnIds.size > 500) {
      const first = Array.from(this.processedTurnIds)[0];
      this.processedTurnIds.delete(first);
    }

    const recovery = SpeechRecoveryService.assessAcousticClarity(transcript, confidence);

    return {
      turnId,
      transcript,
      confidence,
      languageCode,
      needsAcousticClarification: recovery.needsConfirmation,
      clarificationPrompt: recovery.confirmationPrompt,
    };
  }
}
