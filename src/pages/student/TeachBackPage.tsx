import React, { useState, useRef } from 'react';
import { GraduationCap, Mic, MicOff, Send, Sparkles, Award, CheckCircle2, AlertCircle, Volume2 } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';
import { audioPlaybackService } from '../../services/audioPlayback';

export const TeachBackPage: React.FC = () => {
  const [topic, setTopic] = useState('Photosynthesis');
  const [studentExplanation, setStudentExplanation] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [feedback, setFeedback] = useState<{
    score: number;
    strengths: string[];
    missingPoints: string[];
    followUpQuestion: string;
  } | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const recognitionRef = useRef<any>(null);

  const toggleListening = () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    try {
      const rec = new SpeechRec();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-IN';

      rec.onresult = (evt: any) => {
        let transcript = '';
        for (let i = evt.resultIndex; i < evt.results.length; i++) {
          transcript += evt.results[i][0].transcript;
        }
        setStudentExplanation((prev) => (prev ? `${prev} ${transcript}` : transcript));
      };

      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);

      rec.start();
      recognitionRef.current = rec;
      setIsListening(true);
    } catch {
      setIsListening(false);
    }
  };

  const handleEvaluate = () => {
    if (!studentExplanation.trim()) return;
    setEvaluating(true);
    setTimeout(() => {
      setFeedback({
        score: 85,
        strengths: [
          'Correctly identified sunlight as the primary energy source.',
          'Understood that chlorophyll captures light in the chloroplast.',
          'Accurately named oxygen as the released byproduct.',
        ],
        missingPoints: [
          'Remember to mention water absorption from roots via xylem vessels.',
          'Stomata are microscopic pores guarded by crescent-shaped guard cells.',
        ],
        followUpQuestion:
          'Excellent! How do desert plants like cactus perform photosynthesis if opening stomata during day would lose water?',
      });
      setEvaluating(false);
    }, 1200);
  };

  const handleSpeakQuestion = () => {
    if (!feedback) return;
    audioPlaybackService.speakText({
      text: feedback.followUpQuestion,
      languageCode: 'en-IN',
    });
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-white font-heading">
          Teach-Back Studio & Oral Viva
        </h1>
        <p className="text-xs text-brand-muted mt-1">
          Explain a concept in your own words to the AI. Sahaaya evaluates conceptual reasoning, terminology, and asks viva questions.
        </p>
      </div>

      <Card className="p-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-brand-muted mb-1.5">
            Select Concept to Teach
          </label>
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              setFeedback(null);
            }}
            className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
          >
            <option value="Photosynthesis">General Science: Process of Photosynthesis</option>
            <option value="Fraction Division">Mathematics: Why Dividing Inverts the Fraction</option>
            <option value="Heat Conduction">General Science: Conduction vs Convection</option>
            <option value="Integer Rules">Mathematics: Multiplication Rules of Negative Signs</option>
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-brand-muted">
              Your Explanation (Teach Sahaaya as if you are the teacher)
            </label>
            <button
              type="button"
              onClick={toggleListening}
              className={`text-xs flex items-center gap-1 font-semibold transition-colors ${
                isListening ? 'text-red-400 animate-pulse' : 'text-brand-cyan hover:underline'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" /> Stop Recording
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" /> Speak Explanation
                </>
              )}
            </button>
          </div>
          <textarea
            rows={5}
            value={studentExplanation}
            onChange={(e) => setStudentExplanation(e.target.value)}
            placeholder="e.g. Green leaves take sunlight and chlorophyll to make food using carbon dioxide and water, releasing oxygen..."
            className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl p-3.5 focus:outline-none focus:border-brand-cyan"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-brand-dim">
            Feel free to mix English and your regional language.
          </span>
          <Button
            variant="cyan"
            size="md"
            loading={evaluating}
            disabled={!studentExplanation.trim()}
            icon={<Sparkles className="w-4 h-4" />}
            onClick={handleEvaluate}
          >
            Evaluate My Teaching
          </Button>
        </div>
      </Card>

      {/* Feedback Card */}
      {feedback && (
        <Card className="p-6 space-y-4 border border-brand-cyan/40 bg-brand-surfaceCard animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-cyan" />
              <span className="text-sm font-bold text-brand-white">Viva Evaluation Report</span>
            </div>
            <Badge variant="green" size="md">Conceptual Score: {feedback.score}%</Badge>
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-1">
                ✓ What You Explained Well:
              </span>
              <ul className="space-y-1">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-brand-muted flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-xs font-bold text-amber-300 block mb-1">
                ⚠ Key Elements to Include for Full Exam Marks:
              </span>
              <ul className="space-y-1">
                {feedback.missingPoints.map((m, i) => (
                  <li key={i} className="text-xs text-brand-muted flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-brand-blue/15 border border-brand-blue/30 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-cyan block">
                  Follow-Up Viva Question:
                </span>
                <Button
                  variant="surface"
                  size="xs"
                  icon={<Volume2 className="w-3 h-3 text-brand-cyan" />}
                  onClick={handleSpeakQuestion}
                >
                  Listen
                </Button>
              </div>
              <p className="text-xs text-brand-white">{feedback.followUpQuestion}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};