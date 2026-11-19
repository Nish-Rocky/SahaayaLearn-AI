import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { SarvamTtsService } from '../../services/sarvam-tts.service.js';

export const familyRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/v1/family/summary
  fastify.get('/family/summary', async (req, reply) => {
    const summaryKannada =
      'ನಮಸ್ಕಾರ! ಈ ವಾರ ನಿಮ್ಮ ಮಗಳು ಅನನ್ಯ ಗಣಿತದಲ್ಲಿ ಭಿನ್ನರಾಶಿಗಳ ಪರಿಕಲ್ಪನೆಯನ್ನು ಅದ್ಭುತವಾಗಿ ಕಲಿತಿದ್ದಾಳೆ. ಛೇದಗಳು ಮತ್ತು ಅಂಶಗಳ ವ್ಯತ್ಯಾಸವನ್ನು ಚೆನ್ನಾಗಿ ಅರ್ಥಮಾಡಿಕೊಂಡಿದ್ದಾಳೆ. ಮುಂದಿನ ಹಂತದಲ್ಲಿ ದಶಮಾಂಶಗಳನ್ನು ಕಲಿಯಲಿದ್ದಾಳೆ.';

    return {
      success: true,
      data: {
        summaryText: summaryKannada,
        language: 'kn-IN',
        durationSeconds: 42,
        keyAchievements: [
          'Mastered Fractions Part-Whole Relations',
          'Resolved adding denominators misconception',
          'Completed 3 voice quizzes with 85% score',
        ],
        suggestedParentAction:
          'At home, encourage her by asking her to divide a tomato or cucumber into equal halves and quarters during dinner.',
      },
    };
  });

  // POST /api/v1/family/summary/generate
  fastify.post('/family/summary/generate', async (req, reply) => {
    const schema = z.object({
      language: z.string().default('kn-IN'),
    });

    const parsed = schema.safeParse(req.body || {});
    const lang = parsed.success ? parsed.data.language : 'kn-IN';

    const text = lang.startsWith('kn')
      ? 'ನಮಸ್ಕಾರ! ಇಂದು ಅನನ್ಯ ಗಣಿತದಲ್ಲಿ ಭಿನ್ನರಾಶಿಗಳ ಪರಿಕಲ್ಪನೆಯನ್ನು ಸುಲಭವಾಗಿ ಕಲಿತಿದ್ದಾಳೆ. ಯಾವುದೇ ಆತಂಕವಿಲ್ಲದೆ ಧ್ವನಿ ಮೂಲಕ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ ಸ್ಪಷ್ಟತೆ ಪಡೆದುಕೊಂಡಿದ್ದಾಳೆ.'
      : 'Hello! Today Ananya made wonderful progress understanding fractions in Mathematics. She asked questions comfortably using voice and solved practice exercises!';

    let audio = null;
    try {
      audio = await SarvamTtsService.synthesizeSpeech(text, lang);
    } catch {}

    return {
      success: true,
      data: {
        text,
        language: lang,
        audio,
      },
    };
  });
};
