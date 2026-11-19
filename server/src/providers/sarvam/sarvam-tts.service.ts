import { env, hasSarvam } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { getLanguageConfig, SUPPORTED_LANGUAGES } from '../../config/providers.js';

export interface SarvamTtsResult {
  audioBase64: string;
  format: 'wav' | 'mp3';
  durationEstimateSeconds: number;
  textSpoken: string;
}

export class SarvamTtsService {
  /**
   * Sanitizes structured explanation into a natural, conversational spoken narrative
   * Strips JSON, markdown formatting, formulas, while keeping the natural spoken wording
   */
  static cleanSpokenText(rawText: string): string {
    return rawText
      // Remove code blocks and JSON objects
      .replace(/```json[\s\S]*?```/gi, '')
      .replace(/```[\s\S]*?```/gi, '')
      .replace(/\{[\s\S]*?\}/g, '')
      // Remove citations like [Source: NCERT Class 7, p.14]
      .replace(/\[(?:Source|NCERT|Curriculum).*?\]/gi, '')
      .replace(/\[\d+\]/g, '')
      // Remove URLs
      .replace(/https?:\/\/\S+/gi, '')
      // Remove markdown headings, bold, asterisks, bullet points
      .replace(/[#*_~`]/g, '')
      .replace(/^[-\t*+]\s+/gm, '')
      // Normalize whitespace
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Split narrative into complete sentences or safe segments for streaming synthesis
   */
  static splitIntoSentences(text: string): string[] {
    const clean = this.cleanSpokenText(text);
    if (!clean) return [];

    // Split on sentence boundary characters: '.', '!', '?', or regional sentence breaks '।' followed by space or end
    const sentences = clean
      .split(/(?<=[.!?।])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    return sentences.length > 0 ? sentences : [clean];
  }

  /**
   * Synthesize speech using Sarvam Bulbul v4 Flash
   */
  static async synthesizeSpeech(
    text: string,
    languageCode = 'kn-IN',
    speechRate = 1.0,
    speakerOverride?: string
  ): Promise<SarvamTtsResult> {
    const clean = this.cleanSpokenText(text);
    const langConfig = getLanguageConfig(languageCode);

    if (!clean) {
      throw new Error('No valid text to speak after sanitization');
    }

    const durationEstimate = Math.max(1, Math.round(clean.split(' ').length / 3));

    if (!hasSarvam) {
      logger.warn('⚠️ SARVAM_API_KEY is not configured in .env. Returning audio notification metadata for browser speech synthesis.');
      return {
        audioBase64: '',
        format: 'wav',
        durationEstimateSeconds: durationEstimate,
        textSpoken: clean,
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
          speaker: speakerOverride || langConfig.speakerId || 'kannada_female_1',
          pitch: 0,
          pace: speechRate,
          loudness: 1.5,
          speech_sample_rate: 22050,
          enable_preprocessing: true,
          model: env.SARVAM_TTS_MODEL || 'bulbul:v4-flash',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sarvam Bulbul TTS failed with status ${response.status}: ${errorText}`);
      }

      const data: any = await response.json();
      const audioBase64 = data.audios?.[0] || '';

      return {
        audioBase64,
        format: 'wav',
        durationEstimateSeconds: durationEstimate,
        textSpoken: clean,
      };
    } catch (err: any) {
      logger.error({ err: err.message }, 'Sarvam TTS synthesis error');
      throw err;
    }
  }

  /**
   * Returns list of supported TTS voices and languages
   */
  static getSupportedVoices() {
    return Object.values(SUPPORTED_LANGUAGES)
      .filter((l) => l.ttsSupported)
      .map((l) => ({
        languageCode: l.code,
        languageName: l.name,
        nativeName: l.nativeName,
        speakerId: l.speakerId,
        model: l.ttsModel,
      }));
  }
}
