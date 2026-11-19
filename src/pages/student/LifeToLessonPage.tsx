import React, { useState } from 'react';
import { Compass, ShoppingBag, Utensils, Plane, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';

export const LifeToLessonPage: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState('shopping');

  const missions = [
    {
      id: 'm-1',
      theme: 'shopping',
      title: 'Kirana Store Discount & Fraction Billing',
      subject: 'Mathematics',
      concept: 'Fractions & Percentages',
      scenario:
        'You visit a local grocery store to buy 3 kg of ragi flour priced at ₹40/kg. The shopkeeper offers a 1/4 discount if you buy more than 2 kg.',
      challenge: 'Calculate the total bill after applying the 1/4 discount. How much do you save?',
      steps: [
        '1. Total price without discount: 3 kg × ₹40 = ₹120.',
        '2. Fraction discount: 1/4 of ₹120 = ₹30.',
        '3. Final amount to pay: ₹120 - ₹30 = ₹90.',
      ],
      lesson: 'Discounts in Indian retail often use fractions (like "quarter off" or "call-off") which directly apply to whole integers.',
    },
    {
      id: 'm-2',
      theme: 'cooking',
      title: 'Making Idli Batter: Fermentation & Heat Changes',
      subject: 'General Science',
      concept: 'Physical & Chemical Changes',
      scenario:
        'Your grandmother mixes soaked rice and urad dal paste, covers it overnight in a warm spot, and by morning the batter rises and becomes fluffy.',
      challenge: 'Is batter rising a physical change or a chemical change? Why can you not reverse it back into plain dal and rice?',
      steps: [
        '1. Microorganisms (yeast & bacteria) produce carbon dioxide gas which forms tiny bubbles.',
        '2. Gas bubbles expand the batter volume (fluffiness).',
        '3. New chemical substances (lactic acid & CO2) are formed, making it an IRREVERSIBLE CHEMICAL CHANGE.',
      ],
      lesson: 'Cooking is everyday biochemistry. Fermentation changes both the molecular structure and nutritional value permanently.',
    },
    {
      id: 'm-3',
      theme: 'sports',
      title: 'Gully Cricket: Spin, Friction & Motion',
      subject: 'General Science',
      concept: 'Force & Friction',
      scenario:
        'You are bowling with a tennis ball on a rough concrete street versus a smooth tiled courtyard.',
      challenge: 'Why does the ball grip and turn sharply on rough concrete, but skids straight on wet smooth tiles?',
      steps: [
        '1. Rough concrete has microscopic irregularities that interlock with the felt fuzz of the tennis ball, creating high friction.',
        '2. Smooth tiles have negligible friction, causing the ball to slip instead of rotating into a turn.',
      ],
      lesson: 'Friction opposes relative motion between surfaces and determines how vehicles brake and balls bounce.',
    },
  ];

  const currentMission = missions.find((m) => m.theme === selectedTheme) || missions[0];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-white font-heading">
          Life-to-Lesson Missions
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Learn textbook concepts through familiar Indian daily situations: grocery stores, home cooking, cricket, and travel.
        </p>
      </div>

      {/* Theme Selectors */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setSelectedTheme('shopping')}
          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
            selectedTheme === 'shopping'
              ? 'bg-brand-surfaceCard border-brand-cyan shadow-glow-cyan/20'
              : 'bg-brand-surface border-brand-borderSubtle hover:border-brand-border'
          }`}
        >
          <ShoppingBag className="w-5 h-5 text-brand-cyan" />
          <span className="text-xs font-bold text-brand-white">Kirana Store</span>
        </button>

        <button
          onClick={() => setSelectedTheme('cooking')}
          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
            selectedTheme === 'cooking'
              ? 'bg-brand-surfaceCard border-brand-cyan shadow-glow-cyan/20'
              : 'bg-brand-surface border-brand-borderSubtle hover:border-brand-border'
          }`}
        >
          <Utensils className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold text-brand-white">Home Kitchen</span>
        </button>

        <button
          onClick={() => setSelectedTheme('sports')}
          className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
            selectedTheme === 'sports'
              ? 'bg-brand-surfaceCard border-brand-cyan shadow-glow-cyan/20'
              : 'bg-brand-surface border-brand-borderSubtle hover:border-brand-border'
          }`}
        >
          <Trophy className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold text-brand-white">Gully Cricket</span>
        </button>
      </div>

      {/* Active Mission Card */}
      <Card className="p-6 space-y-5 border border-brand-borderSubtle">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="cyan" size="sm">{currentMission.subject}</Badge>
              <span className="text-xs text-brand-dim">• {currentMission.concept}</span>
            </div>
            <h2 className="text-lg font-bold text-brand-white font-heading">
              {currentMission.title}
            </h2>
          </div>
        </div>

        {/* Real life scenario */}
        <div className="p-4 bg-white/2 border border-white/5 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-brand-cyan block">Real-World Scenario</span>
          <p className="text-xs text-brand-white leading-relaxed">{currentMission.scenario}</p>
        </div>

        {/* Mission Challenge */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl space-y-1">
          <span className="text-xs font-bold text-amber-300 block">Student Challenge</span>
          <p className="text-xs text-brand-muted leading-relaxed">{currentMission.challenge}</p>
        </div>

        {/* Conceptual Solution Walkthrough */}
        <div className="space-y-2 pt-2 border-t border-brand-borderSubtle">
          <span className="text-xs font-bold text-brand-white block">
            Conceptual Problem Solving Steps
          </span>
          <div className="space-y-1.5">
            {currentMission.steps.map((st, i) => (
              <div key={i} className="p-2.5 bg-brand-surface rounded-xl text-xs text-brand-dim">
                {st}
              </div>
            ))}
          </div>
        </div>

        {/* Academic Takeaway */}
        <div className="p-3.5 bg-brand-blue/15 border border-brand-blue/30 rounded-xl space-y-1">
          <span className="text-xs font-bold text-brand-cyan block">Textbook Connection</span>
          <p className="text-xs text-brand-white">{currentMission.lesson}</p>
        </div>
      </Card>
    </div>
  );
};
