import React from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeroScrollExperience } from './components/HeroScrollExperience.tsx';
import { ProblemSection } from './sections/ProblemSection.tsx';
import { SolutionSection } from './sections/SolutionSection.tsx';
import { FeaturesSection } from './sections/FeaturesSection.tsx';
import { HowItWorksSection } from './sections/HowItWorksSection.tsx';
import { VoiceExperienceSection } from './sections/VoiceExperienceSection.tsx';
import { LanguageSection } from './sections/LanguageSection.tsx';
import { RealConditionsSection } from './sections/RealConditionsSection.tsx';
import { DashboardSection } from './sections/DashboardSection.tsx';
import { FAQ } from './components/FAQ.tsx';
import { FinalCTASection } from './sections/FinalCTASection.tsx';
import { Footer } from './components/Footer.tsx';

export function App() {
  const handleStartLearning = () => {
    const el = document.getElementById('voice-demo');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-brand-midnight text-brand-white selection:bg-brand-cyan/25 selection:text-brand-cyan flex flex-col">
      {/* Premium Floating Navigation Bar */}
      <Navbar onStartLearning={handleStartLearning} />

      <main className="flex-1">
        {/* Section 01: Hero Cinematic 30fps Frame Experience */}
        <HeroScrollExperience />

        {/* Section 02: Problem We Are Solving */}
        <ProblemSection />

        {/* Section 03: Introducing SahaayaLearn & The 5-Stage Learning Cycle */}
        <SolutionSection />

        {/* Section 04: Six Signature Innovations (Bento Grid) */}
        <FeaturesSection />

        {/* Section 05: How SahaayaLearn Works (Step-by-step Interactive Journey) */}
        <HowItWorksSection />

        {/* Section 06: Voice-First Learning Interface (Live Interactive Demo) */}
        <VoiceExperienceSection />

        {/* Section 07: Multilingual Inclusion & Language Ladder */}
        <LanguageSection />

        {/* Section 08: Real Learning Conditions (Shared Phone, Offline Pods, Family Voice Bridge) */}
        <RealConditionsSection />

        {/* Section 09: Personal Learning Progress (Learner Mastery Telemetry) */}
        <DashboardSection />

        {/* FAQ Section */}
        <FAQ />

        {/* Section 10: Final Call To Action */}
        <FinalCTASection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
