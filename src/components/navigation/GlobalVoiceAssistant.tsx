import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  X,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  BookOpen,
  Globe,
  Loader2,
  RotateCcw,
  Gauge,
  CheckCircle2,
  AlertCircle,
  Square,
} from 'lucide-react';
import { useUiStore } from '../../state/uiStore';
import { useAuthStore } from '../../state/authStore';
import { SahaayaApiClient, TutorResponseData } from '../../services/api';
import { audioPlaybackManager, PlaybackState } from '../../services/audioPlayback';

interface ConversationTurn {
  id: string;
  speaker: 'student' | 'tutor';
  text: string;
  data?: TutorResponseData;
  timestamp: string;
}

export const GlobalVoiceAssistant: React.FC = () => {
  const { globalVoiceOpen, closeGlobalVoice, voiceContext } = useUiStore();
  const { studentProfile } = useAuthStore();

  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [teachingLang, setTeachingLang] = useState(studentProfile?.teachingLanguage || 'kn-IN');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentResponse, setCurrentResponse] = useState<TutorResponseData | null>(null);
  const [conversation, setConversation] = useState<ConversationTurn[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Available languages
  const languages = [
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
    { code: 'en-IN', name: 'English (Indian)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
    { code: 'mr-IN', name: 'मराठी (Marathi)' },
  ];

  // Subscribe to audio playback state
  useEffect(() => {
    const unsubscribe = audioPlaybackManager.subscribeState((state) => {
      setPlaybackState(state);
    });
    return () => {
      unsubscribe();
      audioPlaybackManager.stop();
    };
  }, []);

  // Update playback speed
  useEffect(() => {
    audioPlaybackManager.setRate(speechSpeed);
  }, [speechSpeed]);

  // Speech Recognition Handling
  useEffect(() => {
    let recognition: any = null;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRec && isRecording) {
      audioPlaybackManager.unlockAudioContext();
      // Barge-in: If assistant was speaking, stop immediately when user activates mic
      audioPlaybackManager.stop();

      recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = teachingLang;

      recognition.onstart = () => {
        setPlaybackState('listening');
      };

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentText += event.results[i][0].transcript;
        }
        setTranscript(currentText);
      };

      recognition.onerror = () => {
        setIsRecording(false);
        setPlaybackState('idle');
      };

      recognition.onend = () => {
        setIsRecording(false);
        // If student spoke something, automatically submit query
        if (transcript.trim()) {
          handleSubmitQuery(transcript);
        } else {
          setPlaybackState('idle');
        }
      };

      try {
        recognition.start();
      } catch {
        setIsRecording(false);
      }
    }

    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch {}
      }
    };
  }, [isRecording, teachingLang]);

  // Auto-scroll chat
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, currentResponse, loading]);

  // Handle submit query to Groq GPT-OSS Tutor Engine
  const handleSubmitQuery = async (queryText?: string) => {
    const q = (queryText || transcript).trim();
    if (!q) return;

    audioPlaybackManager.stop();
    audioPlaybackManager.unlockAudioContext();
    setIsRecording(false);
    setLoading(true);
    setPlaybackState('processing');

    const studentMsgId = `turn-stu-${Date.now()}`;
    const studentTurn: ConversationTurn = {
      id: studentMsgId,
      speaker: 'student',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, studentTurn]);
    setTranscript('');

    try {
      setPlaybackState('generating_text');

      const resp = await SahaayaApiClient.askTutor({
        question: q,
        subject: voiceContext?.subject || 'Mathematics',
        grade: studentProfile?.grade || 'Class 7',
        teachingLanguage: teachingLang,
        academicLanguage: studentProfile?.academicLanguage || 'en-IN',
        synthesizeVoice: true,
      });

      setCurrentResponse(resp);

      const tutorTurn: ConversationTurn = {
        id: `turn-tut-${Date.now()}`,
        speaker: 'tutor',
        text: resp.answer,
        data: resp,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversation((prev) => [...prev, tutorTurn]);

      // Spoken Feedback: Play automatically if autoSpeak is enabled (Part 5 requirement)
      if (autoSpeak && resp.answer) {
        setPlaybackState('speaking');
        await audioPlaybackManager.speakText({
          text: resp.answer,
          audioBase64: resp.audio?.audioBase64,
          languageCode: teachingLang,
        });
      } else {
        setPlaybackState('completed');
      }
    } catch {
      // Dynamic fallback
      const fallback = SahaayaApiClient.generateDynamicFallback({
        question: q,
        subject: voiceContext?.subject || 'Mathematics',
        grade: studentProfile?.grade || 'Class 7',
        teachingLanguage: teachingLang,
      });

      setCurrentResponse(fallback);

      const fallbackTurn: ConversationTurn = {
        id: `turn-tut-${Date.now()}`,
        speaker: 'tutor',
        text: fallback.answer,
        data: fallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversation((prev) => [...prev, fallbackTurn]);

      if (autoSpeak && fallback.answer) {
        setPlaybackState('speaking');
        await audioPlaybackManager.speakText({
          text: fallback.answer,
          languageCode: teachingLang,
        });
      } else {
        setPlaybackState('completed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStopSpeaking = () => {
    audioPlaybackManager.stop();
    setPlaybackState('interrupted');
    SahaayaApiClient.stopVoice().catch(() => {});
  };

  const handleReplayResponse = (text: string, audioBase64?: string) => {
    audioPlaybackManager.speakText({
      text,
      audioBase64,
      languageCode: teachingLang,
    });
  };

  const handleClearHistory = () => {
    audioPlaybackManager.stop();
    setConversation([]);
    setCurrentResponse(null);
    setPlaybackState('idle');
  };

  if (!globalVoiceOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-brand-midnight/85 backdrop-blur-md"
          onClick={closeGlobalVoice}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          className="relative w-full max-w-2xl bg-brand-surface border border-brand-cyan/40 rounded-3xl shadow-glow-cyan/25 p-5 sm:p-6 z-10 flex flex-col max-h-[92vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-brand-borderSubtle">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-brand-midnight shadow-glow-cyan/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-brand-white font-heading">
                    Sahaaya Voice Tutor
                  </h3>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 font-mono">
                    Groq GPT-OSS
                  </span>
                </div>
                <p className="text-xs text-brand-muted">
                  Interactive voice assistant • Natural spoken explanations in Indian languages
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Language Selector */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-xl text-xs text-brand-white">
                <Globe className="w-3.5 h-3.5 text-brand-cyan" />
                <select
                  value={teachingLang}
                  onChange={(e) => setTeachingLang(e.target.value)}
                  className="bg-transparent text-xs text-brand-white focus:outline-none cursor-pointer"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code} className="bg-brand-surface text-brand-white">
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={closeGlobalVoice}
                className="p-1.5 text-brand-dim hover:text-brand-white hover:bg-white/5 rounded-xl transition-colors"
                title="Close Voice Assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Settings Toolbar */}
          <div className="flex items-center justify-between py-2 px-1 text-xs text-brand-muted border-b border-white/5">
            <div className="flex items-center gap-4">
              {/* Auto Speak Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSpeak}
                  onChange={(e) => setAutoSpeak(e.target.checked)}
                  className="rounded border-white/20 text-brand-cyan focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                />
                <span className="text-[11px] text-brand-white">Auto-Speak Answers</span>
              </label>

              {/* Speed Controller */}
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-brand-cyan" />
                <span className="text-[11px]">Speed:</span>
                {[0.8, 1.0, 1.2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSpeechSpeed(s)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                      speechSpeed === s
                        ? 'bg-brand-cyan/20 text-brand-cyan font-bold'
                        : 'text-brand-muted hover:text-brand-white'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>

            {conversation.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="flex items-center gap-1 text-[11px] text-brand-muted hover:text-red-400 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Chat</span>
              </button>
            )}
          </div>

          {/* Main Visualizer & Chat Stream Area */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {/* Active Context Banner */}
            {voiceContext?.subject && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue/15 border border-brand-blue/30 rounded-full text-xs text-brand-cyan">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Context: {voiceContext.subject} {voiceContext.topic ? `• ${voiceContext.topic}` : ''}</span>
              </div>
            )}

            {/* Central Animated Orb */}
            <div className="flex flex-col items-center justify-center py-3">
              <div className="relative">
                {/* Glow rings when listening or speaking */}
                {(isRecording || playbackState === 'speaking') && (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.7, 0.3] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                      className={`absolute -inset-4 rounded-full blur-md pointer-events-none ${
                        isRecording ? 'bg-red-500/25' : 'bg-brand-cyan/25'
                      }`}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.7, 1], opacity: [0.15, 0.4, 0.15] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      className={`absolute -inset-8 rounded-full blur-lg pointer-events-none ${
                        isRecording ? 'bg-amber-500/15' : 'bg-brand-blue/20'
                      }`}
                    />
                  </>
                )}

                <button
                  onClick={() => setIsRecording(!isRecording)}
                  className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
                    isRecording
                      ? 'bg-gradient-to-tr from-red-500 to-amber-500 text-white shadow-red-500/40 animate-pulse'
                      : playbackState === 'speaking'
                      ? 'bg-gradient-to-tr from-brand-violet to-brand-cyan text-brand-midnight shadow-glow-cyan/50 animate-pulse'
                      : 'bg-gradient-to-tr from-brand-cyan to-brand-blue text-brand-midnight hover:scale-105 shadow-glow-cyan/40'
                  }`}
                  title={isRecording ? 'Stop Recording' : 'Start Speaking'}
                >
                  {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2 mt-3">
                {playbackState === 'speaking' && (
                  <span className="w-2 h-2 rounded-full bg-brand-cyan animate-ping" />
                )}
                <p className="text-xs font-semibold text-brand-white">
                  {isRecording
                    ? 'Listening... Speak in your language'
                    : playbackState === 'processing'
                    ? 'Understanding your academic question...'
                    : playbackState === 'generating_text'
                    ? 'Preparing personalized explanation...'
                    : playbackState === 'speaking'
                    ? 'Sahaaya is explaining (Spoken Audio Active)...'
                    : playbackState === 'interrupted'
                    ? 'Audio interrupted. Ready for next question.'
                    : 'Tap microphone to speak, or ask follow-ups below'}
                </p>
              </div>

              {/* Live Waveform Indicator */}
              {(isRecording || playbackState === 'speaking') && (
                <div className="flex items-center gap-1 mt-2.5 h-6">
                  {[...Array(14)].map((_, i) => (
                    <motion.span
                      key={i}
                      animate={{ height: ['6px', '26px', '6px'] }}
                      transition={{
                        duration: 0.5 + (i % 4) * 0.15,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: i * 0.04,
                      }}
                      className={`w-1 rounded-full ${isRecording ? 'bg-red-400' : 'bg-brand-cyan'}`}
                    />
                  ))}
                </div>
              )}

              {/* Barge-in Stop Speaking Button */}
              {playbackState === 'speaking' && (
                <button
                  onClick={handleStopSpeaking}
                  className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-full text-xs font-semibold transition-all"
                >
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Speaking (Barge-in)</span>
                </button>
              )}
            </div>

            {/* Quick Inquiry Chips (Initial state) */}
            {conversation.length === 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 py-2">
                {[
                  'Explain Newton\'s laws of motion with simple examples',
                  'Why can\'t we add denominators directly in fractions?',
                  'How does photosynthesis work in green plants?',
                  'ಕನ್ನಡ ಸಂಧಿಗಳ ಬಗ್ಗೆ ಸರಳವಾಗಿ ವಿವರಿಸಿ',
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setTranscript(suggestion);
                      handleSubmitQuery(suggestion);
                    }}
                    className="px-3 py-1.5 bg-brand-surfaceCard hover:bg-brand-surfaceElevated border border-brand-borderSubtle rounded-xl text-xs text-brand-muted hover:text-brand-white transition-all text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Conversation Flow (Supports Follow-Up Questions) */}
            {conversation.map((turn) => {
              const isStudent = turn.speaker === 'student';

              return (
                <div
                  key={turn.id}
                  className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl p-4 shadow-sm ${
                      isStudent
                        ? 'bg-brand-blue text-white rounded-br-none'
                        : 'bg-brand-surfaceCard/95 border border-brand-cyan/20 text-brand-white rounded-bl-none space-y-3'
                    }`}
                  >
                    {!isStudent && (
                      <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                          <span className="text-xs font-bold text-brand-cyan">Sahaaya Tutor</span>
                          {turn.data?.isTextbookGrounded && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                              NCERT Grounded
                            </span>
                          )}
                        </div>

                        {/* Read Aloud / Replay button on every tutor message */}
                        <button
                          onClick={() => handleReplayResponse(turn.text, turn.data?.audio?.audioBase64)}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] text-brand-cyan transition-colors"
                          title="Read this explanation aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Listen</span>
                        </button>
                      </div>
                    )}

                    <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {turn.text}
                    </p>

                    {/* Additional Pedagogical Elements */}
                    {turn.data && (
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        {turn.data.examples && turn.data.examples.length > 0 && (
                          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                            <span className="font-bold text-amber-300 block mb-0.5">
                              Everyday Indian Analogy:
                            </span>
                            <p className="text-brand-muted">{turn.data.examples[0]}</p>
                          </div>
                        )}

                        {turn.data.keyTerms && turn.data.keyTerms.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {turn.data.keyTerms.map((term, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-brand-violet/15 border border-brand-violet/30 rounded-lg text-[11px] text-brand-violet font-semibold"
                              >
                                {term}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-brand-dim mt-1 px-1">{turn.timestamp}</span>
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-brand-surfaceCard border border-brand-borderSubtle text-brand-muted text-xs max-w-xs animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-brand-cyan" />
                <span>Sahaaya is reasoning pedagogically...</span>
              </div>
            )}
            <div ref={chatScrollRef} />
          </div>

          {/* Footer Input Box */}
          <div className="pt-3 border-t border-brand-borderSubtle">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmitQuery();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder={isRecording ? 'Listening...' : 'Type or speak a question or follow-up...'}
                className="flex-1 bg-brand-surfaceCard border border-brand-borderSubtle rounded-2xl px-4 py-3 text-sm text-brand-white placeholder-brand-dim focus:outline-none focus:border-brand-cyan/60"
              />
              <button
                type="submit"
                disabled={loading || !transcript.trim()}
                className="w-12 h-12 rounded-2xl bg-brand-blue hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-white transition-all shrink-0"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
