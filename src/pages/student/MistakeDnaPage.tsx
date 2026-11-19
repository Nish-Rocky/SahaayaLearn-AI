import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dna, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, ShieldAlert } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge } from '../../components/ui';

export const MistakeDnaPage: React.FC = () => {
  const navigate = useNavigate();
  const { misconceptions } = useStudentStore();

  const errorCategories = [
    { name: 'Denominator Confusion', count: 3, description: 'Adding denominators together instead of finding common LCM.' },
    { name: 'Negative Sign Multiplications', count: 1, description: 'Assuming product of two negatives remains negative.' },
    { name: 'Plant Nutrient Source', count: 1, description: 'Assuming mass comes from soil rather than atmospheric CO2.' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm">Sahaaya X-Ray Diagnostic Engine</Badge>
        </div>
        <h1 className="text-2xl font-extrabold text-brand-white font-heading mt-1">
          Mistake DNA & Misconception Intelligence
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Detects the root conceptual reason behind mistakes. We do not punish errors; we diagnose and clear misconceptions.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-brand-cyan/30">
          <span className="text-[10px] text-brand-dim uppercase font-bold tracking-wider">
            Detected Hypotheses
          </span>
          <span className="text-2xl font-extrabold text-brand-white block mt-1">2 Tracked</span>
          <span className="text-xs text-brand-dim mt-0.5 block">Evidence-backed diagnosis</span>
        </Card>

        <Card className="p-5 border-emerald-500/30">
          <span className="text-[10px] text-brand-dim uppercase font-bold tracking-wider">
            Successfully Cleared
          </span>
          <span className="text-2xl font-extrabold text-emerald-400 block mt-1">1 Resolved</span>
          <span className="text-xs text-emerald-300/80 mt-0.5 block">Photosynthesis plant mass</span>
        </Card>

        <Card className="p-5 border-amber-500/30">
          <span className="text-[10px] text-brand-dim uppercase font-bold tracking-wider">
            In Active Remediation
          </span>
          <span className="text-2xl font-extrabold text-amber-300 block mt-1">1 Pending</span>
          <span className="text-xs text-amber-300/80 mt-0.5 block">Fraction denominator addition</span>
        </Card>
      </div>

      {/* Tracked Misconceptions Detail */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-brand-white font-heading">
          Identified Misconception Evidence
        </h2>

        {misconceptions.map((item) => (
          <Card
            key={item.id}
            className="p-6 space-y-4 border border-brand-borderSubtle hover:border-brand-cyan/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={item.correctionStatus === 'cleared' ? 'green' : 'amber'} size="sm">
                    {item.correctionStatus === 'cleared' ? 'Cleared' : 'In Remediation'}
                  </Badge>
                  <span className="text-xs text-brand-dim font-mono">{item.misconceptionCode}</span>
                </div>
                <h3 className="text-base font-bold text-brand-white font-heading">
                  {item.concept}
                </h3>
              </div>

              <Button
                variant={item.correctionStatus === 'cleared' ? 'surface' : 'cyan'}
                size="xs"
                onClick={() =>
                  navigate(
                    `/student/ai-tutor?misconception=${encodeURIComponent(
                      item.misconceptionCode
                    )}&topic=${encodeURIComponent(item.concept)}`
                  )
                }
              >
                {item.correctionStatus === 'cleared' ? 'Review Verification' : 'Start Corrective Practice'}
              </Button>
            </div>

            <div className="p-3.5 bg-white/2 border border-white/5 rounded-xl space-y-1">
              <span className="text-xs font-bold text-brand-muted block">Diagnostic Evidence:</span>
              <p className="text-xs text-brand-dim leading-relaxed">{item.evidenceSummary}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-brand-dim pt-2 border-t border-brand-borderSubtle">
              <span>Confidence: <strong className="text-brand-white capitalize">{item.confidenceLevel}</strong></span>
              <span>Detected: {item.detectedAt.slice(0, 10)}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Error Taxonomy */}
      <Card className="p-6 space-y-3">
        <h3 className="text-xs font-bold text-brand-white font-heading uppercase tracking-wider">
          Student Mistake Taxonomy Patterns
        </h3>
        <div className="space-y-2">
          {errorCategories.map((cat, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 bg-white/2 rounded-xl text-xs"
            >
              <div>
                <span className="font-bold text-brand-white block">{cat.name}</span>
                <span className="text-brand-dim text-[11px]">{cat.description}</span>
              </div>
              <Badge variant="neutral" size="sm">{cat.count} occurrences</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
