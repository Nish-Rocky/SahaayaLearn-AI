import { hasGroq, env } from '../../config/env.js';
import { getGroqClient } from './groq.client.js';
import { groqConfig } from './groq.config.js';
import { logger } from '../../utils/logger.js';

export interface GroqHealthReport {
  configured: boolean;
  connected: boolean;
  status: 'connected' | 'not_configured' | 'authentication_failed' | 'rate_limited' | 'error';
  latencyMs?: number;
  model: string;
  fastModel: string;
  error?: string;
}

export async function checkGroqHealth(): Promise<GroqHealthReport> {
  if (!hasGroq) {
    return {
      configured: false,
      connected: false,
      status: 'not_configured',
      model: groqConfig.mainModel,
      fastModel: groqConfig.fastModel,
      error: 'GROQ_API_KEY is not defined in environment.',
    };
  }

  const client = getGroqClient();
  if (!client) {
    return {
      configured: true,
      connected: false,
      status: 'error',
      model: groqConfig.mainModel,
      fastModel: groqConfig.fastModel,
      error: 'Client failed to initialize',
    };
  }

  const startTime = Date.now();
  try {
    const res = await client.chat.completions.create({
      model: groqConfig.fastModel || 'openai/gpt-oss-20b',
      messages: [{ role: 'user', content: 'health_check' }],
      max_tokens: 5,
      temperature: 0,
    });

    const latencyMs = Date.now() - startTime;
    return {
      configured: true,
      connected: true,
      status: 'connected',
      latencyMs,
      model: groqConfig.mainModel,
      fastModel: groqConfig.fastModel,
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    const msg = err.message || String(err);
    let status: GroqHealthReport['status'] = 'error';

    if (msg.includes('401') || msg.includes('API key') || msg.includes('Unauthorized')) {
      status = 'authentication_failed';
    } else if (msg.includes('429') || msg.includes('Rate limit')) {
      status = 'rate_limited';
    }

    logger.warn({ err: msg, status, latencyMs }, 'Groq health check encountered issue');

    return {
      configured: true,
      connected: false,
      status,
      latencyMs,
      model: groqConfig.mainModel,
      fastModel: groqConfig.fastModel,
      error: msg,
    };
  }
}
