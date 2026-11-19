import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Pin,
  Sparkles,
  Layers,
  Search,
  Tag,
  Trash2,
  Share2,
  CheckCircle2,
} from 'lucide-react';
import { useStudentStore } from '../../state/studentStore';
import { Card, Button, Badge, Modal, Input } from '../../components/ui';

export const NotesPage: React.FC = () => {
  const { notes, addNote, updateNote, deleteNote, togglePinNote, addFlashcard } = useStudentStore();
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [search, setSearch] = useState('');
  const [createOpen, setCreateOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Mathematics');
  const [newContent, setNewContent] = useState('');
  const [newTag, setNewTag] = useState('');
  const [flashcardAdded, setFlashcardAdded] = useState(false);

  const activeNote = notes.find((n) => n.id === selectedNoteId) || notes[0];

  const filteredNotes = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.subject.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addNote({
      studentId: '00000000-0000-0000-0000-000000000001',
      title: newTitle,
      subject: newSubject,
      content: newContent,
      tags: newTag ? newTag.split(',').map((t) => t.trim()) : [],
      isPinned: false,
    });
    setNewTitle('');
    setNewContent('');
    setCreateOpen(false);
  };

  const handleGenerateFlashcard = () => {
    if (!activeNote) return;
    addFlashcard({
      studentId: '00000000-0000-0000-0000-000000000001',
      front: `Key Concept: ${activeNote.title}`,
      back: activeNote.aiSummary || activeNote.content.slice(0, 150),
      subject: activeNote.subject,
      chapter: activeNote.chapter,
      difficulty: 'medium',
    });
    setFlashcardAdded(true);
    setTimeout(() => setFlashcardAdded(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-brand-white font-heading">
            Smart Notebook
          </h1>
          <p className="text-xs text-brand-muted mt-1">
            Student-owned digital notes with AI summarization and flashcard synthesis.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setCreateOpen(true)}
        >
          Create Note
        </Button>
      </div>

      {flashcardAdded && (
        <div className="p-3.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-xs text-emerald-300 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Flashcard synthesized and added to your Memory Loop!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notes List Column */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-brand-dim absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-surface border border-brand-borderSubtle rounded-xl pl-9 pr-3 py-2 text-xs text-brand-white placeholder-brand-dim focus:outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.map((note) => {
              const isSelected = note.id === selectedNoteId;

              return (
                <div
                  key={note.id}
                  onClick={() => setSelectedNoteId(note.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-surfaceCard border-brand-cyan/40 shadow-sm'
                      : 'bg-brand-surface/70 border-brand-borderSubtle hover:border-brand-border'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        {note.isPinned && <Pin className="w-3 h-3 text-brand-cyan fill-brand-cyan" />}
                        <span className="text-xs font-bold text-brand-white line-clamp-1">
                          {note.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-brand-dim block">{note.subject}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-brand-muted line-clamp-2 mt-2">
                    {note.content.replace(/#|\*|\\/g, '')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Note Reader & Editor Column (2 cols) */}
        <div className="md:col-span-2">
          {activeNote ? (
            <Card className="p-6 space-y-5 border border-brand-borderSubtle">
              {/* Note Header */}
              <div className="flex items-start justify-between pb-4 border-b border-brand-borderSubtle">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="cyan" size="sm">{activeNote.subject}</Badge>
                    {activeNote.chapter && (
                      <span className="text-xs text-brand-dim">• {activeNote.chapter}</span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-brand-white font-heading">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePinNote(activeNote.id)}
                    className={`p-2 rounded-xl transition-colors ${
                      activeNote.isPinned
                        ? 'bg-brand-cyan/20 text-brand-cyan'
                        : 'text-brand-dim hover:text-brand-white hover:bg-white/5'
                    }`}
                    title={activeNote.isPinned ? 'Unpin' : 'Pin Note'}
                  >
                    <Pin className="w-4 h-4" />
                  </button>
                  <Button
                    variant="surface"
                    size="xs"
                    icon={<Layers className="w-3.5 h-3.5 text-brand-cyan" />}
                    onClick={handleGenerateFlashcard}
                  >
                    Convert to Flashcard
                  </Button>
                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 text-brand-dim hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* AI Key Takeaways Banner if present */}
              {activeNote.aiSummary && (
                <div className="p-3.5 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-cyan">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Key Summary</span>
                  </div>
                  <p className="text-xs text-brand-muted">{activeNote.aiSummary}</p>
                </div>
              )}

              {/* Note Content View */}
              <div className="prose prose-invert max-w-none text-xs md:text-sm text-brand-muted leading-relaxed whitespace-pre-wrap font-sans">
                {activeNote.content}
              </div>

              {/* Key Terms Chips */}
              {activeNote.keyTerms && activeNote.keyTerms.length > 0 && (
                <div className="pt-4 border-t border-brand-borderSubtle space-y-2">
                  <span className="text-[11px] font-bold text-brand-dim uppercase tracking-wider block">
                    Essential Terminology
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeNote.keyTerms.map((term, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-semibold text-brand-white"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <FileText className="w-12 h-12 text-brand-dim mx-auto mb-3" />
              <p className="text-sm font-semibold text-brand-white">No note selected</p>
            </Card>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create New Study Note"
        description="Write your thoughts or textbook summaries."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Note Title"
            placeholder="e.g. Rules of Sign in Integer Multiplication"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Subject</label>
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-brand-cyan"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="General Science">General Science</option>
              <option value="English">English</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-brand-muted mb-1.5">Note Content</label>
            <textarea
              rows={6}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your explanation or paste key points..."
              className="w-full bg-brand-surface border border-brand-borderSubtle text-brand-white text-sm rounded-xl p-3.5 focus:outline-none focus:border-brand-cyan"
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="ghost" type="button" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Note
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
