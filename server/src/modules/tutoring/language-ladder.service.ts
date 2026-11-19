export interface LanguageLadderProgression {
  concept: string;
  teachingLanguage: string;
  academicLanguage: string;
  step1_homeLanguageExplanation: string;
  step2_conceptualBridge: {
    homeTerm: string;
    bridgeMeaning: string;
    academicTerm: string;
  }[];
  step3_examExpressionPrompt: string;
  expectedKeyTermsInAcademicLanguage: string[];
}

export class LanguageLadderService {
  /**
   * Generates a 3-step Language Ladder lesson progression
   */
  static getLadderForConcept(
    concept: string,
    teachingLanguage = 'kn-IN',
    academicLanguage = 'en-IN'
  ): LanguageLadderProgression {
    const isKannada = teachingLanguage.startsWith('kn');

    if (concept.toLowerCase().includes('fraction') || concept.toLowerCase().includes('ಭಿನ್ನರಾಶಿ')) {
      return {
        concept: 'Fractions (ಭಿನ್ನರಾಶಿಗಳು)',
        teachingLanguage,
        academicLanguage,
        step1_homeLanguageExplanation: isKannada
          ? 'ಭಿನ್ನರಾಶಿ ಎಂದರೆ ಒಂದು ಪೂರ್ಣ ವಸ್ತುವನ್ನು ಸಮಾನ ಭಾಗಗಳಾಗಿ ವಿಂಗಡಿಸಿದಾಗ, ನಾವು ತೆಗೆದುಕೊಳ್ಳುವ ಭಾಗವನ್ನು ಸೂಚಿಸುವ ಸಂಖ್ಯೆ. ಉದಾಹರಣೆಗೆ ಒಂದು ರೊಟ್ಟಿಯನ್ನು 4 ಸಮಾನ ಭಾಗ ಮಾಡಿದರೆ, 1 ಭಾಗವು ನಾಲ್ಕರಲ್ಲಿ ಒಂದು ಪಾಲು (1/4).'
          : 'भिन्न का अर्थ है किसी पूरी वस्तु को समान हिस्सों में बांटने पर मिलने वाला हिस्सा। जैसे यदि एक रोटी को 4 बराबर भागों में बांटें, तो 1 भाग 1/4 होगा।',
        step2_conceptualBridge: [
          {
            homeTerm: isKannada ? 'ನಾಲ್ಕರಲ್ಲಿ ಒಂದು ಪಾಲು' : 'चार में से एक हिस्सा',
            bridgeMeaning: 'Taking 1 part out of 4 equal partitions',
            academicTerm: 'One-fourth (1/4) — Proper Fraction',
          },
          {
            homeTerm: isKannada ? 'ಅಂಶ (ಮೇಲಿನ ಸಂಖ್ಯೆ)' : 'अंश (ऊपर की संख्या)',
            bridgeMeaning: 'Number of selected parts',
            academicTerm: 'Numerator',
          },
          {
            homeTerm: isKannada ? 'ಛೇದ (ಕೆಳಗಿನ ಸಂಖ್ಯೆ)' : 'हर (नीचे की संख्या)',
            bridgeMeaning: 'Total equal parts forming the whole',
            academicTerm: 'Denominator',
          },
        ],
        step3_examExpressionPrompt:
          'Now try explaining what a fraction is in English for your exam. Mention numerator and denominator.',
        expectedKeyTermsInAcademicLanguage: ['fraction', 'numerator', 'denominator', 'equal parts', 'whole'],
      };
    }

    // Default science: Photosynthesis
    return {
      concept: 'Photosynthesis (ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ)',
      teachingLanguage,
      academicLanguage,
      step1_homeLanguageExplanation: isKannada
        ? 'ಹಸಿರು ಸಸ್ಯಗಳು ಸೂರ್ಯನ ಬೆಳಕು, ನೀರು ಮತ್ತು ಗಾಳಿಯಲ್ಲಿರುವ ಇಂಗಾಲದ ಡೈಆಕ್ಸೈಡ್ ಬಳಸಿ ತಮಗೆ ಬೇಕಾದ ಆಹಾರವನ್ನು (ಗ್ಲೂಕೋಸ್) ತಯಾರಿಸಿಕೊಳ್ಳುವ ಪ್ರಕ್ರಿಯೆಗೆ ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ ಎನ್ನುತ್ತಾರೆ.'
        : 'हरे पौधे सूर्य के प्रकाश, पानी और हवा से कार्बन डाइऑक्साइड लेकर अपना भोजन (ग्लूकोज) बनाते हैं। इस प्रक्रिया को प्रकाश संश्लेषण कहते हैं।',
      step2_conceptualBridge: [
        {
          homeTerm: isKannada ? 'ಪತ್ರಹರಿತ್ತು' : 'पर्णहरित',
          bridgeMeaning: 'Green light-absorbing pigment in leaves',
          academicTerm: 'Chlorophyll',
        },
        {
          homeTerm: isKannada ? 'ಪತ್ರರಂಧ್ರಗಳು' : 'रंध्र',
          bridgeMeaning: 'Microscopic pores on leaf surfaces for gas exchange',
          academicTerm: 'Stomata',
        },
        {
          homeTerm: isKannada ? 'ಗ್ಲೂಕೋಸ್ ಆಹಾರ' : 'ग्लूकोज भोजन',
          bridgeMeaning: 'Synthesized chemical sugar energy',
          academicTerm: 'Glucose',
        },
      ],
      step3_examExpressionPrompt:
        'In your English exam, define Photosynthesis and write the names of the substances involved.',
      expectedKeyTermsInAcademicLanguage: ['photosynthesis', 'chlorophyll', 'sunlight', 'carbon dioxide', 'water', 'glucose', 'oxygen'],
    };
  }

  /**
   * Evaluates student's English exam expression without penalizing grammar errors
   */
  static evaluateAcademicExpression(
    studentResponse: string,
    ladder: LanguageLadderProgression
  ): {
    score: number;
    foundTerms: string[];
    missingTerms: string[];
    encouragingFeedback: string;
  } {
    const lower = studentResponse.toLowerCase();
    const foundTerms: string[] = [];
    const missingTerms: string[] = [];

    ladder.expectedKeyTermsInAcademicLanguage.forEach((term) => {
      if (lower.includes(term.toLowerCase())) {
        foundTerms.push(term);
      } else {
        missingTerms.push(term);
      }
    });

    const score = ladder.expectedKeyTermsInAcademicLanguage.length > 0
      ? foundTerms.length / ladder.expectedKeyTermsInAcademicLanguage.length
      : 1.0;

    let encouragingFeedback = '';
    if (score >= 0.6) {
      encouragingFeedback = `Terrific job! You successfully used key academic terminology: ${foundTerms.join(', ')}. Your conceptual answer is exam-ready!`;
    } else {
      encouragingFeedback = `Good try! You clearly understand the concept. To score full marks in your exam, try also including: ${missingTerms.slice(0, 2).join(' and ')}.`;
    }

    return {
      score: Number(score.toFixed(2)),
      foundTerms,
      missingTerms,
      encouragingFeedback,
    };
  }
}
