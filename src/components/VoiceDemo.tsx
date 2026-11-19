import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  Sparkles, 
  Send, 
  CheckCircle, 
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { SampleTopic, ChatMessage } from '../types/index.ts';
import { SahaayaApiClient } from '../services/api.ts';

const SAMPLE_TOPICS: SampleTopic[] = [
  {
    id: 'fractions-kannada',
    title: 'Fractions & Ratios (ಭಿನ್ನರಾಶಿಗಳು)',
    subject: 'Mathematics',
    classGrade: 'Class 7',
    suggestedQuestions: [
      'Can you explain fractions in Kannada?',
      'What happens when I add 1/4 and 1/4?',
      'Why does the denominator stay the same?',
      'How do I convert improper fraction to mixed fraction?'
    ],
    conversation: [
      {
        id: 'msg-1',
        sender: 'student',
        text: 'Can you explain fractions in Kannada?',
        lang: 'kn',
        timestamp: '10:42 AM',
      },
      {
        id: 'msg-2',
        sender: 'tutor',
        text: 'ಖಂಡಿತ! Imagine a pizza divided into four equal pieces (ನಾಲ್ಕು ಸಮಾನ ಭಾಗಗಳು). Each piece represents one-fourth (ನಾಲ್ಕರಲ್ಲಿ ಒಂದು ಪಾಲು - 1/4).',
        lang: 'kn',
        timestamp: '10:42 AM',
        conceptTag: 'Equal Partitioning',
        hasAudio: true,
      },
      {
        id: 'msg-3',
        sender: 'student',
        text: 'What happens when I add one-fourth and one-fourth?',
        lang: 'en',
        timestamp: '10:43 AM',
      },
      {
        id: 'msg-4',
        sender: 'tutor',
        text: "You now have two of the four pieces (2/4 = 1/2). Let's explore why the denominator stays the same: the denominator tells us the size of the slice, not how many slices you have!",
        lang: 'en',
        timestamp: '10:43 AM',
        conceptTag: 'Common Denominator Invariance',
        hasAudio: true,
      },
      {
        id: 'msg-5',
        sender: 'student',
        text: 'Okay, I understand!',
        lang: 'en',
        timestamp: '10:44 AM',
      },
    ],
    textbookRef: {
      book: 'NCERT Mathematics Class 7',
      chapter: 'Chapter 2: Fractions and Decimals',
      page: 31,
      quote: 'A fraction represents a part of a whole or any number of equal parts.',
    },
    quizCard: {
      question: 'What is 2/5 + 1/5 equal to?',
      options: ['3/10', '3/5', '2/5', '1/5'],
      correctIndex: 1,
      explanation: 'Because both fractions have the same denominator (5), we add only numerators: 2 + 1 = 3/5.',
    },
  },
  {
    id: 'photosynthesis-hindi',
    title: 'Photosynthesis (प्रकाश संश्लेषण)',
    subject: 'Science',
    classGrade: 'Class 8',
    suggestedQuestions: [
      'पेड़-पौधे अपना भोजन कैसे बनाते हैं?',
      'What is the role of chlorophyll?',
      'Why do plants release oxygen during day?',
    ],
    conversation: [
      {
        id: 'msg-h1',
        sender: 'student',
        text: 'पेड़-पौधे अपना भोजन कैसे बनाते हैं?',
        lang: 'hi',
        timestamp: '11:15 AM',
      },
      {
        id: 'msg-h2',
        sender: 'tutor',
        text: 'शानदार सवाल! पौधे धूप (Sunlight), पानी (Water) और हवा से कार्बन डाइऑक्साइड लेकर रसोई की तरह खाना बनाते हैं। इसे प्रकाश संश्लेषण (Photosynthesis) कहते हैं।',
        lang: 'hi',
        timestamp: '11:15 AM',
        conceptTag: 'Solar Chemical Conversion',
        hasAudio: true,
      },
    ],
    textbookRef: {
      book: 'NCERT Science Class 8',
      chapter: 'Chapter 1: Nutrition in Plants',
      page: 12,
      quote: 'Photosynthesis is the process by which green plants synthesize nutrients from carbon dioxide and water.',
    },
    quizCard: {
      question: 'Which gas is taken in by plants during photosynthesis?',
      options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Argon'],
      correctIndex: 1,
      explanation: 'Plants absorb Carbon Dioxide (CO2) from the air through microscopic stomata.',
    },
  },
];

