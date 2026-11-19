import { generateMissionId } from '../../utils/ids.js';

export interface LearningMission {
  id: string;
  topic: string;
  contextType: 'everyday_life' | 'household' | 'market_shopping' | 'sports';
  title: string;
  scenario: string;
  challengeQuestion: string;
  expectedConceptLink: string;
  hints: string[];
}

export class LifeToLessonService {
  static generateMission(topic: string, grade = 'Class 7'): LearningMission {
    const tLower = topic.toLowerCase();

    if (tLower.includes('fraction') || tLower.includes('ಭಿನ್ನರಾಶಿ') || tLower.includes('भिन्न')) {
      return {
        id: generateMissionId(),
        topic: 'Fractions in Everyday Sharing',
        contextType: 'household',
        title: 'The Great Family Dosa Distribution',
        scenario: 'Your mother prepared 5 fresh hot dosas. There are 4 members in the house (you, your sister, mother, and father) who want an equal share.',
        challengeQuestion: 'How many dosas does each person get? Express your answer as a mixed fraction and improper fraction.',
        expectedConceptLink: 'Improper fraction 5/4 = 1 whole dosa and 1/4 dosa each (1 1/4).',
        hints: [
          'Give 1 whole dosa to each person first.',
          'How many dosas are left over to divide among 4 people?',
          'Cut the remaining 1 dosa into 4 equal quarters.',
        ],
      };
    }

    if (tLower.includes('friction') || tLower.includes('ಘರ್ಷಣೆ') || tLower.includes('घर्षण')) {
      return {
        id: generateMissionId(),
        topic: 'Friction on the Village Road',
        contextType: 'everyday_life',
        title: 'Bicycle Skid Investigation',
        scenario: 'You are riding your bicycle after an evening monsoon shower. On the dry tar road, the bike stops quickly when you brake, but on the wet muddy patch near the field, the tire slips and skids.',
        challengeQuestion: 'Why did the tire slide on the wet mud even though you pressed the brakes with the exact same strength?',
        expectedConceptLink: 'Water fills microscopic irregularities, reducing interlocking surface friction.',
        hints: [
          'What happens between the rubber tyre and road surface?',
          'Does water make surfaces smoother or rougher?',
        ],
      };
    }

    // Default: Photosynthesis / Plant Growth
    return {
      id: generateMissionId(),
      topic: 'Photosynthesis & Solar Kitchen',
      contextType: 'everyday_life',
      title: 'The Balcony Tulsi Plant Observation',
      scenario: 'You notice two potted tulsi plants in the house. Plant A sits on the sunny terrace, while Plant B was left in the dark store room for 5 days. Plant B is turning yellow and droopy.',
      challengeQuestion: 'Even though Plant B has enough water in its pot, why can it not stay healthy and green?',
      expectedConceptLink: 'Without sunlight, chlorophyll cannot energize glucose food synthesis.',
      hints: [
        'Water alone is not food for plants.',
        'Which critical ingredient is missing inside the dark store room?',
      ],
    };
  }
}
