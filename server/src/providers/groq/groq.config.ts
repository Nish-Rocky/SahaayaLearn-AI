import { env } from '../../config/env.js';

export interface GroqConfig {
  apiKey: string;
  baseUrl: string;
  mainModel: string;
  fastModel: string;
  timeoutMs: number;
  maxRetries: number;
}

export const groqConfig: GroqConfig = {
  apiKey: env.GROQ_API_KEY,
  baseUrl: env.GROQ_BASE_URL || 'https://api.groq.com/openai/v1',
  mainModel: env.GROQ_MODEL || 'openai/gpt-oss-120b',
  fastModel: env.GROQ_FAST_MODEL || 'openai/gpt-oss-20b',
  timeoutMs: 30000,
  maxRetries: 2,
};
