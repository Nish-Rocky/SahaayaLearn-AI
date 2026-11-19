import { SarvamTtsService, SarvamTtsResult } from '../providers/sarvam/sarvam-tts.service.js';
import { AudioResponseQueue, QueuedAudioSegment } from './audio-response.queue.js';
import { logger } from '../utils/logger.js';

export interface SpeechResponseOptions {
  languageCode: string;
  speechRate?: number;
  onAudioSegment: (segment: QueuedAudioSegment) => void;
}

export class SpeechResponseService {
  /**
   * Creates a dedicated streaming audio response queue for a tutoring turn
   */
  static createQueue(options: SpeechResponseOptions): AudioResponseQueue {
    return new AudioResponseQueue(
      options.languageCode,
      options.speechRate ?? 1.0,
      options.onAudioSegment
    );
  }

  /**
   * One-shot speech synthesis for a full explanation
   */
  static async synthesizeFullResponse(
    text: string,
    languageCode = 'kn-IN',
    speechRate = 1.0
  ): Promise<SarvamTtsResult> {
    return await SarvamTtsService.synthesizeSpeech(text, languageCode, speechRate);
  }
}
