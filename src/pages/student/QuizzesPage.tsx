import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, AlertCircle, Play, RotateCcw, ArrowRight } from 'lucide-react';
import { Card, Button, Badge } from '../../components/ui';

export const QuizzesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isMock = searchParams.get('mock') === 'true';
  const topic = searchParams.get('topic') || 'Fractions and Decimals';
  const navigate = useNavigate();

  const questions = [
    {
      id: 'q-1',
      question: 'What is 3/5 + 1/5?',
      options: ['4/10', '4/5', '3/10', '2/5'],
      correctIndex: 1,
      explanation: 'When adding like fractions, keep the common denominator (5) and add the numerators: 3 + 1 = 4. Result is 4/5.',
    },
    {
      id: 'q-2',
      question: 'Calculate: 2/3 ÷ 4/5',
      options: ['8/15', '5/6', '6/5', '10/12'],
      correctIndex: 1,
      explanation: 'Invert the divisor: 2/3 × 5/4 = 10/12, which simplifies by dividing top and bottom by 2 to get 5/6.',
    },
    {
      id: 'q-3',
      question: 'Which gas is released during photosynthesis?',
      options: ['Carbon Dioxide', 'Nitrogen', 'Oxygen', 'Hydrogen'],
      correctIndex: 2,
      explanation: 'Green plants release Oxygen (O2) into the atmosphere as a byproduct of water photolysis.',
    },
    {
      id: 'q-4',
      question: 'What is the value of: (-6) × (-4)?',
      options: ['-24', '+24', '-10', '+10'],
      correctIndex: 1,
      explanation: 'The product of two negative integers is always POSITIVE: (-6) × (-4) = +24.',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (submitted) return;
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: idx });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setSubmitted(true);
    }
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[Number(qIdx)].correctIndex === ansIdx
  ).length;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between pb-2 border-b border-brand-borderSubtle">
        <div>
          <Badge variant={isMock ? 'blue' : 'cyan'} size="sm">
            {isMock ? 'Timed Mock Examination' : 'Practice Quiz'}
          </Badge>
          <h1 className="text-xl font-bold text-brand-white font-heading mt-1">
            {isMock ? 'Class 7 Midterm Evaluation Mock' : topic}
          </h1>
        </div>
        {!submitted && (
          <span className="text-xs font-bold text-brand-muted">
            Question {currentIndex + 1} of {questions.length}
          </span>
        )}
      </div>

      {!submitted ? (
        <Card className="p-8 space-y-6 border border-brand-borderSubtle">
          <div className="space-y-2">
            <span className="text-xs font-bold text-brand-cyan uppercase tracking-wider">
              Question {currentIndex + 1}
            </span>
            <p className="text-base md:text-lg font-bold text-brand-white leading-relaxed">
              {currentQ.question}
            </p>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((opt, i) => {
              const isSelected = selectedAnswers[currentIndex] === i;
              return (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className={`w-full p-4 rounded-xl text-left text-xs md:text-sm font-semibold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-blue/20 border-2 border-brand-cyan text-brand-white shadow-sm'
                      : 'bg-brand-surface border border-brand-borderSubtle text-brand-muted hover:text-brand-white hover:bg-white/5'
                  }`}
                >
                  <span>{opt}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'border-brand-cyan bg-brand-cyan' : 'border-brand-dim'
                    }`}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-brand-midnight" />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-brand-borderSubtle">
            <Button
              variant="ghost"
              size="sm"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(currentIndex - 1)}
            >
              Previous
            </Button>
            <Button
              variant="cyan"
              size="sm"
              disabled={selectedAnswers[currentIndex] === undefined}
              onClick={handleNext}
            >
              {currentIndex === questions.length - 1 ? 'Submit Assessment' : 'Next Question →'}
            </Button>
          </div>
        </Card>
      ) : (
        /* Results Screen */
        <Card className="p-8 text-center space-y-6 border border-brand-cyan/40 bg-brand-surfaceCard">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-brand-white font-heading">
              Assessment Completed!
            </h2>
            <p className="text-xs text-brand-muted">
              You scored <span className="text-brand-cyan font-bold">{correctCount}</span> out of{' '}
              <span className="text-brand-white font-bold">{questions.length}</span> (
              {Math.round((correctCount / questions.length) * 100)}%)
            </p>
          </div>

          {/* Question Explanations */}
          <div className="space-y-3 text-left pt-4 border-t border-white/10">
            <span className="text-xs font-bold text-brand-dim uppercase tracking-wider block">
              Detailed Explanations & Mistake DNA
            </span>
            {questions.map((q, i) => {
              const isCorrect = selectedAnswers[i] === q.correctIndex;
              return (
                <div key={q.id} className="p-3.5 bg-white/2 rounded-xl border border-white/5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-white">
                      Q{i + 1}: {q.question}
                    </span>
                    <Badge variant={isCorrect ? 'green' : 'red'} size="sm">
                      {isCorrect ? 'Correct' : 'Incorrect'}
                    </Badge>
                  </div>
                  <p className="text-xs text-brand-muted">
                    <strong className="text-emerald-400">Correct:</strong> {q.options[q.correctIndex]}
                  </p>
                  <p className="text-[11px] text-brand-dim">💡 {q.explanation}</p>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={() => {
                setSelectedAnswers({});
                setCurrentIndex(0);
                setSubmitted(false);
              }}
            >
              Retry Assessment
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/student/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
