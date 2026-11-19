import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { MathEvaluator } from '../evaluation/math-evaluator.js';
import { ConfidenceEngine, ConfidenceLevel } from '../tutoring/confidence-engine.js';
import { MisconceptionEngine } from '../misconceptions/misconception-engine.js';
import { MasteryRepository } from '../../database/repositories/mastery.repo.js';

export const quizRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // POST /api/v1/quizzes/generate
  fastify.post('/quizzes/generate', async (req, reply) => {
    const schema = z.object({
      subject: z.string().default('Mathematics'),
      grade: z.string().default('Class 7'),
      topic: z.string().default('Fractions'),
      count: z.number().default(3),
      language: z.string().default('kn-IN'),
    });

    const parsed = schema.safeParse(req.body || {});
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' },
      });
    }

    // Curricular quiz questions (do not expose correct answer before submission)
    const questions = [
      {
        id: 'q_frac_101',
        subject: 'Mathematics',
        grade: parsed.data.grade,
        topic: 'Fractions Addition',
        questionText: parsed.data.language.startsWith('kn')
          ? '1/4 + 1/4 ನ ಮೊತ್ತ ಎಷ್ಟು?'
          : 'What is the sum of 1/4 + 1/4?',
        questionType: 'multiple_choice',
        options: ['2/8', '2/4 (ಅಥವಾ 1/2)', '1/8', '1/16'],
        difficulty: 'beginner',
        hint: 'Remember that the denominator represents the size of the slice, not how many slices you have!',
      },
      {
        id: 'q_frac_102',
        subject: 'Mathematics',
        grade: parsed.data.grade,
        topic: 'Fractions Comparison',
        questionText: parsed.data.language.startsWith('kn')
          ? 'ಯಾವ ಭಿನ್ನರಾಶಿ ದೊಡ್ಡದು: 1/3 ಅಥವಾ 1/8?'
          : 'Which fraction is greater: 1/3 or 1/8?',
        questionType: 'multiple_choice',
        options: ['1/8 is greater', '1/3 is greater', 'Both are equal', 'Cannot be compared'],
        difficulty: 'intermediate',
        hint: 'Imagine sharing a cake with 3 people versus 8 people.',
      },
    ];

    return {
      success: true,
      data: {
        quizId: `quiz_${Date.now()}`,
        subject: parsed.data.subject,
        grade: parsed.data.grade,
        questions,
      },
    };
  });

  // POST /api/v1/quizzes/:quizId/submit
  fastify.post('/quizzes/:quizId/submit', async (req, reply) => {
    const schema = z.object({
      questionId: z.string(),
      answer: z.string(),
      confidence: z.enum(['completely_sure', 'fairly_sure', 'not_sure', 'guessing']).default('fairly_sure'),
      hintsUsed: z.number().default(0),
      concept: z.string().default('Fractions Addition'),
      subject: z.string().default('Mathematics'),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' },
      });
    }

    const studentProfileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';

    // Mathematical evaluation
    let isCorrect = false;
    let expectedAnswer = '2/4';

    if (parsed.data.questionId === 'q_frac_101') {
      const evalRes = MathEvaluator.evaluate(parsed.data.answer, '2/4');
      isCorrect = evalRes.isCorrect;
      expectedAnswer = '2/4 (or 1/2)';
    } else if (parsed.data.questionId === 'q_frac_102') {
      isCorrect = parsed.data.answer.toLowerCase().includes('1/3');
      expectedAnswer = '1/3 is greater';
    } else {
      isCorrect = parsed.data.answer.trim().toLowerCase() === '2/4' || parsed.data.answer.trim().toLowerCase() === '1/2';
    }

    // Confidence Shield action plan
    const confidencePlan = ConfidenceEngine.evaluate(isCorrect, parsed.data.confidence as ConfidenceLevel);

    // Misconception detection if incorrect
    let misconceptionDiagnosis = null;
    if (!isCorrect) {
      misconceptionDiagnosis = MisconceptionEngine.diagnose(
        'What is 1/4 + 1/4?',
        parsed.data.answer
      );
    }

    // Update student concept mastery
    const updatedMastery = await MasteryRepository.updateMastery({
      studentProfileId,
      subject: parsed.data.subject,
      concept: parsed.data.concept,
      isCorrect,
      hintsUsed: parsed.data.hintsUsed,
      selfReportedConfidence: parsed.data.confidence,
    });

    return {
      success: true,
      data: {
        isCorrect,
        expectedAnswer,
        confidenceFeedback: confidencePlan,
        misconception: misconceptionDiagnosis?.hasMisconceptionHypothesis ? misconceptionDiagnosis : null,
        newMasteryScore: updatedMastery.mastery_score,
        attemptsCount: updatedMastery.attempts_count,
        feedback: isCorrect
          ? 'Excellent! You have added like fractions properly.'
          : 'Not quite. Notice how the denominators stay unchanged because they represent piece size.',
      },
    };
  });
};
