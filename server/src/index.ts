import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { AppError } from './utils/errors.js';

// Route plugins
import { authRoutes } from './modules/auth/auth.routes.js';
import { tutorRoutes } from './modules/tutoring/tutor.routes.js';
import { voiceRoutes } from './modules/voice/voice.routes.js';
import { quizRoutes } from './modules/quizzes/quiz.routes.js';
import { progressRoutes } from './modules/learning/progress.routes.js';
import { familyRoutes } from './modules/family/family.routes.js';
import { adminRoutes } from './modules/admin/admin.routes.js';

// WebSocket Gateway
import { registerVoiceGateway } from './websocket/voice-gateway.js';

export async function buildServer() {
  const server = Fastify({
    logger: false, // We use custom pino logger
    trustProxy: true,
  });

  // 1. CORS
  const origins = env.CORS_ORIGINS.split(',').map((o) => o.trim());
  await server.register(cors, {
    origin: origins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
  });

  // 2. Sensible HTTP Utilities
  await server.register(sensible);

  // 3. Rate Limiting
  await server.register(rateLimit, {
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_TIME_WINDOW_MS,
  });

  // 4. WebSocket Plugin for Voice Gateway
  await server.register(websocket, {
    options: {
      maxPayload: 1048576, // 1MB audio frame ceiling
    },
  });

  // 5. Register Voice WebSocket Gateway
  registerVoiceGateway(server);

  // 6. Base Health & Readiness Probes
  server.get('/health', async () => ({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }));

  server.get('/ready', async () => ({
    status: 'ready',
    service: 'SahaayaLearn Backend',
  }));

  // 7. Register Versioned API Routes (/api/v1)
  server.register(async (api) => {
    await api.register(authRoutes);
    await api.register(tutorRoutes);
    await api.register(voiceRoutes);
    await api.register(quizRoutes);
    await api.register(progressRoutes);
    await api.register(familyRoutes);
    await api.register(adminRoutes);
  }, { prefix: '/api/v1' });

  // 8. Global Error Handler
  server.setErrorHandler((error, req, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
        requestId: req.id,
      });
    }

    logger.error({ err: error, path: req.url }, 'Unhandled server error');

    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected internal error occurred. Please try again.',
      },
      requestId: req.id,
    });
  });

  // 9. 404 Handler
  server.setNotFoundHandler((req, reply) => {
    return reply.status(404).send({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Endpoint ${req.method} ${req.url} does not exist.`,
      },
      requestId: req.id,
    });
  });

  return server;
}

// Start Server if run directly
async function start() {
  try {
    const server = await buildServer();
    await server.listen({ port: env.PORT, host: env.HOST });
    logger.info(`🚀 SahaayaLearn Backend Server running on http://${env.HOST}:${env.PORT}`);
    logger.info(`🎙️ Voice WebSocket Gateway available on ws://${env.HOST}:${env.PORT}/api/v1/voice/sessions/:sessionId/stream`);
  } catch (err) {
    logger.fatal({ err }, 'Failed to start SahaayaLearn backend server');
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}
