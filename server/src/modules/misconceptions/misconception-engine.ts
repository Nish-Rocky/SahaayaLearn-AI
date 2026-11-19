import { MasteryRepository, StudentMisconceptionRecord } from '../../database/repositories/mastery.repo.js';

export interface MisconceptionDetectionResult {
  hasMisconceptionHypothesis: boolean;
  misconceptionCode?: string;
  concept?: string;
  description?: string;
  diagnosticQuestion?: string;
  correctiveStrategy?: string;
  correctionStrategy?: string;
  verificationQuestion?: string;
}

export class MisconceptionEngine {
  /**
   * Diagnostic heuristics for common mathematical and scientific misconceptions.
   */
  static diagnose(
    questionContext: string,
    studentAnswer: string
  ): MisconceptionDetectionResult {
    const qLower = questionContext.toLowerCase();
    const aLower = studentAnswer.toLowerCase().replace(/\s+/g, '');

    // 1. Fractions: Adding numerators and denominators
    // e.g. 1/4 + 1/4 = 2/8, or 1/3 + 1/3 = 2/6, or 2/5 + 1/5 = 3/10
    if (
      (qLower.includes('fraction') || qLower.includes('+') || qLower.includes('add') || qLower.includes('ಭಿನ್ನರಾಶಿ')) &&
      (aLower === '2/8' || aLower === '2/6' || aLower === '3/10' || aLower.includes('2/8') || aLower.includes('3/10'))
    ) {
      return {
        hasMisconceptionHypothesis: true,
        misconceptionCode: 'ADD_NUMERATOR_AND_DENOMINATOR',
        concept: 'Fractions Addition',
        description: 'Learner added both numerators and denominators together.',
        diagnosticQuestion: 'Imagine you have two quarter pieces of a roti (1/4 and 1/4). If you place them side by side, did the size of the pieces change to eighths, or did you just get two quarters?',
        correctiveStrategy: 'Explain denominator invariance: the denominator indicates slice size (like "centimeters"), so you keep it unchanged.',
        correctionStrategy: 'Explain denominator invariance: the denominator indicates slice size (like "centimeters"), so you keep it unchanged.',
        verificationQuestion: 'If you have 1/5 of a watermelon and take another 2/5 of the same watermelon, how many fifths do you have in total?',
      };
    }

    // 2. Fraction Magnitude: Larger denominator = larger fraction
    if (
      (qLower.includes('larger') || qLower.includes('greater') || qLower.includes('ದೊಡ್ಡದು') || qLower.includes('बड़ा')) &&
      (aLower.includes('1/8') || aLower.includes('1/6') || aLower.includes('1/10')) &&
      (qLower.includes('1/4') || qLower.includes('1/3') || qLower.includes('1/2'))
    ) {
      return {
        hasMisconceptionHypothesis: true,
        misconceptionCode: 'LARGER_DENOMINATOR_LARGER_VALUE',
        concept: 'Fraction Magnitude',
        description: 'Learner assumed a larger denominator creates a larger overall fraction.',
        diagnosticQuestion: 'If a birthday cake is divided equally among 8 children versus 2 children, who gets the bigger slice of cake?',
        correctiveStrategy: 'Demonstrate that dividing a whole into more parts makes each individual part smaller.',
        verificationQuestion: 'Which piece is bigger: 1/4 of a pizza or 1/2 of the same pizza?',
      };
    }

    // 3. Integers: Larger negative number is greater
    if (
      (qLower.includes('integer') || qLower.includes('negative') || qLower.includes('ಋಣ') || qLower.includes('ऋणात्मक')) &&
      (aLower === '-8' || aLower === '-10') &&
      (qLower.includes('-3') || qLower.includes('-2'))
    ) {
      return {
        hasMisconceptionHypothesis: true,
        misconceptionCode: 'LARGER_NEGATIVE_IS_GREATER',
        concept: 'Negative Integers',
        description: 'Learner assumed -8 is greater than -3 because 8 is larger than 3.',
        diagnosticQuestion: 'Think of temperature: is -8 degrees Celsius warmer or colder than -3 degrees Celsius?',
        correctiveStrategy: 'Use number line position: numbers further to the left on the number line are always smaller in value.',
        verificationQuestion: 'Which number is further to the right on a number line: -1 or -5?',
      };
    }

    // 4. Photosynthesis: Plants eat soil
    if (
      (qLower.includes('photosynthesis') || qLower.includes('plant') || qLower.includes('food') || qLower.includes('ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ')) &&
      (aLower.includes('soil') || aLower.includes('mud') || aLower.includes('dirt') || aLower.includes('ಮಣ್ಣು'))
    ) {
      return {
        hasMisconceptionHypothesis: true,
        misconceptionCode: 'PLANTS_EAT_SOIL_DIRECTLY',
        concept: 'Photosynthesis Autotrophy',
        description: 'Learner assumed plants get solid food matter directly out of the soil.',
        diagnosticQuestion: 'Roots absorb water and minerals, but where do you think the carbon that builds the tree leaves and trunk comes from: the air or the dirt?',
        correctiveStrategy: 'Clarify that plants build their organic mass by capturing carbon dioxide from the air using sunlight.',
        verificationQuestion: 'What gas do leaves take in from the air to make glucose sugars?',
      };
    }

    return {
      hasMisconceptionHypothesis: false,
    };
  }

  /**
   * Records a detected misconception hypothesis to student telemetry
   */
  static async recordHypothesis(
    studentProfileId: string,
    sessionId: string,
    diagnosis: MisconceptionDetectionResult,
    evidence: string
  ): Promise<StudentMisconceptionRecord | null> {
    if (!diagnosis.hasMisconceptionHypothesis || !diagnosis.misconceptionCode) {
      return null;
    }

    return await MasteryRepository.recordMisconception({
      student_profile_id: studentProfileId,
      session_id: sessionId,
      concept: diagnosis.concept || 'General Concept',
      misconception_code: diagnosis.misconceptionCode,
      evidence_summary: evidence,
      confidence_level: 'hypothesis',
      verification_status: 'in_review',
      correction_status: 'pending',
    });
  }
}
