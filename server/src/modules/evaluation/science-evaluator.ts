export interface ScienceRubric {
  concept: string;
  requiredKeywords: string[];
  minimumKeywordMatches?: number;
  forbiddenMisconceptions?: string[];
}

export interface ScienceEvaluationResult {
  isCorrect: boolean;
  score: number; // 0.0 to 1.0
  matchedKeywords: string[];
  missingKeywords: string[];
  feedback: string;
}

export class ScienceEvaluator {
  static evaluate(
    userAnswer: string,
    rubric: ScienceRubric
  ): ScienceEvaluationResult {
    const cleanAnswer = userAnswer.toLowerCase();
    const matched: string[] = [];
    const missing: string[] = [];

    rubric.requiredKeywords.forEach((kw) => {
      if (cleanAnswer.includes(kw.toLowerCase())) {
        matched.push(kw);
      } else {
        missing.push(kw);
      }
    });

    const minMatches = rubric.minimumKeywordMatches ?? Math.ceil(rubric.requiredKeywords.length * 0.5);
    const score = rubric.requiredKeywords.length > 0 ? matched.length / rubric.requiredKeywords.length : 1.0;
    const isCorrect = matched.length >= minMatches;

    let feedback = '';
    if (isCorrect) {
      feedback = `Good understanding! You correctly articulated key concepts: ${matched.join(', ')}.`;
    } else {
      feedback = `You're on the right track, but ensure you include essential ideas such as: ${missing.slice(0, 2).join(', ')}.`;
    }

    return {
      isCorrect,
      score: Number(score.toFixed(2)),
      matchedKeywords: matched,
      missingKeywords: missing,
      feedback,
    };
  }
}
