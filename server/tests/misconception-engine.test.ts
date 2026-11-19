import { describe, it, expect } from 'vitest';
import { MisconceptionEngine } from '../src/modules/misconceptions/misconception-engine.js';

describe('MisconceptionEngine (Sahaaya X-Ray)', () => {
  it('detects ADD_NUMERATOR_AND_DENOMINATOR misconception when student answers 2/8 for fraction addition', () => {
    const res = MisconceptionEngine.diagnose('What is 1/4 + 1/4?', '2/8');
    expect(res.hasMisconceptionHypothesis).toBe(true);
    expect(res.misconceptionCode).toBe('ADD_NUMERATOR_AND_DENOMINATOR');
    expect(res.diagnosticQuestion).toBeDefined();
    expect(res.correctionStrategy).toBeDefined();
  });

  it('detects LARGER_DENOMINATOR_LARGER_VALUE misconception when student picks 1/8 over 1/4', () => {
    const res = MisconceptionEngine.diagnose('Which is larger: 1/4 or 1/8?', '1/8 is larger');
    expect(res.hasMisconceptionHypothesis).toBe(true);
    expect(res.misconceptionCode).toBe('LARGER_DENOMINATOR_LARGER_VALUE');
  });

  it('returns false for correct answers with no misconception signatures', () => {
    const res = MisconceptionEngine.diagnose('What is 1/4 + 1/4?', '2/4');
    expect(res.hasMisconceptionHypothesis).toBe(false);
  });
});
