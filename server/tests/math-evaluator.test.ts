import { describe, it, expect } from 'vitest';
import { MathEvaluator } from '../src/modules/evaluation/math-evaluator.js';

describe('MathEvaluator', () => {
  it('correctly validates identical string answers', () => {
    const res = MathEvaluator.evaluate('3/5', '3/5');
    expect(res.isCorrect).toBe(true);
  });

  it('correctly evaluates equivalent fractions (2/4 vs 1/2)', () => {
    const res = MathEvaluator.evaluate('2/4', '1/2');
    expect(res.isCorrect).toBe(true);
  });

  it('correctly evaluates equivalent fractions (4/8 vs 1/2)', () => {
    const res = MathEvaluator.evaluate('4/8', '1/2');
    expect(res.isCorrect).toBe(true);
  });

  it('rejects incorrect fraction additions (2/8 vs 2/4)', () => {
    const res = MathEvaluator.evaluate('2/8', '2/4');
    expect(res.isCorrect).toBe(false);
  });

  it('handles decimal and fraction equivalences (0.5 vs 1/2)', () => {
    const res = MathEvaluator.evaluate('0.5', '1/2');
    expect(res.isCorrect).toBe(true);
  });
});
