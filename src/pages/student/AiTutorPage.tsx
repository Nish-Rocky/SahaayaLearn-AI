import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  Send,
  Mic,
  BookOpen,
  Volume2,
  VolumeX,
  Globe,
  Loader2,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Square,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { useUiStore } from '../../state/uiStore';
import { SahaayaApiClient, TutorResponseData } from '../../services/api';
import { Card, Button, Badge } from '../../components/ui';
import { audioPlaybackManager, PlaybackState } from '../../services/audioPlayback';

export const AiTutorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTopic = searchParams.get('topic') || searchParams.get('q') || '';
  const initialHw = searchParams.get('hw') || '';

  const { studentProfile } = useAuthStore();
  const { openGlobalVoice } = useUiStore();

  const [tutorMode, setTutorMode] = useState<string>('free_learning');
  const [messages, setMessages] = useState<
    Array<{
      id: string;
      sender: 'student' | 'tutor';
      text: string;
      data?: TutorResponseData;
      timestamp: string;
    }>
  >([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [teachingLang, setTeachingLang] = useState(studentProfile?.teachingLanguage || 'kn-IN');
  const [autoRead, setAutoRead] = useState(false);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = audioPlaybackManager.subscribeState((state) => {
      if (state !== 'speaking') {
        setPlayingMessageId(null);
      }
    });
    return () => {
      unsub();
      audioPlaybackManager.stop();
    };
  }, []);

  const tutorModes = [
    { id: 'free_learning', label: 'Free Conversation' },
    { id: 'step_by_step', label: 'Step-by-Step' },
    { id: 'solve_with_guidance', label: 'Solve with Guidance' },
    { id: 'language_ladder', label: 'Language Ladder' },
    { id: 'misconception_diagnosis', label: 'X-Ray Diagnosis' },
    { id: 'exam_preparation', label: 'Exam Prep' },
    { id: 'life_to_lesson', label: 'Life-to-Lesson' },
  ];

  // Initialize with initial prompt if provided via URL
  useEffect(() => {
    const prompt = initialHw
      ? `Can you guide me step-by-step through this homework question: "${initialHw}"? Please don't give the direct answer immediately.`
      : initialTopic
      ? `Please explain the concept of "${initialTopic}" with a simple everyday Indian analogy and textbook facts.`
      : null;

    if (prompt && messages.length === 0) {
      sendMessage(prompt);
    } else if (messages.length === 0) {
      // Welcome message
      setMessages([
        {
          id: 'welcome',
          sender: 'tutor',
          text: `ನಮಸ್ಕಾರ ${studentProfile?.displayName || 'Ananya'}! I am Sahaaya, your personal AI learning companion. Ask me any question in Kannada, Hindi or English, and we will explore it step-by-step!`,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [initialTopic, initialHw]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const studentMsgId = `msg-${Date.now()}`;
    const studentMsg = {
      id: studentMsgId,
      sender: 'student' as const,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, studentMsg]);
    setInputText('');
    setLoading(true);

    try {
      const resp = await SahaayaApiClient.askTutor({
        question: text,
        subject: 'Mathematics',
        grade: studentProfile?.grade || 'Class 7',
        teachingLanguage: teachingLang,
        academicLanguage: studentProfile?.academicLanguage || 'en-IN',
        synthesizeVoice: autoRead,
      });

      const tutorMsg = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor' as const,
        text: resp.answer,
        data: resp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, tutorMsg]);

      if (autoRead && resp.answer) {
        setPlayingMessageId(tutorMsg.id);
        audioPlaybackManager.speakText({
          text: resp.answer,
          audioBase64: resp.audio?.audioBase64,
          languageCode: teachingLang,
        });
      }
    } catch {
      // Dynamic Intelligent Curricular Fallback
      const fallback = SahaayaApiClient.generateDynamicFallback({
        question: text,
        subject: 'Mathematics',
        grade: studentProfile?.grade || 'Class 7',
        teachingLanguage: teachingLang,
      });

      const fallbackMsg = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor' as const,
        text: fallback.answer,
        data: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fallbackMsg]);

      if (autoRead && fallback.answer) {
        setPlayingMessageId(fallbackMsg.id);
        audioPlaybackManager.speakText({
          text: fallback.answer,
          languageCode: teachingLang,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlayMessage = (msgId: string, text: string, audioBase64?: string) => {
    if (playingMessageId === msgId) {
      audioPlaybackManager.stop();
      setPlayingMessageId(null);
    } else {
      setPlayingMessageId(msgId);
      audioPlaybackManager.speakText({
        text,
        audioBase64,
        languageCode: teachingLang,
      });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto space-y-4">
      {/* Top Header & Mode Select */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-brand-borderSubtle shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-brand-midnight shadow-glow-cyan/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-brand-white font-heading">
              Sahaaya AI Personal Tutor
            </h1>
            <p className="text-xs text-brand-dim">
              Class 7 • Karnataka Board & NCERT Grounded
            </p>
          </div>
        </div>

        {/* Language & Voice Trigger */}
        <div className="flex items-center gap-3">
          {/* Auto-read Toggle */}
          <label className="hidden sm:flex items-center gap-1.5 cursor-pointer text-xs text-brand-muted select-none">
            <input
              type="checkbox"
              checked={autoRead}
              onChange={(e) => setAutoRead(e.target.checked)}
              className="rounded border-white/20 text-brand-cyan w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-[11px] text-brand-white">Auto-Read</span>
          </label>

          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-brand-white">
            <Globe className="w-3.5 h-3.5 text-brand-cyan" />
            <select
              value={teachingLang}
              onChange={(e) => setTeachingLang(e.target.value)}
              className="bg-transparent text-xs text-brand-white focus:outline-none cursor-pointer"
            >
              <option value="kn-IN" className="bg-brand-surface text-brand-white">ಕನ್ನಡ (Kannada)</option>
              <option value="hi-IN" className="bg-brand-surface text-brand-white">हिन्दी (Hindi)</option>
              <option value="en-IN" className="bg-brand-surface text-brand-white">English</option>
            </select>
          </div>

          <Button
            variant="cyan"
            size="sm"
            icon={<Mic className="w-4 h-4" />}
            onClick={() => openGlobalVoice()}
          >
            Voice Mode
          </Button>
        </div>
      </div>

      {/* Tutor Modes Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 shrink-0 scrollbar-none">
        {tutorModes.map((m) => (
          <button
            key={m.id}
            onClick={() => setTutorMode(m.id)}
            className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              tutorMode === m.id
                ? 'bg-brand-blue text-white shadow-sm'
                : 'bg-brand-surfaceCard text-brand-muted hover:text-brand-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => {
          const isStudent = msg.sender === 'student';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                  isStudent
                    ? 'bg-brand-blue text-white rounded-br-none'
                    : 'bg-brand-surfaceCard border border-brand-borderSubtle text-brand-white rounded-bl-none space-y-3'
                }`}
              >
                {!isStudent && (
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                      <span className="text-xs font-bold text-brand-cyan">Sahaaya Tutor</span>
                      {msg.data?.isTextbookGrounded && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                          NCERT Grounded
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handlePlayMessage(msg.id, msg.text, msg.data?.audio?.audioBase64)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold transition-all ${
                        playingMessageId === msg.id
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-white/5 hover:bg-white/10 text-brand-cyan'
                      }`}
                      title={playingMessageId === msg.id ? 'Stop speaking' : 'Listen to this explanation'}
                    >
                      {playingMessageId === msg.id ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-red-400" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {msg.text}
                </p>

                {/* Additional pedagogical widgets if tutor response */}
                {msg.data && (
                  <div className="space-y-2 pt-2 border-t border-white/5">
                    {/* Indian Real-Life Example */}
                    {msg.data.examples && msg.data.examples.length > 0 && (
                      <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                        <span className="font-bold text-amber-300 block mb-0.5">
                          Everyday Life Analogy:
                        </span>
                        <p className="text-brand-muted">{msg.data.examples[0]}</p>
                      </div>
                    )}

                    {/* Key Terminology Bridge */}
                    {msg.data.keyTerms && msg.data.keyTerms.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {msg.data.keyTerms.map((t, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-lg bg-brand-violet/15 text-brand-violet text-[11px] font-semibold"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Follow-up practice question */}
                    {msg.data.practiceQuestion && (
                      <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-2">
                        <span className="text-xs font-bold text-brand-cyan block">
                          Quick Spoken Check: {msg.data.practiceQuestion.question}
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          {msg.data.practiceQuestion.options.map((opt, i) => (
                            <button
                              key={i}
                              onClick={() => sendMessage(`My answer is: ${opt}`)}
                              className="p-2 rounded-lg bg-brand-surface hover:bg-brand-surfaceElevated text-left text-xs text-brand-white border border-brand-borderSubtle hover:border-brand-cyan/40 transition-colors"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-brand-dim mt-1 px-1">{msg.timestamp}</span>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand-surfaceCard border border-brand-borderSubtle text-brand-muted text-xs max-w-xs animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
            <span>Sahaaya is reasoning pedagogically...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box Footer */}
      <div className="pt-2 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type your question or academic doubt..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            className="flex-1 bg-brand-surfaceCard border border-brand-borderSubtle text-brand-white text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-brand-cyan/60"
          />
          <Button
            variant="cyan"
            type="submit"
            disabled={loading || !inputText.trim()}
            className="h-12 w-12 rounded-2xl p-0 flex items-center justify-center shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
