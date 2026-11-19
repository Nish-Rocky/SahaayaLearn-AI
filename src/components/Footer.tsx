import React from 'react';
import { Volume2, Sparkles, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brand-midnight border-t border-white/10 pt-16 pb-12 text-brand-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/5">
          
          {/* Brand & Mission Statement (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-brand-midnight font-bold shadow-glow-cyan/40">
                <Volume2 className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-brand-white font-display">
                SAHAAYA<span className="text-gradient-cyan-blue">LEARN</span>
              </span>
            </div>

            <p className="text-sm text-brand-white/90 font-medium">
              "Learning that listens. Teaching that understands."
            </p>

            <p className="text-xs text-brand-dim leading-relaxed max-w-sm">
              SahaayaLearn is an intelligent, voice-first personal learning companion designed especially for first-generation learners and students across India. Grounded in state curricula and home languages.
            </p>
          </div>

          {/* Quick Navigation Links (3 cols) */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-white mb-4">
              Platform Navigation
            </h4>
            <ul className="space-y-2.5 text-xs">
              {[
                { name: 'Home', id: 'hero' },
                { name: 'How It Works', id: 'how-it-works' },
                { name: 'Features & Innovations', id: 'features' },
                { name: 'Our Approach', id: 'approach' },
                { name: 'Interactive Voice Demo', id: 'voice-demo' },
                { name: 'Frequently Asked Questions', id: 'faq' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollTo(link.id)}
                    className="hover:text-brand-cyan transition-colors"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Learning Pillars & Languages (4 cols) */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-brand-white mb-4">
              Supported Linguistic Tracks
            </h4>
            <p className="text-xs text-brand-dim leading-relaxed mb-4">
              Designed for Classes 6–10 across Karnataka State Board & NCERT national curricula. Active voice evaluation in Kannada, Hindi, and English.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {['ಕನ್ನಡ', 'हिंदी', 'English', 'తెలుగు', 'தமிழ்', 'മലയാളം', 'বাংলা', 'मराठी'].map((lang) => (
                <span
                  key={lang}
                  className="px-2.5 py-1 rounded-md bg-brand-surface border border-white/5 text-[11px] text-brand-muted"
                >
                  {lang}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Supporting Tagline */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-dim gap-4">
          <p>© {currentYear} SahaayaLearn. All rights reserved.</p>
          <p className="text-xs font-semibold text-brand-white/80">
            "Your voice. Your language. Your future."
          </p>
        </div>

      </div>
    </footer>
  );
};
