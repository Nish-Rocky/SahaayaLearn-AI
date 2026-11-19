import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      category: 'SPEECH & LANGUAGE',
      question: 'How does SahaayaLearn understand local Indian dialects and mixed languages?',
      answer: 'SahaayaLearn is engineered specifically for Indian linguistic contexts, including code-switching (mixing regional words with English, such as Kanglish or Hinglish). Rather than penalizing pronunciation, the speech recovery model seeks gentle confirmation to ensure learners never feel anxious.',
    },
    {
      category: 'SYLLABUS GROUNDING',
      question: 'Are the explanations aligned with NCERT and State Board textbooks?',
      answer: 'Yes. Every explanation, practice quiz, and concept definition is grounded against verified curriculum standards (such as NCERT Class 6–10 and Karnataka State Board). It does not hallucinate arbitrary facts; textbook citations and page references are linked directly.',
    },
    {
      category: 'DIAGNOSTICS',
      question: 'What is Sahaaya X-Ray and how does it detect misconceptions?',
      answer: 'Unlike conventional multiple-choice platforms that simply count right vs wrong answers, Sahaaya X-Ray tracks the logical step where reasoning diverged (e.g. adding denominators in fractions). It then triggers a targeted verbal analogy to correct the specific root misunderstanding.',
    },
    {
      category: 'DEVICE SHARING',
      question: 'Can two or three siblings share one smartphone without losing their progress?',
      answer: 'Yes. The Shared-Smartphone Learning Pocket allows multiple learners to maintain isolated PIN-protected profiles, personalized mastery graphs, and separate learning streaks on a single family handset.',
    },
    {
      category: 'CONNECTIVITY',
      question: 'Can students study when mobile internet is slow or unavailable?',
      answer: 'SahaayaLearn supports downloadable Learning Capsules. Core lessons and practice drills can be pre-downloaded over Wi-Fi, allowing learners to study offline without consuming valuable family mobile data.',
    },
    {
      category: 'PARENTAL INVOLVEMENT',
      question: 'How does the Family Voice Bridge involve parents who cannot read English?',
      answer: 'Instead of dense English report cards, SahaayaLearn generates short, encouraging spoken voice summaries in the family’s preferred home language. Parents can listen to what their child accomplished in 45 seconds and receive simple suggestions to encourage them.',
    },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-brand-deep/80 border-t border-white/5" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-white tracking-tight mb-4">
            Everything you need to know about{' '}
            <span className="text-gradient-cyan-blue">
              SahaayaLearn.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-brand-muted">
            Transparent answers about our speech intelligence, curriculum grounding, and accessibility design.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? 'bg-brand-surface border-brand-cyan/40 shadow-glow-cyan/10'
                    : 'bg-brand-surface/60 border-white/5 hover:border-white/15'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-brand-dim uppercase tracking-wider block">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-brand-white">
                      {faq.question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-brand-cyan text-brand-midnight rotate-180'
                        : 'bg-brand-deep text-brand-muted'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 text-sm text-brand-muted leading-relaxed border-t border-white/5 mt-1">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
