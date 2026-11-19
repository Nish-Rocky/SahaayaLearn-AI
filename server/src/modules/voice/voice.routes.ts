import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { VoiceSessionManager } from '../../websocket/voice-session-manager.js';
import { SarvamTtsService } from '../../providers/sarvam/sarvam-tts.service.js';
import { SarvamSttService } from '../../providers/sarvam/sarvam-stt.service.js';
import { SUPPORTED_LANGUAGES } from '../../config/providers.js';

export const voiceRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // 1. Session creation (handles both /voice/session and /voice/sessions)
  const handleCreateSession = async (req: any, reply: any) => {
    const schema = z.object({
      inputLanguage: z.string().default('kn-IN'),
      outputLanguage: z.string().default('kn-IN'),
    });

    const parsed = schema.safeParse(req.body || {});
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' },
      });
    }

    const studentProfileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';

    const session = VoiceSessionManager.createSession({
      studentProfileId,
      inputLanguage: parsed.data.inputLanguage,
      outputLanguage: parsed.data.outputLanguage,
    });

    return {
      success: true,
      data: {
        sessionId: session.id,
        wsStreamUrl: `/api/v1/voice/sessions/${session.id}/stream`,
        inputLanguage: session.inputLanguage,
        outputLanguage: session.outputLanguage,
        expiresAt: new Date(session.expiresAt).toISOString(),
      },
      message: 'Voice session initialized',
    };
  };

  fastify.post('/voice/session', handleCreateSession);
  fastify.post('/voice/sessions', handleCreateSession);

  // 2. Get session status
  fastify.get('/voice/session/:id', async (req, reply) => {
    const { id } = req.params as { id: string };
    const session = VoiceSessionManager.getSession(id);
    if (!session) {
      return reply.status(404).send({ success: false, error: { message: 'Session not found or expired' } });
    }
    return { success: true, data: session };
  });

  fastify.get('/voice/sessions/:sessionId', async (req, reply) => {
    const { sessionId } = req.params as { sessionId: string };
    const session = VoiceSessionManager.getSession(sessionId);
    if (!session) {
      return reply.status(404).send({ success: false, error: { message: 'Session not found or expired' } });
    }
    return { success: true, data: session };
  });

  // 3. Delete / End session
  fastify.delete('/voice/session/:id', async (req) => {
    const { id } = req.params as { id: string };
    VoiceSessionManager.endSession(id);
    return { success: true, message: 'Voice session ended' };
  });

  fastify.delete('/voice/sessions/:sessionId', async (req) => {
    const { sessionId } = req.params as { sessionId: string };
    VoiceSessionManager.endSession(sessionId);
    return { success: true, message: 'Voice session ended' };
  });

  // 4. POST /api/v1/voice/transcribe (REST STT via Sarvam)
  fastify.post('/voice/transcribe', async (req, reply) => {
    const schema = z.object({
      audioBase64: z.string().min(1),
      languageCode: z.string().default('kn-IN'),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'audioBase64 is required' },
      });
    }

    try {
      const buffer = Buffer.from(parsed.data.audioBase64, 'base64');
      const stt = await SarvamSttService.transcribeAudio(buffer, parsed.data.languageCode);
      return {
        success: true,
        data: stt,
      };
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: { message: err.message || 'Transcription failed' },
      });
    }
  });

  // 5. POST /api/v1/voice/synthesize (TTS via Sarvam Bulbul)
  fastify.post('/voice/synthesize', async (req, reply) => {
    const schema = z.object({
      text: z.string().min(1),
      languageCode: z.string().default('kn-IN'),
      speechRate: z.number().default(1.0),
      speaker: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' },
      });
    }

    try {
      const tts = await SarvamTtsService.synthesizeSpeech(
        parsed.data.text,
        parsed.data.languageCode,
        parsed.data.speechRate,
        parsed.data.speaker
      );

      return {
        success: true,
        data: tts,
      };
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: { message: err.message },
      });
    }
  });

  // 6. POST /api/v1/voice/stop (Stop active speaking / Barge-in)
  fastify.post('/voice/stop', async (req) => {
    const schema = z.object({
      sessionId: z.string().optional(),
    });
    const parsed = schema.safeParse(req.body || {});
    if (parsed.success && parsed.data.sessionId) {
      VoiceSessionManager.interrupt(parsed.data.sessionId);
    }
    return {
      success: true,
      message: 'Voice playback stopped and audio buffers cleared.',
    };
  });

  // 7. POST /api/v1/voice/replay (Re-synthesizes answer)
  fastify.post('/voice/replay', async (req, reply) => {
    const schema = z.object({
      text: z.string().min(1),
      languageCode: z.string().default('kn-IN'),
      speechRate: z.number().default(1.0),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: { message: 'Invalid payload' } });
    }

    const tts = await SarvamTtsService.synthesizeSpeech(
      parsed.data.text,
      parsed.data.languageCode,
      parsed.data.speechRate
    );

    return { success: true, data: tts };
  });

  // 8. GET /api/v1/voice/capabilities
  fastify.get('/voice/capabilities', async () => {
    return {
      success: true,
      data: {
        sttProvider: 'Sarvam AI (Saaras v4)',
        ttsProvider: 'Sarvam AI (Bulbul v4-flash)',
        supportedLanguages: Object.values(SUPPORTED_LANGUAGES),
        voices: SarvamTtsService.getSupportedVoices(),
        audioFormats: ['wav', 'pcm_linear16', 'mp3'],
        sampleRates: [16000, 22050, 44100],
        bargeInSupported: true,
        streamingSupported: true,
      },
    };
  });
};
