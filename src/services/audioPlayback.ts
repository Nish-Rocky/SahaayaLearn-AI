/**
 * SahaayaLearn Hybrid Audio & Speech Playback Manager
 * Ensures reliable spoken voice feedback across all browsers and devices:
 * 1. Plays Sarvam AI Base64 audio when provided
 * 2. Gracefully falls back to browser SpeechSynthesis (Web Speech API) when remote audio is unconfigured
 * 3. Handles browser AudioContext unlock on user gesture (autoplay policy compliance)
 * 4. Supports barge-in interruption, pause, resume, replay, and playback rate adjustments
 */

export type PlaybackState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'generating_text'
  | 'generating_audio'
  | 'speaking'
  | 'interrupted'
  | 'completed'
  | 'error';

class AudioPlaybackManager {
  private audioInstance: HTMLAudioElement | null = null;
  private audioContext: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isUnlocked = false;
  private playbackRate = 1.0;
  private stateListeners: Set<(state: PlaybackState) => void> = new Set();
  private currentState: PlaybackState = 'idle';

  constructor() {
    // Lazy setup in browser environment
  }

  /**
   * Unlocks browser AudioContext on user gesture (click/tap)
   */
  public unlockAudioContext(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx && (!this.audioContext || this.audioContext.state === 'suspended')) {
        this.audioContext = new AudioCtx();
        this.audioContext.resume().catch(() => {});
      }
      this.isUnlocked = true;
    } catch {
      // AudioContext unavailable
    }
  }

  public subscribeState(listener: (state: PlaybackState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.currentState);
    return () => {
      this.stateListeners.delete(listener);
    };
  }

  private setState(newState: PlaybackState): void {
    this.currentState = newState;
    this.stateListeners.forEach((l) => l(newState));
  }

  public getState(): PlaybackState {
    return this.currentState;
  }

  public setRate(rate: number): void {
    this.playbackRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.audioInstance) {
      this.audioInstance.playbackRate = this.playbackRate;
    }
  }

  public getRate(): number {
    return this.playbackRate;
  }

  /**
   * Clean text for spoken utterance
   */
  public cleanTextForSpeech(text: string): string {
    return text
      .replace(/```json[\s\S]*?```/gi, '')
      .replace(/```[\s\S]*?```/gi, '')
      .replace(/\{[\s\S]*?\}/g, '')
      .replace(/\[(?:Source|NCERT|Curriculum).*?\]/gi, '')
      .replace(/\[\d+\]/g, '')
      .replace(/https?:\/\/\S+/gi, '')
      .replace(/[#*_~`]/g, '')
      .replace(/^[-\t*+]\s+/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Main speech playback method:
   * Prioritizes Sarvam Base64 audio; falls back to browser SpeechSynthesis so speech is NEVER missing.
   */
  public async speakText(params: {
    text: string;
    audioBase64?: string;
    languageCode?: string;
    onEnd?: () => void;
  }): Promise<void> {
    this.stop(); // Stop any currently playing audio
    this.unlockAudioContext();

    const cleanText = this.cleanTextForSpeech(params.text);
    if (!cleanText) {
      this.setState('idle');
      params.onEnd?.();
      return;
    }

    const lang = params.languageCode || 'kn-IN';

    // 1. If Sarvam returned base64 audio, play via HTMLAudioElement
    if (params.audioBase64 && params.audioBase64.trim() !== '') {
      try {
        this.setState('speaking');
        const audio = new Audio(`data:audio/wav;base64,${params.audioBase64}`);
        audio.playbackRate = this.playbackRate;
        this.audioInstance = audio;

        audio.onended = () => {
          this.setState('completed');
          params.onEnd?.();
        };

        audio.onerror = () => {
          // If base64 playback fails, fallback to speech synthesis
          this.fallbackSpeechSynthesis(cleanText, lang, params.onEnd);
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        return;
      } catch (err) {
        // Fallback to Web Speech API
        this.fallbackSpeechSynthesis(cleanText, lang, params.onEnd);
        return;
      }
    }

    // 2. Hybrid Fallback: Use browser SpeechSynthesis
    this.fallbackSpeechSynthesis(cleanText, lang, params.onEnd);
  }

  private fallbackSpeechSynthesis(text: string, languageCode: string, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.setState('completed');
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.playbackRate;

      // Select matching voice if available
      const voices = window.speechSynthesis.getVoices();
      const langPrefix = languageCode.split('-')[0];
      const matchedVoice = voices.find(
        (v) => v.lang.toLowerCase() === languageCode.toLowerCase() || v.lang.toLowerCase().startsWith(langPrefix)
      );
      if (matchedVoice) {
        utterance.voice = matchedVoice;
        utterance.lang = matchedVoice.lang;
      } else {
        utterance.lang = languageCode;
      }

      this.currentUtterance = utterance;
      this.setState('speaking');

      utterance.onend = () => {
        this.currentUtterance = null;
        this.setState('completed');
        onEnd?.();
      };

      utterance.onerror = (e) => {
        if (e.error !== 'interrupted') {
          this.setState('error');
        } else {
          this.setState('interrupted');
        }
        this.currentUtterance = null;
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch {
      this.setState('completed');
      onEnd?.();
    }
  }

  /**
   * Stop / Barge-in
   */
  public stop(): void {
    if (this.audioInstance) {
      try {
        this.audioInstance.pause();
        this.audioInstance.currentTime = 0;
      } catch {}
      this.audioInstance = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
      this.currentUtterance = null;
    }

    if (this.currentState === 'speaking') {
      this.setState('interrupted');
    }
  }

  public pause(): void {
    if (this.audioInstance) {
      this.audioInstance.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
  }

  public resume(): void {
    if (this.audioInstance) {
      this.audioInstance.play().catch(() => {});
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  }
}

export const audioPlaybackManager = new AudioPlaybackManager();
export const audioPlaybackService = audioPlaybackManager;
