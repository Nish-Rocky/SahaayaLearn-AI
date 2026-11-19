import React, { useState } from 'react';
import { Layers, RotateCcw, Check, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, Modal, Input } from '../../components/ui';

export const FlashcardsPage: React.FC = () => {
  const { flashcards, reviewFlashcard, addFlashcard } = useStudentStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [subject, setSubject] = useState('Mathematics');

  const currentCard = flashcards[currentIndex];

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    reviewFlashcard(currentCard.id, rating);
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    addFlashcard({
      studentId: '00000000-0000-0000-0000-000000000001',
      front,
      back,
      subject,
      difficulty: 'medium',
    });
    setFront('');
    setBack('');
    setAddOpen(false);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Smart Flashcards & Memory Loop
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Supercharged spaced repetition algorithm • Never forget old concepts after finishing a chapter.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setAddOpen(true)}
        >
          Add Flashcard
        </Button>
      </div>

      {currentCard ? (
        <div className="space-y-6">
          {/* Card Counter & Subject */}
          <div className="flex items-center justify-between text-xs text-brand-muted">
            <Badge variant="cyan" size="sm">{currentCard.subject}</Badge>
            <span>
              Card {currentIndex + 1} of {flashcards.length}
            </span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] bg-brand-surfaceCard border border-brand-cyan/30 rounded-3xl p-8 flex flex-col justify-between items-center text-center cursor-pointer shadow-xl hover:border-brand-cyan/60 transition-all select-none relative overflow-hidden group"
          >
            <span className="text-[10px] uppercase tracking-wider text-brand-dim font-bold">
              {isFlipped ? 'Answer (Click to flip back)' : 'Question (Click anywhere to reveal answer)'}
            </span>

            <div className="my-auto py-6">
              <p className="text-lg md:text-xl font-bold text-brand-white font-heading leading-relaxed">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-brand-dim">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tap to flip</span>
            </div>
          </div>

          {/* Spaced Repetition Rating Controls */}
          {isFlipped ? (
            <div className="space-y-2 animate-in fade-in">
              <span className="text-xs font-semibold text-brand-muted block text-center">
                How well did you remember this?
              </span>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => handleRate('again')}
                  className="p-3 bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 rounded-xl text-center transition-colors"
                >
                  <span className="text-xs font-bold text-red-400 block">Again</span>
                  <span className="text-[10px] text-brand-dim mt-0.5 block">&lt; 1 day</span>
                </button>

                <button
                  onClick={() => handleRate('hard')}
                  className="p-3 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl text-center transition-colors"
                >
                  <span className="text-xs font-bold text-amber-300 block">Hard</span>
                  <span className="text-[10px] text-brand-dim mt-0.5 block">1–2 days</span>
                </button>

                <button
                  onClick={() => handleRate('good')}
                  className="p-3 bg-brand-blue/15 hover:bg-brand-blue/25 border border-brand-blue/30 rounded-xl text-center transition-colors"
                >
                  <span className="text-xs font-bold text-blue-400 block">Good</span>
                  <span className="text-[10px] text-brand-dim mt-0.5 block">3–5 days</span>
                </button>

                <button
                  onClick={() => handleRate('easy')}
                  className="p-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl text-center transition-colors"
                >
                  <span className="text-xs font-bold text-emerald-400 block">Easy</span>
                  <span className="text-[10px] text-brand-dim mt-0.5 block">7+ days</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Button variant="outline" size="md" onClick={() => setIsFlipped(true)}>
                Reveal Answer
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <Layers className="w-12 h-12 text-brand-dim mx-auto mb-3" />
          <p className="text-base font-bold text-brand-white">All caught up for today!</p>
          <p className="text-xs text-brand-muted mt-1">
            You reviewed all active flashcards in your spaced repetition loop.
          </p>
        </Card>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Create New Flashcard"
        description="Add a question-and-answer pair to your memory revision loop."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="General Science">General Science</option>
              <option value="English">English</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Front (Question / Prompt)</label>
            <textarea
              rows={2}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="e.g. What is the reciprocal of 3/7?"
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Back (Answer / Explanation)</label>
            <textarea
              rows={3}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="e.g. 7/3 (or 2 1/3)"
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl p-3 focus:outline-none focus:border-brand-cyan"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Flashcard
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
