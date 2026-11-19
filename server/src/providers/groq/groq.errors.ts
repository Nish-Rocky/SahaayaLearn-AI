export class GroqError extends Error {
  public readonly code: string;
  public readonly status?: number;
  public readonly details?: any;

  constructor(message: string, code = 'GROQ_ERROR', status?: number, details?: any) {
    super(message);
    this.name = 'GroqError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class GroqRateLimitError extends GroqError {
  constructor(message = 'Groq API rate limit exceeded. Please wait a moment.', details?: any) {
    super(message, 'GROQ_RATE_LIMIT', 429, details);
    this.name = 'GroqRateLimitError';
  }
}

export class GroqAuthError extends GroqError {
  constructor(message = 'Invalid or missing GROQ_API_KEY.', details?: any) {
    super(message, 'GROQ_AUTH_FAILED', 401, details);
    this.name = 'GroqAuthError';
  }
}

export class GroqModelUnavailableError extends GroqError {
  constructor(model: string, details?: any) {
    super(`The requested Groq model '${model}' is currently unavailable or deprecated.`, 'GROQ_MODEL_UNAVAILABLE', 404, details);
    this.name = 'GroqModelUnavailableError';
  }
}

export function parseGroqError(err: any): GroqError {
  if (err instanceof GroqError) return err;

  const status = err?.status || err?.statusCode || 500;
  const message = err?.message || 'An unknown Groq API error occurred.';

  if (status === 401 || message.includes('API key') || message.includes('Unauthorized')) {
    return new GroqAuthError(message, err);
  }
  if (status === 429 || message.includes('Rate limit') || message.includes('rate_limit_exceeded')) {
    return new GroqRateLimitError(message, err);
  }
  if (status === 404 || message.includes('model_not_found') || message.includes('does not exist')) {
    return new GroqModelUnavailableError(err?.model || 'unknown', err);
  }

  return new GroqError(message, 'GROQ_API_ERROR', status, err);
}
