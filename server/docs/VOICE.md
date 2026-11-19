# SahaayaLearn Voice Architecture & Speech Engine

## Speech Stack
- **Speech-to-Text (STT):** Sarvam AI `saaras:v4`
- **Text-to-Speech (TTS):** Sarvam AI `bulbul:v4-flash` (with Bulbul v3 persona fallback for Malayalam and Odia)
- **Transport:** Fastify WebSockets at `/api/v1/voice/sessions/:sessionId/stream`
- **Speech Recovery:** `SpeechRecoveryService` for non-judgmental acoustic clarification.

---

## Supported Indian Languages & Speaker Personas

| Language Code | Language | STT Model | TTS Model | Verified Speaker ID |
|---|---|---|---|---|
| `kn-IN` | Kannada | `saaras:v4` | `bulbul:v4-flash` | `kannada_female_1` |
| `hi-IN` | Hindi | `saaras:v4` | `bulbul:v4-flash` | `hindi_female_1` |
| `en-IN` | English (Indian) | `saaras:v4` | `bulbul:v4-flash` | `english_female_1` |
| `te-IN` | Telugu | `saaras:v4` | `bulbul:v4-flash` | `telugu_female_1` |
| `ta-IN` | Tamil | `saaras:v4` | `bulbul:v4-flash` | `tamil_female_1` |
| `ml-IN` | Malayalam | `saaras:v4` | `bulbul:v3` | `malayalam_female_1` |
| `mr-IN` | Marathi | `saaras:v4` | `bulbul:v4-flash` | `marathi_female_1` |
| `bn-IN` | Bengali | `saaras:v4` | `bulbul:v4-flash` | `bengali_female_1` |
| `gu-IN` | Gujarati | `saaras:v4` | `bulbul:v4-flash` | `gujarati_female_1` |

---

## Audio Pipeline & Interruption Handling
1. Browser records 16kHz or 22kHz mono PCM audio.
2. Binary frames stream via WebSocket.
3. User interruption triggers immediate cancellation of pending TTS generation and purges the active audio buffer.
4. Spoken text is cleaned by removing markdown tags, JSON strings, and bracketed textbook citations before being synthesized.
