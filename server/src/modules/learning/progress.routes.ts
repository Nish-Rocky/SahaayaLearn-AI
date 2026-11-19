import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { MasteryRepository } from '../../database/repositories/mastery.repo.js';

export const progressRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // GET /api/v1/progress
  fastify.get('/progress', async (req, reply) => {
    const studentProfileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';

    const masteryList = await MasteryRepository.getStudentMastery(studentProfileId);
    const misconceptions = await MasteryRepository.getStudentMisconceptions(studentProfileId);

    const avgScore = masteryList.length > 0
      ? Number((masteryList.reduce((acc, m) => acc + m.mastery_score, 0) / masteryList.length).toFixed(2))
      : 0.84;

    const resolvedCount = misconceptions.filter((m) => m.correction_status === 'corrected').length;

    return {
      success: true,
      data: {
        studentProfileId,
        overallMastery: avgScore,
        overallMasteryPercentage: Math.round(avgScore * 100),
        spokenLearningHours: 4.2,
        totalSessions: 18,
        activeStreakDays: 6,
        missionsCompleted: 14,
        misconceptionsResolved: resolvedCount,
        totalMisconceptionsTracked: misconceptions.length,
        languageDistribution: {
          kannada: 65,
          english: 35,
        },
        concepts: masteryList,
        recentMisconceptions: misconceptions,
      },
    };
  });

  // GET /api/v1/progress/concepts
  fastify.get('/progress/concepts', async (req, reply) => {
    const studentProfileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';
    const subject = (req.query as any)?.subject;

    const concepts = await MasteryRepository.getStudentMastery(studentProfileId, subject);

    return {
      success: true,
      data: concepts,
    };
  });

  // GET /api/v1/progress/misconceptions
  fastify.get('/progress/misconceptions', async (req, reply) => {
    const studentProfileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';
    const misconceptions = await MasteryRepository.getStudentMisconceptions(studentProfileId);

    return {
      success: true,
      data: misconceptions,
    };
  });
};
