import React, { useState } from 'react';
import { Languages, Volume2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types/index.ts';

export const LanguageSection: React.FC = () => {
  const languages: (Language & { isLiveVoice: boolean })[] = [
    {
      code: 'kn',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      samplePhrase: 'ನನಗೆ ಭಿನ್ನರಾಶಿಗಳ ಪರಿಕಲ್ಪನೆ ಅರ್ಥವಾಗುತ್ತಿಲ್ಲ.',
      academicBridgeExample: {
        home: 'ನಾಲ್ಕರಲ್ಲಿ ಒಂದು ಪಾಲು (One part out of four)',
        bridge: 'Ratio of 1 unit to 4 equal reference units',
        academic: '1/4 — Proper Fraction, Denominator 4',
      },
      isLiveVoice: true,
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिंदी',
      samplePhrase: 'प्रकाश संश्लेषण की प्रक्रिया कैसे काम करती है?',
      academicBridgeExample: {
        home: 'पौधे धूप से अपना खाना कैसे बनाते हैं',
        bridge: 'Solar energy conversion to chemical nutrients',
        academic: 'Photosynthesis: 6CO2 + 6H2O ➔ C6H12O6 + 6O2',
      },
      isLiveVoice: true,
    },
    {
      code: 'en',
      name: 'English',
      nativeName: 'English (Indian Context)',
      samplePhrase: 'How does gravity cause objects of different masses to fall at the same rate?',
      academicBridgeExample: {
        home: 'Why stones and coins fall together in vacuum',
        bridge: 'Mass cancels out in gravitational acceleration',
        academic: 'g = G*M / R^2, independent of falling object mass',
      },
      isLiveVoice: true,
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      samplePhrase: 'సూర్యకాంతి ద్వారా మొక్కలు ఆహారం ఎలా తయారుచేస్తాయి?',
      academicBridgeExample: {
        home: 'మొక్కలు ఆహారం తయారు చేసుకునే సహజ విధానం',
        bridge: 'సౌర శక్తి రసాయన శక్తిగా మారే ప్రక్రియ',
        academic: 'కిరణజన్య సంయోగక్రియ (Photosynthesis Process)',
      },
      isLiveVoice: false,
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      samplePhrase: 'ஒளிச்சேர்க்கை என்பது தாவரங்கள் எவ்வாறு செயல்படுகிறது?',
      academicBridgeExample: {
        home: 'செடிகள் சூரிய ஒளியில் உணவு தயாரிப்பது எப்படி',
        bridge: 'சூரிய ஆற்றலை வேதியியல் ஆற்றலாக மாற்றும் வழி',
        academic: 'ஒளிச்சேர்க்கை சமன்பாடு (Photosynthesis Equation)',
      },
      isLiveVoice: false,
    },
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      samplePhrase: 'പ്രകാശസംശ്ലേഷണം വഴി സസ്യങ്ങൾ ഭക്ഷണം നിർമ്മിക്കുന്നത് എങ്ങനെ?',
      academicBridgeExample: {
        home: 'ചെടികൾ സൂര്യപ്രകാശത്തിൽ ആഹാരം ഉണ്ടാക്കുന്നത്',
        bridge: 'സൗരോർജ്ജം രാസഊർജ്ജമായി മാറുന്ന പ്രക്രിയ',
        academic: 'പ്രകാശസംശ്ലേഷണ സമവാക്യം (Chemical Equation)',
      },
      isLiveVoice: false,
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      samplePhrase: 'সালোকসংশ্লেষ প্রক্রিয়া কীভাবে সবুজ উদ্ভিদে ঘটে?',
      academicBridgeExample: {
        home: 'গাছ কীভাবে সূর্যালোক দিয়ে খাবার তৈরি করে',
        bridge: 'সৌরশক্তি রাসায়নিক পুষ্টিতে রূপান্তরের প্রক্রিয়া',
        academic: 'সালোকসংশ্লেষণ রাসায়নিক সমীকরণ',
      },
      isLiveVoice: false,
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      samplePhrase: 'प्रकाशसंश्लेषण ही प्रक्रिया वनस्पतींमध्ये कशी घडते?',
      academicBridgeExample: {
        home: 'झाडे सूर्यप्रकाशापासून स्वतःचे अन्न कसे बनवतात',
        bridge: 'सौरऊर्जेचे रासायनिक ऊर्जेत रूपांतर करण्याची पद्धत',
        academic: 'प्रकाशसंश्लेषण रासायनिक अभिक्रिया',
      },
      isLiveVoice: false,
    },
  ];

  const [selectedLang, setSelectedLang] = useState(languages[0]);

  return (
    <section className="relative py-24 sm:py-32 bg-brand-midnight border-t border-white/5" id="languages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <Languages className="w-3.5 h-3.5" />
            <span>MULTILINGUAL ACCESS & INCLUSION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            Learning in the language you{' '}
            <span className="text-gradient-cyan-blue">
              feel at home in.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed mb-4">
            Knowledge should not require learners to abandon the language they understand best.
          </p>

          <p className="text-sm font-semibold text-brand-cyan tracking-wide">
            "Understand first. Express confidently. Keep growing."
          </p>
        </div>

        {/* Language Grid Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-10">
          {languages.map((lang) => {
            const isSelected = selectedLang.code === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang)}
                className={`p-4 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-surface border-brand-cyan shadow-glow-cyan/30 scale-105'
                    : 'bg-brand-deep/60 border-white/5 hover:border-white/20 hover:bg-brand-surface/40'
                }`}
              >
                <div>
                  <span className="text-lg font-bold text-brand-white block mb-0.5">
                    {lang.nativeName}
                  </span>
                  <span className="text-xs text-brand-dim font-medium">
                    {lang.name}
                  </span>
                </div>

                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                    lang.isLiveVoice
                      ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                      : 'bg-brand-midnight text-brand-dim'
                  }`}>
                    {lang.isLiveVoice ? 'Live Voice' : 'Curriculum Ready'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Language Academic Ladder Showcase Card */}
        <div className="rounded-3xl bg-brand-surface/80 border border-brand-cyan/25 p-7 sm:p-10 backdrop-blur-xl shadow-glass">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-white/10 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider">
                  LANGUAGE LADDER SPOTLIGHT: {selectedLang.name} ({selectedLang.nativeName})
                </span>
                {selectedLang.isLiveVoice ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                    ✓ Interactive Voice Active
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-brand-deep text-brand-dim border border-white/10 text-[10px] font-semibold">
                    Pipeline Expansion
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-brand-white font-medium italic">
                Sample Student Query: "{selectedLang.samplePhrase}"
              </p>
            </div>
          </div>

          {/* 3 Step Ladder Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-5 rounded-2xl bg-brand-deep/80 border border-white/10">
              <span className="text-xs font-mono text-brand-dim uppercase tracking-wider block mb-2">
                Step 01 • Intuitive Home Language
              </span>
              <h4 className="text-base font-bold text-brand-white mb-2">
                {selectedLang.academicBridgeExample.home}
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Concept is grasped deeply through familiar everyday phrases without academic pressure.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-2xl bg-brand-deep/80 border border-brand-violet/30">
              <span className="text-xs font-mono text-brand-violet uppercase tracking-wider block mb-2">
                Step 02 • Conceptual Bridge
              </span>
              <h4 className="text-base font-bold text-brand-white mb-2">
                {selectedLang.academicBridgeExample.bridge}
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Connects informal visual understanding directly with scientific and mathematical structure.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-2xl bg-brand-deep/80 border border-brand-cyan/40">
              <span className="text-xs font-mono text-brand-cyan uppercase tracking-wider block mb-2">
                Step 03 • Formal Academic Expression
              </span>
              <h4 className="text-base font-bold text-brand-white mb-2">
                {selectedLang.academicBridgeExample.academic}
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Empowers the student to write exams and answer in formal textbook terminology with total confidence.
              </p>
            </div>

          </div>

          {/* Transparent note regarding connected services */}
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-brand-dim">
            <span>* Active speech recognition and synthesis are demonstrated for verified languages. Non-active languages represent ongoing syllabus ontology integration.</span>
          </div>

        </div>

      </div>
    </section>
  );
};
