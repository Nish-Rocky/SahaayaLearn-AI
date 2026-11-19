import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { buildServer } from '../src/index.js';
import { FastifyInstance } from 'fastify';

describe('SahaayaLearn Backend REST API Integration', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    server = await buildServer();
    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  it('GET /health returns healthy status', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/health',
    });
    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.status).toBe('healthy');
  });

  it('GET /api/v1/system/capabilities returns multilingual and model capabilities', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/system/capabilities',
    });
    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.data.supportedLanguages).toBeInstanceOf(Array);
    expect(json.data.supportedLanguages.some((l: any) => l.code === 'kn-IN')).toBe(true);
  });

  it('POST /api/v1/tutor/ask returns a valid educational tutoring response', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/tutor/ask',
      payload: {
        question: 'Explain fractions in Kannada',
        subject: 'Mathematics',
        grade: 'Class 7',
        teachingLanguage: 'kn-IN',
        academicLanguage: 'en-IN',
      },
    });

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.success).toBe(true);
    expect(json.data.answer).toBeDefined();
    expect(json.data.keyTerms).toBeInstanceOf(Array);
    expect(json.data.isTextbookGrounded).toBe(true);
  });

  it('POST /api/v1/quizzes/q_frac_101/submit correctly scores equivalent answers', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/quizzes/q_frac_101/submit',
      payload: {
        questionId: 'q_frac_101',
        answer: '2/4',
        confidence: 'completely_sure',
        hintsUsed: 0,
      },
    });

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.data.isCorrect).toBe(true);
  });

  it('GET /api/v1/progress returns student mastery telemetry', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/progress',
    });

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.data.overallMastery).toBeGreaterThan(0);
    expect(json.data.concepts).toBeInstanceOf(Array);
  });

  it('GET /api/v1/ai/providers/health returns valid health diagnosis', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/ai/providers/health',
    });

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.success).toBe(true);
    expect(json.providers.groq).toBeDefined();
    expect(json.providers.sarvamStt).toBeDefined();
    expect(json.providers.sarvamTts).toBeDefined();
  });

  it('POST /api/v1/tutor/ask answers broad questions beyond fractions (e.g. Newton Laws)', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/tutor/ask',
      payload: {
        question: 'Explain the laws of motion with simple examples in English',
        subject: 'Science',
        grade: 'Class 8',
        teachingLanguage: 'en-IN',
        academicLanguage: 'en-IN',
      },
    });

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.success).toBe(true);
    expect(json.data.answer).toContain('Inertia');
    expect(json.data.examples).toBeInstanceOf(Array);
    expect(json.data.examples.length).toBeGreaterThan(0);
  });

  it('POST /api/v1/voice/synthesize returns valid speech audio structure', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/voice/synthesize',
      payload: {
        text: 'ನಮಸ್ಕಾರ ಅನನ್ಯಾ, ಗಣಿತದ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡೋಣ.',
        languageCode: 'kn-IN',
      },
    });

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.success).toBe(true);
    expect(json.data.durationEstimateSeconds).toBeGreaterThan(0);
  });

  it('POST /api/v1/ai/tools/execute executes academic tools safely', async () => {
    const res = await server.inject({
      method: 'POST',
      url: '/api/v1/ai/tools/execute',
      payload: {
        toolName: 'get_student_profile',
        arguments: {},
      },
    });

    expect(res.statusCode).toBe(200);
    const json = JSON.parse(res.body);
    expect(json.success).toBe(true);
    expect(json.data.grade).toBe('Class 7');
  });
});
