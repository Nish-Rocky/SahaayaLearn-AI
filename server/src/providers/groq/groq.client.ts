import Groq from 'groq-sdk';
import { groqConfig } from './groq.config.js';
import { hasGroq } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { parseGroqError } from './groq.errors.js';

let clientInstance: Groq | null = null;

export function getGroqClient(): Groq | null {
  if (!hasGroq) return null;
  if (!clientInstance) {
    clientInstance = new Groq({
      apiKey: groqConfig.apiKey,
      baseURL: groqConfig.baseUrl,
      maxRetries: groqConfig.maxRetries,
      timeout: groqConfig.timeoutMs,
    });
    logger.info({ baseUrl: groqConfig.baseUrl, mainModel: groqConfig.mainModel }, '✅ Groq SDK Client initialized');
  }
  return clientInstance;
}

export async function executeGroqChatCompletion(params: {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
  response_format?: { type: 'json_object' | 'text' };
  stream?: false;
}) {
  const client = getGroqClient();
  if (!client) {
    throw new Error('Groq client is not configured (missing GROQ_API_KEY).');
  }

  try {
    const completion = await client.chat.completions.create({
      model: params.model || groqConfig.mainModel,
      messages: params.messages,
      temperature: params.temperature ?? 0.3,
      max_tokens: params.max_tokens ?? 2048,
      response_format: params.response_format,
      stream: false,
    });

    return completion;
  } catch (err: any) {
    throw parseGroqError(err);
  }
}

export async function executeGroqChatStream(params: {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
  abortSignal?: AbortSignal;
}) {
  const client = getGroqClient();
  if (!client) {
    throw new Error('Groq client is not configured (missing GROQ_API_KEY).');
  }

  try {
    const stream = await client.chat.completions.create(
      {
        model: params.model || groqConfig.mainModel,
        messages: params.messages,
        temperature: params.temperature ?? 0.3,
        max_tokens: params.max_tokens ?? 2048,
        stream: true,
      },
      {
        signal: params.abortSignal,
      }
    );

    return stream;
  } catch (err: any) {
    throw parseGroqError(err);
  }
}
