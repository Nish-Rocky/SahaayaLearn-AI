import { Decimal } from 'decimal.js';

export interface MathEvaluationResult {
  isCorrect: boolean;
  normalizedUserAnswer: string;
  expectedAnswer: string;
  explanation: string;
  difference?: number;
}

export class MathEvaluator {
  /**
   * Parse a string fraction (e.g. "3/4", " 2 / 8 ", "-1/2") into Decimal numerator and denominator.
   */
  static parseFraction(str: string): { numerator: Decimal; denominator: Decimal } | null {
    const trimmed = str.trim();
    const parts = trimmed.split('/');
    if (parts.length === 2) {
      try {
        const num = new Decimal(parts[0].trim());
        const den = new Decimal(parts[1].trim());
        if (den.isZero()) return null;
        return { numerator: num, denominator: den };
      } catch {
        return null;
      }
    } else if (parts.length === 1) {
      try {
        const val = new Decimal(parts[0].trim());
        return { numerator: val, denominator: new Decimal(1) };
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Determine whether student's answer is equivalent to the expected answer,
   * accounting for fractions, decimals, whitespace, and negative signs.
   */
  static evaluate(userAnswer: string, expectedAnswer: string): MathEvaluationResult {
    const cleanUser = userAnswer.trim().toLowerCase();
    const cleanExpected = expectedAnswer.trim().toLowerCase();

    // 1. Direct textual match
    if (cleanUser === cleanExpected) {
      return {
        isCorrect: true,
        normalizedUserAnswer: cleanUser,
        expectedAnswer: cleanExpected,
        explanation: 'Exact match verified.',
      };
    }

    // 2. Numerical fraction evaluation
    const userFrac = this.parseFraction(cleanUser);
    const expFrac = this.parseFraction(cleanExpected);

    if (userFrac && expFrac) {
      const userVal = userFrac.numerator.dividedBy(userFrac.denominator);
      const expVal = expFrac.numerator.dividedBy(expFrac.denominator);

      // Tolerance of 1e-6
      const diff = userVal.minus(expVal).abs().toNumber();
      const isEquivalent = diff < 0.000001;

      if (isEquivalent) {
        return {
          isCorrect: true,
          normalizedUserAnswer: `${userFrac.numerator}/${userFrac.denominator}`,
          expectedAnswer: cleanExpected,
          explanation: `Equivalent value verified (${cleanUser} = ${cleanExpected}).`,
          difference: diff,
        };
      } else {
        return {
          isCorrect: false,
          normalizedUserAnswer: cleanUser,
          expectedAnswer: cleanExpected,
          explanation: `Values differ (${userVal.toString()} vs ${expVal.toString()}).`,
          difference: diff,
        };
      }
    }

    // 3. Fallback string normalization comparison (e.g. "1/3 is larger" vs "1/3 is larger")
    const simplifiedUser = cleanUser.replace(/[^a-z0-9/]/g, '');
    const simplifiedExp = cleanExpected.replace(/[^a-z0-9/]/g, '');

    const isMatch = simplifiedUser.includes(simplifiedExp) || simplifiedExp.includes(simplifiedUser);

    return {
      isCorrect: isMatch,
      normalizedUserAnswer: cleanUser,
      expectedAnswer: cleanExpected,
      explanation: isMatch ? 'Normalized answer matches expected concept.' : 'Answer does not match expected solution.',
    };
  }
}
