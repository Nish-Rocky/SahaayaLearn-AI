export type ConfidenceLevel = 'completely_sure' | 'fairly_sure' | 'not_sure' | 'guessing';

export interface ConfidenceActionPlan {
  pedagogicalAction: 'escalate_challenge' | 'reinforce_and_verify' | 'diagnose_misconception' | 'supportive_hint';
  shieldLevel: 1 | 2 | 3;
  feedbackTone: string;
  nextStepPrompt: string;
}

export class ConfidenceEngine {
  static evaluate(isCorrect: boolean, confidence: ConfidenceLevel): ConfidenceActionPlan {
    if (isCorrect) {
      if (confidence === 'completely_sure') {
        return {
          pedagogicalAction: 'escalate_challenge',
          shieldLevel: 3,
          feedbackTone: 'celebratory_and_stretching',
          nextStepPrompt: 'Fantastic! You mastered this clearly and with confidence. Ready to try a slightly more advanced application?',
        };
      } else {
        // Correct but uncertain/guessing
        return {
          pedagogicalAction: 'reinforce_and_verify',
          shieldLevel: 2,
          feedbackTone: 'affirming_and_clarifying',
          nextStepPrompt: 'Your answer is right! But notice that you felt uncertain. Let us briefly solidify why this is correct so you can feel 100% sure next time.',
        };
      }
    } else {
      if (confidence === 'completely_sure') {
        // Incorrect but was completely sure -> Strong misconception signature!
        return {
          pedagogicalAction: 'diagnose_misconception',
          shieldLevel: 1,
          feedbackTone: 'curious_and_non_judgmental',
          nextStepPrompt: 'Interesting! You felt confident about that answer, which usually means there is a hidden trick or conceptual knot. Let us untangle the reasoning together.',
        };
      } else {
        // Incorrect and knew they were unsure -> Needs gentle supportive scaffold
        return {
          pedagogicalAction: 'supportive_hint',
          shieldLevel: 1,
          feedbackTone: 'gentle_and_supportive',
          nextStepPrompt: 'No worries at all — learning is all about experimenting! Here is a small clue to help you see the pattern.',
        };
      }
    }
  }
}
