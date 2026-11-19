export interface SpeechRecoveryResult {
  needsConfirmation: boolean;
  ambiguousTerms: string[];
  confirmationPrompt?: string;
  normalizedTranscript: string;
}

// Phonetically close educational number and concept pairs in Indian contexts
const PHONETIC_AMBIGUITIES: Array<{
  variants: string[];
  clarification: string;
}> = [
  {
    variants: ['fifteen', 'fifty', '15', '50'],
    clarification: 'Did you say fifteen (15) or fifty (50)? I want to make sure I heard your number correctly.',
  },
  {
    variants: ['thirteen', 'thirty', '13', '30'],
    clarification: 'Did you say thirteen (13) or thirty (30)? Just confirming before we continue.',
  },
  {
    variants: ['fourteen', 'forty', '14', '40'],
    clarification: 'Did you say fourteen (14) or forty (40)? Let’s double-check.',
  },
  {
    variants: ['sixteen', 'sixty', '16', '60'],
    clarification: 'Did you say sixteen (16) or sixty (60)?',
  },
  {
    variants: ['numerator', 'denominator'],
    clarification: 'Did you mean the numerator (top number) or the denominator (bottom number)?',
  },
];

export class SpeechRecoveryService {
  /**
   * Evaluates raw transcript for ambiguous phonetic collisions or low confidence.
   */
  static assessAcousticClarity(
    transcript: string,
    providerConfidence?: number
  ): SpeechRecoveryResult {
    const lower = transcript.toLowerCase();

    // 1. Check if provider confidence is very low (< 0.55)
    if (providerConfidence !== undefined && providerConfidence < 0.55 && transcript.trim().length > 0) {
      return {
        needsConfirmation: true,
        ambiguousTerms: [transcript],
        confirmationPrompt: `I want to make sure I heard you clearly. Did you say: "${transcript}"?`,
        normalizedTranscript: transcript,
      };
    }

    // 2. Check for numeric suffix ambiguities (-teen vs -ty)
    for (const ambig of PHONETIC_AMBIGUITIES) {
      const foundCount = ambig.variants.filter((v) => lower.includes(v)).length;
      if (foundCount >= 1 && (lower.endsWith('teen') || lower.endsWith('ty') || lower.includes('teen') || lower.includes('ty'))) {
        // If the context suggests ambiguity
        if (lower.includes('15') || lower.includes('50') || lower.includes('fifteen') || lower.includes('fifty')) {
          return {
            needsConfirmation: true,
            ambiguousTerms: ['15', '50'],
            confirmationPrompt: ambig.clarification,
            normalizedTranscript: transcript,
          };
        }
      }
    }

    return {
      needsConfirmation: false,
      ambiguousTerms: [],
      normalizedTranscript: transcript,
    };
  }
}
