import { env, hasSarvam } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { getLanguageConfig } from '../../config/providers.js';

export class SarvamTtsStream {
  /**
   * Streams audio chunks via Sarvam HTTP streaming endpoint
   */
  static async streamSpeech(
    text: string,
    languageCode = 'kn-IN',
    onChunk: (chunk: Buffer) => void
  ): Promise<void> {
    if (!hasSarvam) {
      logger.info('Sarvam API key not configured; skipping remote audio stream.');
      return;
    }

    const langConfig = getLanguageConfig(languageCode);

    try {
      const response = await fetch('https://api.sarvam.ai/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-subscription-key': env.SARVAM_API_KEY,
        },
        body: JSON.stringify({
          inputs: [text],
          target_language_code: langConfig.code,
          speaker: langConfig.speakerId,
          model: env.SARVAM_TTS_MODEL || 'bulbul:v4-flash',
          enable_preprocessing: true,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`TTS stream failed with status ${response.status}`);
      }

      const reader = response.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          onChunk(Buffer.from(value));
        }
      }
    } catch (err: any) {
      logger.error({ err: err.message }, 'Sarvam TTS streaming error');
      throw err;
    }
  }
}
