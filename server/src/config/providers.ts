export interface LanguageConfig {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  sttSupported: boolean;
  ttsSupported: boolean;
  ttsModel: string;
  speakerId: string;
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  'kn-IN': {
    code: 'kn-IN',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Knda',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'kannada_female_1',
  },
  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिंदी',
    script: 'Deva',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'hindi_female_1',
  },
  'en-IN': {
    code: 'en-IN',
    name: 'English (Indian)',
    nativeName: 'English (India)',
    script: 'Latn',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'english_female_1',
  },
  'te-IN': {
    code: 'te-IN',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telu',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'telugu_female_1',
  },
  'ta-IN': {
    code: 'ta-IN',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Taml',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'tamil_female_1',
  },
  'ml-IN': {
    code: 'ml-IN',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Mlym',
    sttSupported: true,
    ttsSupported: true,
    // Bulbul v3 compatibility fallback for Malayalam
    ttsModel: 'bulbul:v3',
    speakerId: 'malayalam_female_1',
  },
  'mr-IN': {
    code: 'mr-IN',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Deva',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'marathi_female_1',
  },
  'bn-IN': {
    code: 'bn-IN',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Beng',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'bengali_female_1',
  },
  'gu-IN': {
    code: 'gu-IN',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujr',
    sttSupported: true,
    ttsSupported: true,
    ttsModel: 'bulbul:v4-flash',
    speakerId: 'gujarati_female_1',
  },
};

export function getLanguageConfig(code: string): LanguageConfig {
  const normalized = code.includes('-') ? code : `${code}-IN`;
  return SUPPORTED_LANGUAGES[normalized] || SUPPORTED_LANGUAGES['en-IN'];
}
