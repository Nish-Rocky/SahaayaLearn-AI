import { FastifyInstance } from 'fastify';
import { VoiceSessionManager } from './voice-session-manager.js';
import { SarvamSttService } from '../providers/sarvam/sarvam-stt.service.js';
import { SarvamTtsService } from '../providers/sarvam/sarvam-tts.service.js';
import { AiOrchestrator } from '../orchestration/ai-orchestrator.js';
import { SpeechRecoveryService } from '../voice/speech-recovery.service.js';
import { SpeechResponseService } from '../voice/speech-response.service.js';
import { AudioResponseQueue } from '../voice/audio-response.queue.js';
import { logger } from '../utils/logger.js';

export function registerVoiceGateway(fastify: FastifyInstance) {
  fastify.get(
    '/api/v1/voice/sessions/:sessionId/stream',
    { websocket: true },
    (connection, req) => {
      const socket: any = (connection as any).socket || connection;
      const { sessionId } = req.params as { sessionId: string };
      const session = VoiceSessionManager.getSession(sessionId);

      if (!session) {
        socket.send(
          JSON.stringify({
            event: 'session.error',
            error: { code: 'SESSION_EXPIRED', message: 'Voice session expired or invalid' },
          })
        );
        socket.close();
        return;
      }

      // 1. Acknowledge session readiness
      socket.send(
        JSON.stringify({
          event: 'session.ready',
          sessionId,
          inputLanguage: session.inputLanguage,
          outputLanguage: session.outputLanguage,
          timestamp: Date.now(),
        })
      );

      let audioChunksBuffer: Buffer[] = [];
      let activeTtsQueue: AudioResponseQueue | null = null;
      let currentTurnId = 0;

      socket.on('message', async (rawMessage: Buffer) => {
        try {
          // Check if message is JSON control event or binary audio frame
          let isJson = false;
          let jsonPayload: any = null;

          try {
            const str = rawMessage.toString('utf-8');
            if (str.startsWith('{') && str.endsWith('}')) {
              jsonPayload = JSON.parse(str);
              isJson = true;
            }
          } catch {
            isJson = false;
          }

          if (isJson && jsonPayload) {
            // Handle control event: user interruption (barge-in)
            if (jsonPayload.event === 'user.interrupted' || jsonPayload.event === 'vad.speech_start') {
              VoiceSessionManager.interrupt(sessionId);
              if (activeTtsQueue) {
                activeTtsQueue.interrupt();
                activeTtsQueue = null;
              }
              audioChunksBuffer = [];
              socket.send(
                JSON.stringify({
                  event: 'assistant.interrupted',
                  sessionId,
                  turnId: currentTurnId,
                  timestamp: Date.now(),
                })
              );
              return;
            }

            // Handle explicit stop speaking
            if (jsonPayload.event === 'voice.stop') {
              if (activeTtsQueue) {
                activeTtsQueue.interrupt();
                activeTtsQueue = null;
              }
              socket.send(
                JSON.stringify({
                  event: 'assistant.interrupted',
                  sessionId,
                  timestamp: Date.now(),
                })
              );
              return;
            }

            // Handle completion of student speaking
            if (jsonPayload.event === 'audio.end') {
              currentTurnId++;
              const turnId = `turn-${currentTurnId}-${Date.now()}`;
              const completeBuffer = Buffer.concat(audioChunksBuffer);
              audioChunksBuffer = [];

              if (completeBuffer.length === 0) {
                return;
              }

              // A. Transcribe audio via Sarvam Saaras v4
              let sttResult;
              try {
                sttResult = await SarvamSttService.transcribeAudio(completeBuffer, session.inputLanguage);
              } catch (e: any) {
                socket.send(
                  JSON.stringify({
                    event: 'session.error',
                    turnId,
                    error: { code: 'TRANSCRIPTION_FAILED', message: e.message },
                  })
                );
                return;
              }

              // B. Send Final Transcript to client
              socket.send(
                JSON.stringify({
                  event: 'transcript.final',
                  turnId,
                  transcript: sttResult.transcript,
                  confidence: sttResult.confidence,
                  languageCode: sttResult.languageCode,
                  timestamp: Date.now(),
                })
              );

              // C. Check Acoustic Clarity / Speech Recovery
              const recoveryCheck = SpeechRecoveryService.assessAcousticClarity(
                sttResult.transcript,
                sttResult.confidence
              );

              if (recoveryCheck.needsConfirmation && recoveryCheck.confirmationPrompt) {
                socket.send(
                  JSON.stringify({
                    event: 'assistant.thinking',
                    turnId,
                    status: 'confirming_acoustic_clarity',
                  })
                );

                socket.send(
                  JSON.stringify({
                    event: 'assistant.text.final',
                    turnId,
                    text: recoveryCheck.confirmationPrompt,
                  })
                );

                try {
                  const clarTts = await SarvamTtsService.synthesizeSpeech(
                    recoveryCheck.confirmationPrompt,
                    session.outputLanguage
                  );

                  if (clarTts.audioBase64) {
                    socket.send(
                      JSON.stringify({
                        event: 'tts.audio.chunk',
                        turnId,
                        audioBase64: clarTts.audioBase64,
                        format: clarTts.format,
                        durationEstimateSeconds: clarTts.durationEstimateSeconds,
                      })
                    );
                  }
                } catch {}

                socket.send(
                  JSON.stringify({ event: 'assistant.completed', turnId, timestamp: Date.now() })
                );
                return;
              }

              // D. Assistant Thinking
              socket.send(
                JSON.stringify({
                  event: 'assistant.thinking',
                  turnId,
                  status: 'retrieving_and_reasoning',
                  timestamp: Date.now(),
                })
              );

              // E. Initialize Streaming Sentence-Level TTS Queue
              let sequenceNum = 0;
              activeTtsQueue = SpeechResponseService.createQueue({
                languageCode: session.outputLanguage,
                speechRate: 1.0,
                onAudioSegment: (segment) => {
                  if (segment.audioResult?.audioBase64) {
                    socket.send(
                      JSON.stringify({
                        event: 'tts.audio.chunk',
                        turnId,
                        sequenceIndex: segment.sequenceIndex,
                        audioBase64: segment.audioResult.audioBase64,
                        format: segment.audioResult.format,
                        durationEstimateSeconds: segment.audioResult.durationEstimateSeconds,
                        isLast: segment.isLast,
                        text: segment.text,
                      })
                    );
                  }
                },
              });

              // F. Orchestrate turn with Groq GPT-OSS + RAG
              const turnResult = await AiOrchestrator.processTurn({
                sessionId,
                studentProfileId: session.studentProfileId,
                question: sttResult.transcript,
                teachingLanguage: session.inputLanguage,
                academicLanguage: session.outputLanguage,
                synthesizeVoice: true,
              });

              // Check if interrupted while thinking
              if (session.isInterrupted) {
                session.isInterrupted = false;
                return;
              }

              // G. Stream text final and metadata
              socket.send(
                JSON.stringify({
                  event: 'assistant.text.final',
                  turnId,
                  text: turnResult.tutorResponse.answer,
                  providerUsed: turnResult.providerUsed,
                  modelUsed: turnResult.modelUsed,
                  metadata: {
                    shortExplanation: turnResult.tutorResponse.shortExplanation,
                    examples: turnResult.tutorResponse.examples,
                    keyTerms: turnResult.tutorResponse.keyTerms,
                    isTextbookGrounded: turnResult.grounding.isTextbookGrounded,
                    citations: turnResult.grounding.citationMetadata,
                  },
                  timestamp: Date.now(),
                })
              );

              // H. Stream audio chunk if generated
              if (turnResult.audio?.audioBase64) {
                socket.send(
                  JSON.stringify({
                    event: 'tts.audio.chunk',
                    turnId,
                    sequenceIndex: sequenceNum++,
                    audioBase64: turnResult.audio.audioBase64,
                    format: turnResult.audio.format,
                    durationEstimateSeconds: turnResult.audio.durationEstimateSeconds,
                    isLast: true,
                    text: turnResult.tutorResponse.answer,
                  })
                );
              }

              // I. Complete Turn Event
              socket.send(
                JSON.stringify({
                  event: 'assistant.completed',
                  turnId,
                  timestamp: Date.now(),
                })
              );
            }
          } else {
            // Binary audio chunk (16kHz PCM linear16) from microphone stream
            audioChunksBuffer.push(rawMessage);
          }
        } catch (err: any) {
          logger.error({ err: err.message }, 'Voice WebSocket gateway error handling frame');
          socket.send(
            JSON.stringify({
              event: 'assistant.error',
              error: { code: 'PROCESSING_ERROR', message: err.message },
              timestamp: Date.now(),
            })
          );
        }
      });

      socket.on('close', () => {
        if (activeTtsQueue) {
          activeTtsQueue.interrupt();
        }
        audioChunksBuffer = [];
      });
    }
  );
}