export const VoiceDemo: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('fractions-kannada');
  const [selectedLang, setSelectedLang] = useState<string>('kn');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [inputVal, setInputVal] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE_TOPICS[0].conversation);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [hasAnsweredQuiz, setHasAnsweredQuiz] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const currentTopic = SAMPLE_TOPICS.find((t) => t.id === selectedTopicId) || SAMPLE_TOPICS[0];

  // Check Web Speech API support
  useEffect(() => {
    const hasSpeech = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    setSpeechSupported(hasSpeech);
  }, []);

  // Sync conversation when switching topics
  useEffect(() => {
    setMessages(currentTopic.conversation);
    setSelectedQuizAnswer(null);
    setHasAnsweredQuiz(false);
  }, [selectedTopicId, currentTopic]);

  // Scroll chat bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle voice recording simulation & real speech fallback
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Add simulated voice question
    const defaultVoiceQ = selectedLang === 'kn'
      ? 'ಇನ್ನೊಂದು ಉದಾಹರಣೆ ನೀಡಿ (Can you give another example?)'
      : selectedLang === 'hi'
      ? 'क्या रात में भी प्रकाश संश्लेषण होता है?'
      : 'Can you give one more real-world example?';

    handleSendMessage(defaultVoiceQ);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const qText = textToSend || inputVal.trim();
    if (!qText) return;

    const newStudentMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: qText,
      lang: selectedLang,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newStudentMsg]);
    setInputVal('');

    try {
      // Live backend call to SahaayaLearn API
      const responseData = await SahaayaApiClient.askTutor({
        question: qText,
        subject: currentTopic.subject,
        grade: currentTopic.classGrade,
        teachingLanguage: selectedLang,
        academicLanguage: 'en-IN',
      });

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: responseData.answer,
        lang: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        conceptTag: responseData.isTextbookGrounded ? 'Textbook-Grounded Curricular Answer' : 'Conceptual Clarification',
        hasAudio: true,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      speakText(responseData.answer);
    } catch {
      // Graceful offline fallback
      const tutorReplyText = qText.toLowerCase().includes('example') || qText.includes('ಉದಾಹರಣೆ')
        ? "ಉತ್ತಮ ಪ್ರಶ್ನೆ! Consider a chocolate bar with 8 cubes. Eating 2 cubes means eating 2/8 = 1/4 of the entire bar. See how the visual partition matches?"
        : "Textbook-verified: In Class 7 syllabus, we observe that equal parts always require the whole to be uniformly divided.";

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: tutorReplyText,
        lang: selectedLang,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        conceptTag: 'Concrete Real-World Analogy',
        hasAudio: true,
      };

      setMessages((prev) => [...prev, tutorMsg]);
      speakText(tutorReplyText);
    }
  };

  // Browser SpeechSynthesis audio player
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="w-full rounded-3xl bg-brand-surface/90 border border-brand-cyan/25 shadow-glass overflow-hidden flex flex-col backdrop-blur-2xl">
      
      {/* Top Application Bar */}
      <div className="px-6 py-4 bg-brand-deep/95 border-b border-white/10 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Companion Persona & State */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-cyan to-brand-blue flex items-center justify-center text-brand-midnight font-bold shadow-glow-cyan">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-brand-deep" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-brand-white">Sahaaya Personal Tutor</h4>
              <span className="px-2 py-0.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/30 text-[10px] font-mono font-semibold text-brand-cyan">
                Interactive Preview
              </span>
            </div>
            <span className="text-xs text-brand-dim font-medium">
              Grade 6–10 Companion • Listening Mode Ready
            </span>
          </div>
        </div>

        {/* Right: Controls & Selectors */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1.5 bg-brand-surface border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-brand-dim">Language:</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              className="bg-transparent text-brand-white font-semibold focus:outline-none cursor-pointer"
            >
              <option value="kn" className="bg-brand-deep">Kannada (ಕನ್ನಡ)</option>
              <option value="hi" className="bg-brand-deep">Hindi (हिंदी)</option>
              <option value="en" className="bg-brand-deep">English</option>
              <option value="te" className="bg-brand-deep">Telugu (తెలుగు)</option>
              <option value="ta" className="bg-brand-deep">Tamil (தமிழ்)</option>
            </select>
          </div>

          {/* Topic Selector */}
          <div className="flex items-center gap-1.5 bg-brand-surface border border-white/10 px-3 py-1.5 rounded-xl text-xs">
            <span className="text-brand-dim">Topic:</span>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="bg-transparent text-brand-white font-semibold focus:outline-none cursor-pointer"
            >
              {SAMPLE_TOPICS.map((topic) => (
                <option key={topic.id} value={topic.id} className="bg-brand-deep">
                  {topic.title}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Main Workspace Layout (2 Columns: Conversation vs Textbook & Quiz) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        
        {/* Left Column (8 Cols): Conversational Voice Stream */}
        <div className="lg:col-span-8 p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-brand-midnight/40">
          
          {/* Message Bubbles Container */}
          <div className="space-y-4 overflow-y-auto max-h-[380px] pr-2">
            <div className="text-center my-2">
              <span className="text-[11px] font-mono text-brand-dim bg-brand-deep/80 px-3 py-1 rounded-full border border-white/5">
                Sample illustrative interaction • Audio verified
              </span>
            </div>

            {messages.map((msg) => {
              const isTutor = msg.sender === 'tutor';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isTutor ? 'justify-start' : 'justify-end'}`}
                >
                  {isTutor && (
                    <div className="w-8 h-8 rounded-full bg-brand-deep border border-brand-cyan/40 flex items-center justify-center text-brand-cyan shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-sm leading-relaxed ${
                      isTutor
                        ? 'bg-brand-surface/90 border border-brand-cyan/20 text-brand-white shadow-sm'
                        : 'bg-gradient-to-r from-brand-blue to-brand-violet text-white font-medium ml-auto'
                    }`}
                  >
                    {isTutor && msg.conceptTag && (
                      <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-white/10 text-[10px] font-mono text-brand-cyan">
                        <span>CONCEPT: {msg.conceptTag}</span>
                        {msg.hasAudio && (
                          <button
                            onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text))}
                            className="hover:text-brand-white flex items-center gap-1 transition-colors"
                            title="Play spoken explanation"
                          >
                            {isSpeaking ? (
                              <VolumeX className="w-3.5 h-3.5 text-brand-amber animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[9px] uppercase font-bold">
                              {isSpeaking ? 'Playing' : 'Listen'}
                            </span>
                          </button>
                        )}
                      </div>
                    )}

                    <p>{msg.text}</p>

                    <span className="text-[10px] opacity-60 mt-1 block text-right font-mono">
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={chatBottomRef} />
          </div>

          {/* Bottom Voice & Text Input Console */}
          <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
            
            {/* Suggested Spoken Prompts Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-mono text-brand-dim uppercase shrink-0">
                Suggested questions:
              </span>
              {currentTopic.suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(q)}
                  className="px-3 py-1 rounded-full bg-brand-deep hover:bg-brand-surface border border-white/10 hover:border-brand-cyan/40 text-xs text-brand-muted hover:text-brand-white whitespace-nowrap transition-colors"
                >
                  "{q}"
                </button>
              ))}
            </div>

            {/* Live Waveform Bar (When Voice Recording is Active) */}
            {isRecording && (
              <div className="p-3 rounded-xl bg-brand-deep border border-brand-cyan/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-xs font-mono font-bold text-brand-cyan uppercase">
                    Listening ({recordingSeconds}s)... Speak naturally
                  </span>
                </div>
                <div className="flex items-center gap-1 h-5">
                  {[30, 80, 50, 90, 40, 100, 60, 45, 85, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-brand-cyan rounded-full animate-wave"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Interactive Controls Bar */}
            <div className="flex items-center gap-3">
              {/* Giant Voice Push-to-Talk Button */}
              <button
                onClick={toggleRecording}
                className={`relative px-5 py-3 rounded-xl font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all duration-300 ${
                  isRecording
                    ? 'bg-red-500 text-white shadow-lg animate-pulse'
                    : 'bg-gradient-to-r from-brand-cyan to-brand-blue text-brand-midnight shadow-glow-cyan hover:scale-[1.02]'
                }`}
              >
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isRecording ? 'Stop & Send' : 'Speak to Tutor'}</span>
              </button>

              {/* Text Input Box */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={
                    speechSupported
                      ? "Or type a concept question here..."
                      : "Type question or use mic (Speech preview enabled)..."
                  }
                  className="w-full bg-brand-deep/80 border border-white/10 rounded-xl px-4 py-3 text-xs sm:text-sm text-brand-white placeholder-brand-dim focus:outline-none focus:border-brand-cyan/50"
                />
              </div>

              {/* Submit text button */}
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputVal.trim()}
                className="p-3 rounded-xl bg-brand-surface hover:bg-brand-deep border border-white/10 disabled:opacity-40 text-brand-cyan hover:text-white transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Right Column (4 Cols): Textbook Reference & Interactive Spoken Quiz Card */}
        <div className="lg:col-span-4 p-6 bg-brand-deep/40 flex flex-col justify-between space-y-6">
          
          {/* Textbook Reference Card */}
          <div className="rounded-2xl bg-brand-deep/80 border border-white/10 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-brand-cyan text-xs font-mono font-bold uppercase tracking-wider mb-3">
              <BookOpen className="w-4 h-4" />
              <span>Grounded Textbook Source</span>
            </div>

            <h5 className="text-xs font-bold text-brand-white mb-1">
              {currentTopic.textbookRef.book}
            </h5>
            <span className="text-[11px] text-brand-dim block mb-3 font-mono">
              {currentTopic.textbookRef.chapter} • Page {currentTopic.textbookRef.page}
            </span>

            <blockquote className="text-xs text-brand-muted italic pl-3 border-l-2 border-brand-cyan/40">
              "{currentTopic.textbookRef.quote}"
            </blockquote>
          </div>

          {/* Interactive Spoken Quiz Card */}
          {currentTopic.quizCard && (
            <div className="rounded-2xl bg-brand-surface/90 border border-brand-violet/30 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono text-brand-violet font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Check Your Grasp</span>
                </span>
                <span className="text-[10px] text-brand-dim font-mono">Quiz Card</span>
              </div>

              <p className="text-xs sm:text-sm font-semibold text-brand-white mb-3">
                {currentTopic.quizCard.question}
              </p>

              <div className="space-y-2 mb-4">
                {currentTopic.quizCard.options.map((opt, idx) => {
                  const isSelected = selectedQuizAnswer === idx;
                  const isCorrect = idx === currentTopic.quizCard?.correctIndex;
                  return (
                    <button
                      key={idx}
                      onClick={async () => {
                        setSelectedQuizAnswer(idx);
                        setHasAnsweredQuiz(true);
                        try {
                          await SahaayaApiClient.submitQuiz({
                            questionId: 'q_frac_101',
                            answer: opt,
                            confidence: 'completely_sure',
                            concept: currentTopic.title,
                            subject: currentTopic.subject,
                          });
                        } catch {}
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all ${
                        hasAnsweredQuiz
                          ? isCorrect
                            ? 'bg-emerald-950/40 border-emerald-400 text-emerald-300 font-bold'
                            : isSelected
                            ? 'bg-red-950/40 border-red-400 text-red-300 line-through'
                            : 'bg-brand-deep/40 border-white/5 text-brand-dim'
                          : isSelected
                          ? 'bg-brand-violet/20 border-brand-violet text-brand-white'
                          : 'bg-brand-deep/80 border-white/5 hover:border-white/20 text-brand-muted'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {hasAnsweredQuiz && (
                <div className="p-3 rounded-xl bg-brand-deep border border-brand-cyan/20 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Explanation:</span>
                  </div>
                  <p className="text-brand-muted text-[11px] leading-relaxed">
                    {currentTopic.quizCard.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Progress Indicator Card */}
          <div className="rounded-xl bg-brand-deep/60 border border-white/5 p-4 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-brand-dim uppercase">Active Mastery Streak</span>
              <span className="text-sm font-bold text-brand-white">3 Concepts Mastered</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 flex items-center justify-center font-mono font-bold text-xs text-brand-cyan">
              +15%
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
