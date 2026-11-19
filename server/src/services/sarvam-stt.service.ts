import { env, hasSarvam } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { getLanguageConfig } from '../config/providers.js';

export interface TranscriptionResult {
  transcript: string;
  languageCode: string;
  confidence: number;
}

export class SarvamSttService {
  /**
   * Transcribe audio buffer using Sarvam AI Saaras:v4
   */
  static async transcribeAudio(
    audioBuffer: Buffer,
    languageCode = 'kn-IN'
  ): Promise<TranscriptionResult> {
    const langConfig = getLanguageConfig(languageCode);

    if (!hasSarvam) {
      logger.warn('⚠️ SARVAM_API_KEY is not configured in .env. Using fallback simulated transcript.');
      return {
        transcript: languageCode.startsWith('kn')
          ? 'ಭಿನ್ನರಾಶಿ ಎಂದರೇನು? ನನಗೆ ಸರಳವಾಗಿ ತಿಳಿಸಿ.'
          : 'Can you explain fractions to me in simple terms?',
        languageCode: langConfig.code,
        confidence: 0.95,
      };
    }

    try {
      const formData = new FormData();
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      formData.append('file', blob, 'audio.wav');
      formData.append('model', env.SARVAM_STT_MODEL);
      formData.append('language_code', langConfig.code);

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': env.SARVAM_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sarvam STT failed with status ${response.status}: ${errorText}`);
      }

      const data: any = await response.json();
      return {
        transcript: data.transcript || '',
        languageCode: data.language_code || langConfig.code,
        confidence: data.confidence ?? 0.9,
      };
    } catch (err: any) {
      logger.error({ err: err.message }, 'Sarvam STT transcription error');
      throw err;
    }
  }
}
