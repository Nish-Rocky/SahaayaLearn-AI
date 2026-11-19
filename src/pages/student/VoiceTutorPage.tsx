import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Globe,
  RotateCcw,
  BookOpen,
  Square,
  Gauge,
  Send,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../../state/authStore';
import { SahaayaApiClient, TutorResponseData } from '../../services/api';
import { Card, Button, Badge } from '../../components/ui';
import { audioPlaybackManager, PlaybackState } from '../../services/audioPlayback';

interface VoiceTurn {
  id: string;
  speaker: 'student' | 'tutor';
  text: string;
  data?: TutorResponseData;
  timestamp: string;
}

export const VoiceTutorPage: React.FC = () => {
  const { studentProfile } = useAuthStore();
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [teachingLang, setTeachingLang] = useState(studentProfile?.teachingLanguage || 'kn-IN');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speechSpeed, setSpeechSpeed] = useState(1.0);
  const [loading, setLoading] = useState(false);
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [conversation, setConversation] = useState<VoiceTurn[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
    { code: 'en-IN', name: 'English (Indian)' },
    { code: 'te-IN', name: 'తెలుగు (Telugu)' },
    { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
  ];

  // Subscribe to audio state
  useEffect(() => {
    const unsub = audioPlaybackManager.subscribeState((state) => {
      setPlaybackState(state);
    });
    return () => {
      unsub();
      audioPlaybackManager.stop();
    };
  }, []);

  useEffect(() => {
    audioPlaybackManager.setRate(speechSpeed);
  }, [speechSpeed]);

  // Speech Recognition
  useEffect(() => {
    let recognition: any = null;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRec && isRecording) {
      audioPlaybackManager.unlockAudioContext();
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
        if (transcript.trim()) {
          handleSubmitVoice(transcript);
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

  // Auto-scroll
  useEffect(() => {
    chatScrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, loading]);

  const handleSubmitVoice = async (queryText?: string) => {
    const q = (queryText || transcript).trim();
    if (!q) return;

    audioPlaybackManager.stop();
    audioPlaybackManager.unlockAudioContext();
    setIsRecording(false);
    setLoading(true);
    setPlaybackState('processing');

    const studentTurn: VoiceTurn = {
      id: `stu-${Date.now()}`,
      speaker: 'student',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setConversation((prev) => [...prev, studentTurn]);
    setTranscript('');

    try {
      setPlaybackState('generating_text');

      const data = await SahaayaApiClient.askTutor({
        question: q,
        teachingLanguage: teachingLang,
        grade: studentProfile?.grade || 'Class 7',
        subject: 'Mathematics',
        synthesizeVoice: true,
      });

      const tutorTurn: VoiceTurn = {
        id: `tut-${Date.now()}`,
        speaker: 'tutor',
        text: data.answer,
        data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setConversation((prev) => [...prev, tutorTurn]);

      // Automatically Speak Spoken Answer
      if (autoSpeak && data.answer) {
        setPlaybackState('speaking');
        await audioPlaybackManager.speakText({
          text: data.answer,
          audioBase64: data.audio?.audioBase64,
          languageCode: teachingLang,
        });
      } else {
        setPlaybackState('completed');
      }
    } catch {
      // Dynamic fallback
      const fallback = SahaayaApiClient.generateDynamicFallback({
        question: q,
        teachingLanguage: teachingLang,
        grade: studentProfile?.grade || 'Class 7',
        subject: 'Mathematics',
      });

      const fallbackTurn: VoiceTurn = {
        id: `tut-${Date.now()}`,
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Title Header */}
      <div className="text-center space-y-2">
        <Badge variant="cyan" size="md">Global Voice Gateway</Badge>
        <h1 className="text-3xl font-extrabold text-brand-white font-heading">
          Sahaaya Voice Studio
        </h1>
        <p className="text-xs md:text-sm text-brand-muted max-w-lg mx-auto">
          Natural speech in Kannada, Hindi, and English with acoustic speech recovery and Groq GPT-OSS reasoning.
        </p>
      </div>

      {/* Voice Control & Visualizer Card */}
      <Card className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 border border-brand-cyan/30 shadow-glow-cyan/20 relative overflow-hidden">
        {/* Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between w-full max-w-md gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 text-xs text-brand-white">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 px-2 py-1">
            <Globe className="w-4 h-4 text-brand-cyan" />
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

          {/* Speed & Auto-speak */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px]">
              <input
                type="checkbox"
                checked={autoSpeak}
                onChange={(e) => setAutoSpeak(e.target.checked)}
                className="rounded border-white/20 text-brand-cyan w-3.5 h-3.5 cursor-pointer"
              />
              <span>Auto-Speak</span>
            </label>

            <div className="flex items-center gap-1">
              {[0.8, 1.0, 1.2].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeechSpeed(s)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    speechSpeed === s ? 'bg-brand-cyan text-brand-midnight font-bold' : 'text-brand-muted'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Large Central Orb */}
        <div className="relative py-2">
          {(isRecording || playbackState === 'speaking') && (
            <>
              <motion.div
                animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute -inset-6 rounded-full blur-xl pointer-events-none ${
                  isRecording ? 'bg-red-500/30' : 'bg-brand-cyan/30'
                }`}
              />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.15, 0.4, 0.15] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className={`absolute -inset-10 rounded-full blur-2xl pointer-events-none ${
                  isRecording ? 'bg-amber-500/20' : 'bg-brand-blue/20'
                }`}
              />
            </>
          )}

          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl ${
              isRecording
                ? 'bg-gradient-to-tr from-red-500 to-amber-500 text-white animate-pulse shadow-red-500/40'
                : playbackState === 'speaking'
                ? 'bg-gradient-to-tr from-brand-violet to-brand-cyan text-brand-midnight animate-pulse shadow-glow-cyan/50'
                : 'bg-gradient-to-tr from-brand-cyan to-brand-blue text-brand-midnight hover:scale-105 shadow-glow-cyan/50'
            }`}
          >
            {isRecording ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
          </button>
        </div>

        {/* Spoken Audio State & Waveform */}
        <div className="space-y-2">
          <p className="text-sm font-semibold text-brand-white">
            {isRecording
              ? 'Listening to your voice...'
              : playbackState === 'processing'
              ? 'Understanding question with Groq GPT-OSS...'
              : playbackState === 'speaking'
              ? 'Speaking response (Audio active)...'
              : playbackState === 'interrupted'
              ? 'Interrupted. Tap mic to speak again.'
              : 'Tap to speak your academic question'}
          </p>

          {(isRecording || playbackState === 'speaking') && (
            <div className="flex items-center justify-center gap-1 h-8">
              {[...Array(16)].map((_, i) => (
                <motion.span
                  key={i}
                  animate={{ height: ['6px', '32px', '6px'] }}
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

          {playbackState === 'speaking' && (
            <button
              onClick={handleStopSpeaking}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-300 rounded-full text-xs font-semibold transition-all mt-2"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Speaking (Barge-in)</span>
            </button>
          )}
        </div>

        {/* Quick Sample Questions */}
        {conversation.length === 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
            {[
              'Explain Newton\'s laws of motion with simple examples',
              'Why can\'t we add denominators directly in fractions?',
              'How does photosynthesis work in green plants?',
              'ಕನ್ನಡ ಸಂಧಿಗಳ ವಿವರಣೆ ಕೊಡಿ',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setTranscript(chip);
                  handleSubmitVoice(chip);
                }}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-brand-muted hover:text-brand-white transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        )}
      </Card>

      {/* Conversation Turns & Spoken Answers */}
      {conversation.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-brand-white uppercase tracking-wider">
              Spoken Voice Session History
            </h2>
            <button
              onClick={() => {
                audioPlaybackManager.stop();
                setConversation([]);
              }}
              className="flex items-center gap-1 text-xs text-brand-muted hover:text-red-400"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Session</span>
            </button>
          </div>

          {conversation.map((turn) => {
            const isStudent = turn.speaker === 'student';

            return (
              <motion.div
                key={turn.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-5 shadow-sm ${
                    isStudent
                      ? 'bg-brand-blue text-white rounded-br-none'
                      : 'bg-brand-surfaceCard border border-brand-cyan/30 text-brand-white rounded-bl-none space-y-3'
                  }`}
                >
                  {!isStudent && (
                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-brand-cyan" />
                        <span className="text-xs font-bold text-brand-cyan">Sahaaya Voice Response</span>
                        {turn.data?.isTextbookGrounded && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-500/20 text-emerald-300">
                            NCERT Grounded
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => handleReplayResponse(turn.text, turn.data?.audio?.audioBase64)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-brand-cyan transition-colors"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Replay</span>
                      </button>
                    </div>
                  )}

                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
                    {turn.text}
                  </p>

                  {turn.data?.examples && turn.data.examples.length > 0 && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                      <span className="font-bold text-amber-300 block mb-0.5">Everyday Life Analogy:</span>
                      <p className="text-brand-muted">{turn.data.examples[0]}</p>
                    </div>
                  )}

                  {turn.data?.keyTerms && turn.data.keyTerms.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {turn.data.keyTerms.map((t, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg bg-brand-violet/15 text-brand-violet text-[11px] font-semibold">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-brand-dim mt-1 px-1">{turn.timestamp}</span>
              </motion.div>
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
      )}

      {/* Manual Input Footer for Follow-ups */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitVoice();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Type or speak a follow-up doubt..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={loading}
            className="flex-1 bg-brand-surfaceCard border border-brand-borderSubtle text-brand-white text-sm rounded-2xl px-4 py-3 focus:outline-none focus:border-brand-cyan/60"
          />
          <button
            type="submit"
            disabled={loading || !transcript.trim()}
            className="w-12 h-12 rounded-2xl bg-brand-cyan hover:bg-cyan-400 disabled:opacity-40 flex items-center justify-center text-brand-midnight transition-colors"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </form>
      </div>
    </div>
  );
};
