import { env, hasSarvam } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { getLanguageConfig, SUPPORTED_LANGUAGES } from '../../config/providers.js';

export interface SarvamTranscriptionResult {
  transcript: string;
  languageCode: string;
  confidence: number;
  detectedLanguage?: string;
  words?: Array<{ word: string; start: number; end: number }>;
}

export class SarvamSttService {
  /**
   * Transcribe audio buffer using Sarvam AI Saaras:v4
   */
  static async transcribeAudio(
    audioBuffer: Buffer,
    languageCode = 'kn-IN',
    keyterms: string[] = []
  ): Promise<SarvamTranscriptionResult> {
    const langConfig = getLanguageConfig(languageCode);

    if (!hasSarvam) {
      logger.warn('⚠️ SARVAM_API_KEY is not configured in .env. Returning simulated transcription.');
      const isKn = languageCode.startsWith('kn');
      const isHi = languageCode.startsWith('hi');
      return {
        transcript: isKn
          ? 'ಭಿನ್ನರಾಶಿಗಳ ನಿಯಮಗಳನ್ನು ಸರಳ ಉದಾಹರಣೆಯೊಂದಿಗೆ ವಿವರಿಸಿ.'
          : isHi
          ? 'न्यूटन के गति के नियमों को सरल उदाहरण के साथ समझाइए।'
          : 'Explain Newton\'s laws of motion with simple examples.',
        languageCode: langConfig.code,
        confidence: 0.95,
      };
    }

    try {
      const formData = new FormData();
      const blob = new Blob([audioBuffer], { type: 'audio/wav' });
      formData.append('file', blob, 'audio.wav');
      formData.append('model', env.SARVAM_STT_MODEL || 'saaras:v4');
      formData.append('language_code', langConfig.code);

      // Keyterms prompting for curriculum terminology
      const curriculumTerms = [
        ...keyterms,
        'Photosynthesis', 'Chlorophyll', 'Denominator', 'Numerator',
        'Inertia', 'Acceleration', 'Velocity', 'Equation',
        'ಭಿನ್ನರಾಶಿ', 'ಅಂಶ', 'ಛೇದ', 'ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ', 'ಪತ್ರಹರಿತ್ತು',
      ].slice(0, 50);

      if (curriculumTerms.length > 0) {
        formData.append('prompt', curriculumTerms.join(', '));
      }

      const response = await fetch('https://api.sarvam.ai/speech-to-text', {
        method: 'POST',
        headers: {
          'api-subscription-key': env.SARVAM_API_KEY,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Sarvam Saaras STT failed with status ${response.status}: ${errorText}`);
      }

      const data: any = await response.json();
      return {
        transcript: data.transcript || '',
        languageCode: data.language_code || langConfig.code,
        confidence: data.confidence ?? 0.92,
        detectedLanguage: data.detected_language,
        words: data.words,
      };
    } catch (err: any) {
      logger.error({ err: err.message }, 'Sarvam STT transcription error');
      throw err;
    }
  }

  /**
   * Get supported STT language list
   */
  static getSupportedLanguages() {
    return Object.values(SUPPORTED_LANGUAGES).filter((l) => l.sttSupported);
  }
}
