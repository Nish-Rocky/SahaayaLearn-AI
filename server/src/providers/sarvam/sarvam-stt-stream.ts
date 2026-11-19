import WebSocket from 'ws';
import { env, hasSarvam } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { getLanguageConfig } from '../../config/providers.js';

export interface SarvamStreamCallbacks {
  onPartialTranscript?: (transcript: string) => void;
  onFinalTranscript?: (transcript: string, confidence: number) => void;
  onError?: (err: Error) => void;
  onClose?: () => void;
}

export class SarvamSttStreamSession {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private languageCode: string;
  private callbacks: SarvamStreamCallbacks;

  constructor(languageCode = 'kn-IN', callbacks: SarvamStreamCallbacks = {}) {
    this.languageCode = languageCode;
    this.callbacks = callbacks;
  }

  async connect(): Promise<boolean> {
    if (!hasSarvam) {
      logger.info('Sarvam key not set; real-time STT WebSocket operating in buffered mode.');
      return false;
    }

    try {
      const langConfig = getLanguageConfig(this.languageCode);
      const url = `wss://api.sarvam.ai/speech-to-text-stream?model=${env.SARVAM_STT_MODEL}&language_code=${langConfig.code}&stream_type=fast&sample_rate=16000&encoding=linear16`;

      this.ws = new WebSocket(url, {
        headers: {
          'api-subscription-key': env.SARVAM_API_KEY,
        },
      });

      this.ws.on('open', () => {
        this.isConnected = true;
        logger.info({ language: this.languageCode }, 'Sarvam Saaras STT WebSocket connected');
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const msg = JSON.parse(data.toString());
          if (msg.type === 'partial' || msg.is_final === false) {
            this.callbacks.onPartialTranscript?.(msg.transcript || msg.text || '');
          } else if (msg.type === 'final' || msg.is_final === true) {
            this.callbacks.onFinalTranscript?.(msg.transcript || msg.text || '', msg.confidence ?? 0.95);
          }
        } catch {
          // Non-JSON or binary packet
        }
      });

      this.ws.on('error', (err: any) => {
        logger.error({ err }, 'Sarvam STT WebSocket error');
        this.callbacks.onError?.(err);
      });

      this.ws.on('close', () => {
        this.isConnected = false;
        this.callbacks.onClose?.();
      });

      return true;
    } catch (err: any) {
      logger.error({ err: err.message }, 'Failed to initiate Sarvam STT stream');
      return false;
    }
  }

  sendAudioChunk(pcmChunk: Buffer) {
    if (this.ws && this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(pcmChunk);
    }
  }

  close() {
    if (this.ws) {
      try {
        this.ws.close();
      } catch {}
      this.ws = null;
    }
    this.isConnected = false;
  }
}
