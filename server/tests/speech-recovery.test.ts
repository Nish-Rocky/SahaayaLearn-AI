import { describe, it, expect } from 'vitest';
import { SpeechRecoveryService } from '../src/voice/speech-recovery.service.js';

describe('SpeechRecoveryService', () => {
  it('triggers confirmation for ambiguous phonetic collisions like 15 vs 50', () => {
    const res = SpeechRecoveryService.assessAcousticClarity('The answer is fifteen');
    expect(res.needsConfirmation).toBe(true);
    expect(res.confirmationPrompt).toContain('fifteen');
  });

  it('triggers confirmation when acoustic confidence is abnormally low', () => {
    const res = SpeechRecoveryService.assessAcousticClarity('fraction', 0.42);
    expect(res.needsConfirmation).toBe(true);
    expect(res.confirmationPrompt).toBeDefined();
  });

  it('passes clear unambiguous transcripts without interruption', () => {
    const res = SpeechRecoveryService.assessAcousticClarity('Can you explain photosynthesis?', 0.96);
    expect(res.needsConfirmation).toBe(false);
  });
});
