import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { AiOrchestrator } from '../../orchestration/ai-orchestrator.js';
import { GroqTutorService } from '../../services/groq-tutor.service.js';
import { executeGroqChatStream } from '../../providers/groq/groq.client.js';
import { groqConfig } from '../../providers/groq/groq.config.js';
import { hasGroq } from '../../config/env.js';
import { LanguageLadderService } from './language-ladder.service.js';
import { LifeToLessonService } from './life-to-lesson.service.js';
import { MisconceptionEngine } from '../misconceptions/misconception-engine.js';
import { ToolRegistry } from '../tools/tool-registry.js';

export const tutorRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // Shared schema for tutor turn
  const tutorTurnSchema = z.object({
    question: z.string().min(1),
    grade: z.string().default('Class 7'),
    subject: z.string().default('Mathematics'),
    teachingLanguage: z.string().default('kn-IN'),
    academicLanguage: z.string().default('en-IN'),
    sessionId: z.string().optional(),
    synthesizeVoice: z.boolean().default(false),
    mode: z.string().default('conceptual'),
  });

  // 1. POST /api/v1/tutor/ask (Primary existing endpoint)
  fastify.post('/tutor/ask', async (req, reply) => {
    const parsed = tutorTurnSchema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: parsed.error.issues[0]?.message || 'Invalid request' },
      });
    }

    const studentProfileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';

    try {
      const result = await AiOrchestrator.processTurn({
        studentProfileId,
        sessionId: parsed.data.sessionId,
        question: parsed.data.question,
        subject: parsed.data.subject,
        grade: parsed.data.grade,
        teachingLanguage: parsed.data.teachingLanguage,
        academicLanguage: parsed.data.academicLanguage,
        synthesizeVoice: parsed.data.synthesizeVoice,
        mode: parsed.data.mode,
      });

      return {
        success: true,
        data: {
          sessionId: result.sessionId,
          answer: result.tutorResponse.answer,
          shortExplanation: result.tutorResponse.shortExplanation,
          examples: result.tutorResponse.examples,
          keyTerms: result.tutorResponse.keyTerms,
          steps: result.tutorResponse.steps,
          difficulty: result.tutorResponse.difficulty,
          teachingLanguage: result.tutorResponse.teachingLanguage,
          academicLanguage: result.tutorResponse.academicLanguage,
          practiceQuestion: result.tutorResponse.practiceQuestion,
          sourceReferences: result.tutorResponse.sourceReferences,
          nextRecommendation: result.tutorResponse.nextRecommendation,
          isTextbookGrounded: result.grounding?.isTextbookGrounded ?? true,
          citations: result.grounding?.citationMetadata ?? [],
          misconceptionDetected: result.misconceptionDiagnosis?.hasMisconceptionHypothesis ?? false,
          diagnosticQuestion: result.misconceptionDiagnosis?.diagnosticQuestion,
          providerUsed: result.providerUsed,
          modelUsed: result.modelUsed,
          audio: result.audio,
        },
        message: 'Tutoring response generated successfully',
      };
    } catch (err: any) {
      req.log.warn({ err: err?.message }, 'Orchestrator fallback activated');
      const fallback = GroqTutorService.generateDynamicOfflineResponse(parsed.data);

      return {
        success: true,
        data: {
          sessionId: parsed.data.sessionId || 'session-fallback-01',
          ...fallback,
          isTextbookGrounded: true,
          citations: [{ source: 'NCERT / State Curriculum', chapter: 'Core Curricular Foundations', license: 'CC BY-NC 4.0' }],
          misconceptionDetected: false,
          providerUsed: 'offline-curricular',
          modelUsed: 'sahaaya-curricular-rules-v2',
        },
        message: 'Curriculum response generated via offline engine',
      };
    }
  });

  // 2. POST /api/v1/ai/chat (General AI Chat with Groq GPT-OSS)
  fastify.post('/ai/chat', async (req, reply) => {
    const schema = z.object({
      messages: z.array(z.object({
        role: z.enum(['system', 'user', 'assistant']),
        content: z.string(),
      })),
      teachingLanguage: z.string().default('kn-IN'),
      grade: z.string().default('Class 7'),
      subject: z.string().default('General'),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: { message: 'Invalid payload' } });
    }

    const lastMsg = parsed.data.messages[parsed.data.messages.length - 1]?.content || '';
    const result = await GroqTutorService.generateTutoringResponse({
      question: lastMsg,
      grade: parsed.data.grade,
      subject: parsed.data.subject,
      teachingLanguage: parsed.data.teachingLanguage,
      recentConversation: parsed.data.messages.slice(0, -1).map((m) => ({
        speaker: m.role === 'user' ? 'student' : 'tutor',
        text: m.content,
      })),
    });

    return {
      success: true,
      data: {
        message: {
          role: 'assistant',
          content: result.tutorResponse.answer,
        },
        tutorDetails: result.tutorResponse,
        providerUsed: result.providerUsed,
        modelUsed: result.modelUsed,
      },
    };
  });

  // 3. POST /api/v1/ai/chat/stream (SSE Streaming response via Groq)
  fastify.post('/ai/chat/stream', async (req, reply) => {
    const schema = z.object({
      question: z.string().min(1),
      teachingLanguage: z.string().default('kn-IN'),
      grade: z.string().default('Class 7'),
      subject: z.string().default('Mathematics'),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: { message: 'Invalid payload' } });
    }

    reply.raw.setHeader('Content-Type', 'text/event-stream');
    reply.raw.setHeader('Cache-Control', 'no-cache');
    reply.raw.setHeader('Connection', 'keep-alive');

    if (hasGroq) {
      try {
        const stream = await executeGroqChatStream({
          model: groqConfig.mainModel,
          messages: [
            {
              role: 'system',
              content: `You are SahaayaLearn, a supportive academic tutor for Indian students (${parsed.data.grade}, ${parsed.data.subject}). Explain in ${parsed.data.teachingLanguage}. Use relatable Indian analogies.`,
            },
            { role: 'user', content: parsed.data.question },
          ],
        });

        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || '';
          if (delta) {
            reply.raw.write(`data: ${JSON.stringify({ delta })}\n\n`);
          }
        }
        reply.raw.write(`data: [DONE]\n\n`);
        reply.raw.end();
        return;
      } catch (err: any) {
        req.log.warn({ err: err.message }, 'Groq stream failed, sending dynamic fallback delta');
      }
    }

    // Fallback stream
    const fallback = GroqTutorService.generateDynamicOfflineResponse(parsed.data);
    const words = fallback.answer.split(' ');
    for (const w of words) {
      reply.raw.write(`data: ${JSON.stringify({ delta: w + ' ' })}\n\n`);
      await new Promise((r) => setTimeout(r, 20));
    }
    reply.raw.write(`data: [DONE]\n\n`);
    reply.raw.end();
  });

  // 4. POST /api/v1/ai/tutor (Alias for /tutor/ask)
  fastify.post('/ai/tutor', async (req, reply) => {
    return reply.redirect(307, '/api/v1/tutor/ask');
  });

  // 5. POST /api/v1/ai/tutor/explain
  fastify.post('/ai/tutor/explain', async (req, reply) => {
    return reply.redirect(307, '/api/v1/tutor/ask');
  });

  // 6. POST /api/v1/ai/tutor/follow-up
  fastify.post('/ai/tutor/follow-up', async (req, reply) => {
    return reply.redirect(307, '/api/v1/tutor/ask');
  });

  // 7. POST /api/v1/ai/tutor/simplify
  fastify.post('/ai/tutor/simplify', async (req, reply) => {
    const body: any = req.body || {};
    body.mode = 'feynman';
    return reply.redirect(307, '/api/v1/tutor/ask');
  });

  // 8. POST /api/v1/ai/tutor/diagnose
  fastify.post('/ai/tutor/diagnose', async (req, reply) => {
    const schema = z.object({
      query: z.string(),
      expectedAnswer: z.string().optional(),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: { message: 'Invalid payload' } });
    }

    const diagnosis = MisconceptionEngine.diagnose(parsed.data.query, parsed.data.expectedAnswer || parsed.data.query);
    return {
      success: true,
      data: diagnosis,
    };
  });

  // 9. POST /api/v1/ai/tools/execute
  fastify.post('/ai/tools/execute', async (req, reply) => {
    const schema = z.object({
      toolName: z.string(),
      arguments: z.any().default({}),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({ success: false, error: { message: 'Invalid payload' } });
    }

    const studentProfileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';

    try {
      const result = await ToolRegistry.executeTool(
        parsed.data.toolName,
        parsed.data.arguments,
        { studentProfileId }
      );
      return { success: true, data: result };
    } catch (err: any) {
      return reply.status(400).send({ success: false, error: { message: err.message } });
    }
  });

  // 10. GET /api/v1/ai/tools
  fastify.get('/ai/tools', async () => {
    return {
      success: true,
      data: ToolRegistry.getToolList(),
    };
  });

  // 11. Existing Language Ladder & Life-to-Lesson
  fastify.post('/tutor/language-ladder', async (req, reply) => {
    const schema = z.object({
      conceptText: z.string().min(1),
      homeLanguage: z.string().default('kn-IN'),
      academicLanguage: z.string().default('en-IN'),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: { message: 'Invalid payload' } });

    const ladder = LanguageLadderService.getLadderForConcept(
      parsed.data.conceptText,
      parsed.data.homeLanguage,
      parsed.data.academicLanguage
    );
    return { success: true, data: ladder };
  });

  fastify.post('/tutor/real-world-example', async (req, reply) => {
    const schema = z.object({
      concept: z.string().min(1),
      grade: z.string().default('Class 7'),
    });
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) return reply.status(400).send({ success: false, error: { message: 'Invalid payload' } });

    const example = LifeToLessonService.generateMission(
      parsed.data.concept,
      parsed.data.grade
    );
    return { success: true, data: example };
  });
};
