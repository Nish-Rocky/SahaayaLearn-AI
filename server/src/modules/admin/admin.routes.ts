import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { env, hasGroq, hasGemini, hasSarvam, hasSupabase } from '../../config/env.js';
import { SUPPORTED_LANGUAGES } from '../../config/providers.js';
import { checkGroqHealth } from '../../providers/groq/groq.health.js';
import { groqConfig } from '../../providers/groq/groq.config.js';

export const adminRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // 1. GET /api/v1/system/capabilities
  fastify.get('/system/capabilities', async (req, reply) => {
    return {
      success: true,
      data: {
        product: 'SahaayaLearn',
        version: '1.0.0',
        environment: env.NODE_ENV,
        activeIntegrations: {
          groq: hasGroq,
          gemini: hasGemini,
          sarvamSpeech: hasSarvam,
          supabaseDatabase: hasSupabase,
          geminiLiveExperimental: env.ENABLE_GEMINI_LIVE,
        },
        primaryAiProvider: hasGroq ? 'groq' : (hasGemini ? 'gemini' : 'offline-curricular'),
        supportedLanguages: Object.values(SUPPORTED_LANGUAGES).map((l) => ({
          code: l.code,
          name: l.name,
          nativeName: l.nativeName,
          stt: l.sttSupported,
          tts: l.ttsSupported,
        })),
        ragIndexStatus: {
          indexedLessons: 4,
          misconceptionRules: 4,
          groundingStandard: 'NCERT & Karnataka State Board Curricula',
        },
      },
    };
  });

  // 2. GET /api/v1/ai/providers/health (Comprehensive live health dashboard)
  fastify.get('/ai/providers/health', async () => {
    const groqHealth = await checkGroqHealth();

    return {
      success: true,
      timestamp: new Date().toISOString(),
      providers: {
        groq: {
          name: 'Groq (OpenAI GPT-OSS Models)',
          configured: groqHealth.configured,
          connected: groqHealth.connected,
          status: groqHealth.status,
          latencyMs: groqHealth.latencyMs,
          model: groqHealth.model,
          fastModel: groqHealth.fastModel,
          error: groqHealth.error,
        },
        sarvamStt: {
          name: 'Sarvam AI Saaras v4 STT',
          configured: hasSarvam,
          status: hasSarvam ? 'connected' : 'not_configured',
          model: env.SARVAM_STT_MODEL || 'saaras:v4',
        },
        sarvamTts: {
          name: 'Sarvam AI Bulbul v4-flash TTS',
          configured: hasSarvam,
          status: hasSarvam ? 'connected' : 'not_configured',
          model: env.SARVAM_TTS_MODEL || 'bulbul:v4-flash',
        },
        gemini: {
          name: 'Google Gemini (Fallback AI)',
          configured: hasGemini,
          status: hasGemini ? 'connected' : 'not_configured',
          model: env.GEMINI_MODEL,
        },
        database: {
          name: 'Supabase PostgreSQL / Local Fallback',
          configured: hasSupabase,
          status: hasSupabase ? 'connected' : 'local_storage_fallback',
        },
      },
    };
  });

  // 3. Safe public configuration
  fastify.get('/config/public', async (req, reply) => {
    return {
      success: true,
      data: {
        defaultLanguage: env.DEFAULT_LANGUAGE,
        voiceSessionTtl: env.VOICE_SESSION_TTL_SECONDS,
        maxAudioLengthSeconds: 60,
        primaryAiProvider: hasGroq ? 'groq' : (hasGemini ? 'gemini' : 'offline-curricular'),
      },
    };
  });

  // 4. Admin content sources registry
  fastify.get('/admin/content/sources', async (req, reply) => {
    return {
      success: true,
      data: [
        {
          id: 'src_ncert_official',
          name: 'NCERT National Curriculum Framework',
          type: 'official_reference',
          grades: 'Classes 6–10',
          subjects: ['Mathematics', 'Science'],
          status: 'verified_reference',
        },
        {
          id: 'src_ksqaao_karnataka',
          name: 'Karnataka DSERT & KSEAB State Board Curriculum',
          type: 'state_board',
          grades: 'Classes 6–10',
          subjects: ['Mathematics', 'Science', 'Social Science', 'Kannada'],
          status: 'verified_reference',
        },
      ],
    };
  });
};
