export interface ModelMetadata {
  id: string;
  name: string;
  contextWindow: number;
  recommendedFor: 'reasoning' | 'fast' | 'classification' | 'general';
  isDefault?: boolean;
}

export const GROQ_SUPPORTED_MODELS: Record<string, ModelMetadata> = {
  'openai/gpt-oss-120b': {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B (OpenAI on Groq LPU)',
    contextWindow: 131072,
    recommendedFor: 'reasoning',
    isDefault: true,
  },
  'openai/gpt-oss-20b': {
    id: 'openai/gpt-oss-20b',
    name: 'GPT-OSS 20B (Fast Reasoning)',
    contextWindow: 131072,
    recommendedFor: 'fast',
  },
  'llama-3.3-70b-versatile': {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B Versatile',
    contextWindow: 128000,
    recommendedFor: 'reasoning',
  },
  'llama-3.1-8b-instant': {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B Instant',
    contextWindow: 128000,
    recommendedFor: 'fast',
  },
};

/**
 * Route request to model based on task complexity
 */
export function resolveGroqModel(taskType: 'deep-reasoning' | 'fast-intent' | 'summarize' | 'general' = 'deep-reasoning'): string {
  if (taskType === 'fast-intent' || taskType === 'summarize') {
    return process.env.GROQ_FAST_MODEL || 'openai/gpt-oss-20b';
  }
  return process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
}
