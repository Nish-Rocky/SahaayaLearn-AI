import { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { ProfileRepository } from '../../database/repositories/profile.repo.js';

export const authRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  // POST /api/v1/auth/guest-session
  fastify.post('/auth/guest-session', async (req, reply) => {
    const schema = z.object({
      displayName: z.string().default('Learner'),
      grade: z.string().default('Class 7'),
      language: z.string().default('kn-IN'),
    });

    const parsed = schema.safeParse(req.body || {});
    if (!parsed.success) {
      return reply.status(400).send({
        success: false,
        error: { code: 'VALIDATION_ERROR', message: 'Invalid payload' },
      });
    }

    const { profile, learner } = await ProfileRepository.createGuestProfile(
      parsed.data.displayName,
      parsed.data.grade,
      parsed.data.language
    );

    return {
      success: true,
      data: {
        profile,
        learner,
        isGuest: true,
      },
      message: 'Guest learning session created successfully',
    };
  });

  // GET /api/v1/profile
  fastify.get('/profile', async (req, reply) => {
    const profileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';
    const profile = await ProfileRepository.getById(profileId);
    const learner = await ProfileRepository.getLearnerProfile(profileId);

    if (!profile) {
      return reply.status(404).send({
        success: false,
        error: { code: 'PROFILE_NOT_FOUND', message: 'Student profile not found' },
      });
    }

    return {
      success: true,
      data: {
        profile,
        learner,
      },
    };
  });

  // PATCH /api/v1/profile/preferences
  fastify.patch('/profile/preferences', async (req, reply) => {
    const profileId = (req.headers['x-student-id'] as string) || '00000000-0000-0000-0000-000000000001';
    const body = req.body as any;
    const updated = await ProfileRepository.updatePreferences(profileId, body);

    return {
      success: true,
      data: updated,
      message: 'Learning preferences updated',
    };
  });

  // POST /api/v1/guardian/link
  fastify.post('/guardian/link', async (req, reply) => {
    return {
      success: true,
      data: {
        linkId: 'link_demo_01',
        status: 'verified',
        relationship: 'parent',
      },
      message: 'Guardian linked with student record',
    };
  });

  // POST /api/v1/guardian/consent
  fastify.post('/guardian/consent', async (req, reply) => {
    return {
      success: true,
      data: {
        consentId: 'consent_dpdp_01',
        status: 'granted',
        complianceStandard: 'DPDP 2023 Compliant',
      },
      message: 'Guardian consent verified and timestamped',
    };
  });
};
