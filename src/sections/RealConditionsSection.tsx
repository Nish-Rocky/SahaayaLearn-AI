import React, { useState } from 'react';
import { Smartphone, WifiOff, Users, Download, Check, Volume2, Shield, Sparkles } from 'lucide-react';

export const RealConditionsSection: React.FC = () => {
  const [activeProfile, setActiveProfile] = useState<'sibling1' | 'sibling2'>('sibling1');
  const [downloadedCapsules, setDownloadedCapsules] = useState<string[]>(['fractions-core']);
  const [isFamilyPlaying, setIsFamilyPlaying] = useState<boolean>(false);

  const toggleDownload = (id: string) => {
    if (downloadedCapsules.includes(id)) {
      setDownloadedCapsules(downloadedCapsules.filter((x) => x !== id));
    } else {
      setDownloadedCapsules([...downloadedCapsules, id]);
    }
  };

  return (
    <section className="relative py-24 sm:py-32 bg-brand-deep/80 border-t border-white/5" id="real-conditions">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-surface border border-white/10 text-brand-cyan text-xs font-bold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>GROUNDED IN REALITY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-white tracking-tight leading-tight mb-6">
            Built around the realities of{' '}
            <span className="text-gradient-cyan-blue">
              everyday learning.
            </span>
          </h2>

          <p className="text-base sm:text-lg text-brand-muted leading-relaxed">
            Technology that works in real households: on shared smartphones, fluctuating connectivity, and with non-English speaking families.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Pillar 1: Shared-Device Learning */}
          <div className="rounded-3xl bg-brand-surface/75 border border-white/10 p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-brand-cyan/40 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-deep border border-brand-cyan/30 flex items-center justify-center text-brand-cyan mb-6">
                <Smartphone className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold text-brand-cyan uppercase tracking-wider block mb-2">
                Pillar 01 • Shared Smartphone
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-white mb-3">
                One phone, zero mix-ups.
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed mb-6">
                Indian households often share one smartphone among multiple siblings. SahaayaLearn isolates learning history, misconceptions, and progress under individual learner PINs.
              </p>
            </div>

            {/* Profile Switcher Simulator */}
            <div className="rounded-2xl bg-brand-deep/90 border border-white/10 p-4">
              <span className="text-[11px] font-mono text-brand-dim uppercase block mb-2">
                Simulate Profile Switching:
              </span>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <button
                  onClick={() => setActiveProfile('sibling1')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    activeProfile === 'sibling1'
                      ? 'bg-brand-surface border-brand-cyan text-brand-cyan font-bold'
                      : 'bg-brand-midnight border-white/5 text-brand-muted'
                  }`}
                >
                  <span className="text-xs block">Ananya (Class 8)</span>
                  <span className="text-[10px] text-brand-dim">Math & Science</span>
                </button>

                <button
                  onClick={() => setActiveProfile('sibling2')}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    activeProfile === 'sibling2'
                      ? 'bg-brand-surface border-brand-violet text-brand-violet font-bold'
                      : 'bg-brand-midnight border-white/5 text-brand-muted'
                  }`}
                >
                  <span className="text-xs block">Karthik (Class 6)</span>
                  <span className="text-[10px] text-brand-dim">Basic Arithmetic</span>
                </button>
              </div>

              <div className="p-2 rounded-lg bg-brand-midnight text-[11px] text-brand-dim flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>Isolated progress: {activeProfile === 'sibling1' ? 'Algebra track active' : 'Fractions track active'}</span>
              </div>
            </div>
          </div>

          {/* Pillar 2: Limited Connectivity & Offline Capsules */}
          <div className="rounded-3xl bg-brand-surface/75 border border-white/10 p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-brand-blue/40 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-deep border border-brand-blue/30 flex items-center justify-center text-brand-blue mb-6">
                <WifiOff className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider block mb-2">
                Pillar 02 • Resilient Connectivity
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-white mb-3">
                Downloadable learning capsules.
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed mb-6">
                Students can download compact 5MB audio-visual lesson capsules while connected at school or morning hours, then practise offline without consuming mobile data.
              </p>
            </div>

            {/* Offline Capsule Download Simulator */}
            <div className="rounded-2xl bg-brand-deep/90 border border-white/10 p-4 space-y-2">
              <span className="text-[11px] font-mono text-brand-dim uppercase block mb-1">
                Offline Learning Capsules (Interactive):
              </span>

              {[
                { id: 'fractions-core', title: 'Fractions Core (4.2 MB)', offline: true },
                { id: 'photosynthesis-audio', title: 'Photosynthesis Pod (3.8 MB)', offline: false },
              ].map((capsule) => {
                const isDownloaded = downloadedCapsules.includes(capsule.id);
                return (
                  <div
                    key={capsule.id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-brand-midnight border border-white/5 text-xs"
                  >
                    <span className="text-brand-white font-medium">{capsule.title}</span>
                    <button
                      onClick={() => toggleDownload(capsule.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono flex items-center gap-1 transition-colors ${
                        isDownloaded
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                          : 'bg-brand-surface hover:bg-brand-deep text-brand-cyan border border-brand-cyan/30'
                      }`}
                    >
                      {isDownloaded ? <Check className="w-3 h-3" /> : <Download className="w-3 h-3" />}
                      <span>{isDownloaded ? 'Saved Offline' : 'Save'}</span>
                    </button>
                  </div>
                );
              })}

              <span className="text-[10px] text-brand-dim block pt-1">
                * Generative AI voice requests sync when reconnected.
              </span>
            </div>
          </div>

          {/* Pillar 3: Family Voice Bridge */}
          <div className="rounded-3xl bg-brand-surface/75 border border-white/10 p-7 sm:p-8 backdrop-blur-xl flex flex-col justify-between hover:border-brand-violet/40 transition-all duration-300">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-brand-deep border border-brand-violet/30 flex items-center justify-center text-brand-violet mb-6">
                <Users className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono font-bold text-brand-violet uppercase tracking-wider block mb-2">
                Pillar 03 • Family Voice Bridge
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-brand-white mb-3">
                Spoken updates parents understand.
              </h3>
              <p className="text-sm text-brand-muted leading-relaxed mb-6">
                First-generation learners' parents may not read English report cards. Sahaaya generates short, encouraging 45-second voice memos in the parent's native language.
              </p>
            </div>

            {/* Parent Voice Capsule Demo */}
            <div className="rounded-2xl bg-brand-deep/90 border border-brand-violet/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-brand-violet font-bold uppercase">
                  Parent Voice Note (Kannada)
                </span>
                <span className="text-[10px] text-brand-dim font-mono">0:45</span>
              </div>

              <p className="text-xs text-brand-white italic mb-3">
                "ನಮಸ್ಕಾರ! ಇಂದು ಅನನ್ಯ ಗಣಿತದಲ್ಲಿ ಭಿನ್ನರಾಶಿಗಳ ಪರಿಕಲ್ಪನೆಯನ್ನು ಸುಲಭವಾಗಿ ಕಲಿತಿದ್ದಾಳೆ..."
              </p>

              <button
                onClick={() => setIsFamilyPlaying(!isFamilyPlaying)}
                className="w-full py-2 rounded-xl bg-brand-surface hover:bg-brand-surfaceElevated border border-brand-violet/40 text-brand-violet text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <Volume2 className={`w-4 h-4 ${isFamilyPlaying ? 'animate-pulse' : ''}`} />
                <span>{isFamilyPlaying ? 'Playing Spoken Update...' : 'Play Family Voice Memo'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
