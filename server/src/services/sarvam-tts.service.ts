import { env, hasSarvam } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { getLanguageConfig } from '../config/providers.js';

export interface TtsResult {
  audioBase64: string;
  format: 'wav' | 'mp3';
  durationEstimateSeconds: number;
}

export class SarvamTtsService {
  /**
   * Sanitizes structured explanation into a natural, conversational spoken narrative
   */
  static cleanSpokenText(rawText: string): string {
    return rawText
      // Remove JSON or markdown tags
      .replace(/```json[\s\S]*?```/g, '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/\{[\s\S]*?\}/g, '')
      // Remove URLs and bracketed citations e.g. [Source: NCERT p.12]
      .replace(/\[.*?\]/g, '')
      .replace(/https?:\/\/\S+/g, '')
      // Remove markdown bold/italics
      .replace(/[*_#]/g, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Synthesize speech using Sarvam Bulbul
   */
  static async synthesizeSpeech(
    text: string,
    languageCode = 'kn-IN',
    speechRate = 1.0
  ): Promise<TtsResult> {
    const clean = this.cleanSpokenText(text);
    const langConfig = getLanguageConfig(languageCode);

    if (!clean) {
      throw new Error('No valid text to speak after sanitization');
    }

    if (!hasSarvam) {
      logger.warn('⚠️ SARVAM_API_KEY is not configured in .env. Returning simulated TTS response.');
      return {
        audioBase64: '',
        format: 'wav',
        durationEstimateSeconds: Math.max(1, Math.round(clean.split(' ').length / 3)),
      };
    }

    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
          inputs: [clean],
          target_language_code: langConfig.code,
          speaker: langConfig.speakerId,
          pitch: 0,
          pace: speechRate,
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: langConfig.ttsModel,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sarvam TTS failed with status ${response.status}: ${errorText}`);
      }

      const data: any = await response.json();
      const audioBase64 = data.audios?.[0] || '';

      return {
        audioBase64,
        format: 'wav',
        durationEstimateSeconds: Math.max(1, Math.round(clean.split(' ').length / 3)),
      };
    } catch (err: any) {
      logger.error({ err: err.message }, 'Sarvam TTS synthesis error');
      throw err;
    }
  }
}
