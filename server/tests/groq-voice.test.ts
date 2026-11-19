import { describe, it, expect } from 'vitest';
import { GroqTutorService } from '../src/services/groq-tutor.service.js';
import { SarvamTtsService } from '../src/providers/sarvam/sarvam-tts.service.js';
import { checkGroqHealth } from '../src/providers/groq/groq.health.js';
import { ToolRegistry } from '../src/modules/tools/tool-registry.js';

describe('Groq GPT-OSS & Voice Pipeline Tests', () => {
  it('checkGroqHealth returns configured status correctly', async () => {
    const health = await checkGroqHealth();
    expect(health).toHaveProperty('configured');
    expect(health).toHaveProperty('status');
    expect(health.model).toBeDefined();
  });

  it('SarvamTtsService sanitizes spoken text and removes markdown, formulas, citations', () => {
    const raw = '```json\n{"data": 1}\n```\nHere is a *great* explanation [Source: NCERT p.12]! https://ncert.nic.in';
    const clean = SarvamTtsService.cleanSpokenText(raw);
    expect(clean).not.toContain('```');
    expect(clean).not.toContain('NCERT');
    expect(clean).not.toContain('https://');
    expect(clean).toBe('Here is a great explanation !');
  });

  it('SarvamTtsService splits text into spoken sentence boundaries accurately', () => {
    const text = 'First law is inertia. Force causes acceleration! Does that make sense?';
    const sentences = SarvamTtsService.splitIntoSentences(text);
    expect(sentences.length).toBe(3);
    expect(sentences[0]).toBe('First law is inertia.');
    expect(sentences[1]).toBe('Force causes acceleration!');
    expect(sentences[2]).toBe('Does that make sense?');
  });

  it('GroqTutorService generates dynamic reasoning across different subject questions', async () => {
    // Math fractions
    const mathResult = await GroqTutorService.generateTutoringResponse({
      question: 'How do you add fractions with different denominators?',
      grade: 'Class 7',
      subject: 'Mathematics',
      teachingLanguage: 'kn-IN',
    });
    expect(mathResult.tutorResponse.answer).toBeDefined();
    expect(mathResult.tutorResponse.keyTerms.length).toBeGreaterThan(0);

    // Physics motion
    const physicsResult = await GroqTutorService.generateTutoringResponse({
      question: 'Explain Newton first law of motion and inertia',
      grade: 'Class 8',
      subject: 'Science',
      teachingLanguage: 'en-IN',
    });
    expect(physicsResult.tutorResponse.answer).toContain('Inertia');
    expect(physicsResult.tutorResponse.examples.length).toBeGreaterThan(0);

    // Chemistry / Biology
    const bioResult = await GroqTutorService.generateTutoringResponse({
      question: 'Why do plants need sunlight for photosynthesis?',
      grade: 'Class 7',
      subject: 'Science',
      teachingLanguage: 'kn-IN',
    });
    expect(bioResult.tutorResponse.answer).toBeDefined();
  });

  it('ToolRegistry verifies and executes student academic tools', async () => {
    const tools = ToolRegistry.getToolList();
    expect(tools.some((t) => t.name === 'get_student_profile')).toBe(true);
    expect(tools.some((t) => t.name === 'create_study_task')).toBe(true);

    const profileResult = await ToolRegistry.executeTool(
      'get_student_profile',
      {},
      { studentProfileId: '00000000-0000-0000-0000-000000000001' }
    );
    expect(profileResult.grade).toBe('Class 7');
  });
});
