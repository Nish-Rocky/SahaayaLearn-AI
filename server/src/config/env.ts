import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load .env if present
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8000),
  HOST: z.string().default('0.0.0.0'),
  APP_BASE_URL: z.string().default('http://localhost:5173'),
  CORS_ORIGINS: z.string().default('http://localhost:5173,http://127.0.0.1:5173'),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),

  // AI Provider Selection
  AI_PROVIDER: z.enum(['groq', 'gemini']).default('groq'),

  // Groq API (Primary AI Reasoning Engine)
  GROQ_API_KEY: z.string().optional().default(''),
  GROQ_BASE_URL: z.string().default('https://api.groq.com/openai/v1'),
  GROQ_MODEL: z.string().default('openai/gpt-oss-120b'),
  GROQ_FAST_MODEL: z.string().default('openai/gpt-oss-20b'),

  // Gemini AI (Optional Secondary Fallback)
  GEMINI_API_KEY: z.string().optional().default(''),
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),
  GEMINI_EMBEDDING_MODEL: z.string().default('gemini-embedding-001'),
  GEMINI_EMBEDDING_DIMENSIONS: z.coerce.number().default(768),

  // Sarvam AI (Indian-Language Speech Engine)
  SARVAM_API_KEY: z.string().optional().default(''),
  SARVAM_STT_MODEL: z.string().default('saaras:v4'),
  SARVAM_TTS_MODEL: z.string().default('bulbul:v4-flash'),

  // Voice Pipeline Settings
  VOICE_PROVIDER_STT: z.string().default('sarvam'),
  VOICE_PROVIDER_TTS: z.string().default('sarvam'),
  VOICE_AUTO_SPEAK: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(true)),
  VOICE_DEFAULT_LANGUAGE: z.string().default('kn-IN'),
  VOICE_DEFAULT_PACE: z.coerce.number().default(1.0),
  VOICE_SESSION_TIMEOUT: z.coerce.number().default(300),
  VOICE_AUDIO_RETENTION: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),

  // Gemini Live
  GEMINI_LIVE_MODEL: z.string().default('gemini-3.8-live'),
  ENABLE_GEMINI_LIVE: z.preprocess((val) => val === 'true' || val === true, z.boolean().default(false)),

  // Supabase
  SUPABASE_URL: z.string().optional().default(''),
  SUPABASE_ANON_KEY: z.string().optional().default(''),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional().default(''),
  DATABASE_URL: z.string().optional().default(''),

  // Voice & Storage
  DEFAULT_LANGUAGE: z.string().default('kn-IN'),
  VOICE_SESSION_TTL_SECONDS: z.coerce.number().default(300),
  SUPABASE_CONTENT_BUCKET: z.string().default('learning-content'),
  SUPABASE_AUDIO_BUCKET: z.string().default('temporary-audio'),
  SUPABASE_CAPSULE_BUCKET: z.string().default('learning-capsules'),

  // Security & Limits
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  RATE_LIMIT_TIME_WINDOW_MS: z.coerce.number().default(60000),
  SENTRY_DSN: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', parsed.error.format());
  throw new Error('Invalid environment configuration');
}

export const env = parsed.data;

export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

export const hasGroq = Boolean(env.GROQ_API_KEY && env.GROQ_API_KEY.trim() !== '');
export const hasGemini = Boolean(env.GEMINI_API_KEY && env.GEMINI_API_KEY.trim() !== '');
export const hasSarvam = Boolean(env.SARVAM_API_KEY && env.SARVAM_API_KEY.trim() !== '');
export const hasSupabase = Boolean(env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);

export const activeAiProvider = hasGroq
  ? 'groq'
  : hasGemini
  ? 'gemini'
  : 'offline-curricular';
