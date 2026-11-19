import { SarvamTtsService, SarvamTtsResult } from '../providers/sarvam/sarvam-tts.service.js';
import { logger } from '../utils/logger.js';

export interface QueuedAudioSegment {
  sequenceIndex: number;
  text: string;
  isLast: boolean;
  audioResult?: SarvamTtsResult;
  status: 'pending' | 'synthesizing' | 'ready' | 'failed' | 'interrupted';
}

export class AudioResponseQueue {
  private segments: QueuedAudioSegment[] = [];
  private isInterrupted = false;
  private readonly languageCode: string;
  private readonly speechRate: number;
  private readonly onSegmentReady: (segment: QueuedAudioSegment) => void;

  constructor(
    languageCode = 'kn-IN',
    speechRate = 1.0,
    onSegmentReady: (segment: QueuedAudioSegment) => void
  ) {
    this.languageCode = languageCode;
    this.speechRate = speechRate;
    this.onSegmentReady = onSegmentReady;
  }

  /**
   * Enqueue a newly completed sentence for immediate speech synthesis
   */
  async enqueueSentence(sentence: string, isLast = false) {
    if (this.isInterrupted) return;

    const clean = SarvamTtsService.cleanSpokenText(sentence);
    if (!clean) {
      if (isLast && this.segments.length > 0) {
        this.segments[this.segments.length - 1].isLast = true;
      }
      return;
    }

    const segment: QueuedAudioSegment = {
      sequenceIndex: this.segments.length,
      text: clean,
      isLast,
      status: 'pending',
    };
    this.segments.push(segment);

    // Process synthesis immediately
    this.synthesizeSegment(segment);
  }

  private async synthesizeSegment(segment: QueuedAudioSegment) {
    if (this.isInterrupted) {
      segment.status = 'interrupted';
      return;
    }

    segment.status = 'synthesizing';
    try {
      const result = await SarvamTtsService.synthesizeSpeech(
        segment.text,
        this.languageCode,
        this.speechRate
      );

      if (this.isInterrupted) {
        segment.status = 'interrupted';
        return;
      }

      segment.audioResult = result;
      segment.status = 'ready';
      this.onSegmentReady(segment);
    } catch (err: any) {
      logger.warn({ err: err.message, text: segment.text }, 'Failed synthesizing audio segment');
      segment.status = 'failed';
    }
  }

  /**
   * Immediately interrupts the queue and stops pending speech requests
   */
  interrupt() {
    this.isInterrupted = true;
    for (const seg of this.segments) {
      if (seg.status === 'pending' || seg.status === 'synthesizing') {
        seg.status = 'interrupted';
      }
    }
    logger.info({ segmentsCancelled: this.segments.length }, 'AudioResponseQueue interrupted');
  }

  getCompletedCount() {
    return this.segments.filter((s) => s.status === 'ready').length;
  }
}
