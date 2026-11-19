# SAHAAYALEARN — REST API & WEBSOCKET SPECIFICATION

This document outlines the API endpoints, schemas, authentication contracts, and WebSocket protocols powering the SahaayaLearn academic ecosystem.

Base URL: `http://localhost:8000/api/v1`

---

## 1. Authentication & Identity

All student requests should include either the `x-student-id` header or Bearer token authorization.

### 1.1 Create Guest Student Session
- **Endpoint:** `POST /auth/guest-session`
- **Request Body:**
```json
{
  "board": "Karnataka State Board",
  "grade": 7,
  "language": "kn"
}
```
- **Response (200 OK):**
```json
{
  "token": "eyJhbGciOi...",
  "studentId": "SL-8K4P92",
  "name": "Guest Student",
  "expiresAt": "2026-03-20T12:00:00Z"
}
```

### 1.2 Get User Profile
- **Endpoint:** `GET /profile`
- **Headers:** `x-student-id: SL-8K4P92`
- **Response (200 OK):**
```json
{
  "id": "SL-8K4P92",
  "name": "Ananya Sharma",
  "grade": "Class 7",
  "board": "Karnataka State Board",
  "school": "Government High School, Malleshwaram",
  "primaryLanguage": "kn-IN",
  "learningStyle": "interactive-visual"
}
```

---

## 2. AI Tutoring & Reasoning (Groq GPT-OSS Primary Engine)

### 2.1 Ask AI Tutor
- **Endpoint:** `POST /tutor/ask` (also aliased at `POST /ai/tutor` and `POST /ai/tutor/explain`)
- **Headers:** `Content-Type: application/json`, `x-student-id: <id>`
- **Request Body:**
```json
{
  "question": "Explain Newton's laws of motion with simple examples",
  "subject": "Science",
  "grade": "Class 8",
  "teachingLanguage": "kn-IN",
  "academicLanguage": "en-IN",
  "mode": "conceptual",
  "synthesizeVoice": true
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "ses-99182",
    "answer": "ನ್ಯೂಟನ್ನನ ಚಲನೆಯ ಮೊದಲ ನಿಯಮ (Law of Inertia): ಯಾವುದೇ ಬಾಹ್ಯ ಬಲ ಪ್ರಯೋಗವಾಗದ ಹೊರತು...",
    "shortExplanation": "Forces cause acceleration; inertia resists velocity change.",
    "examples": ["When a bus suddenly brakes, you lean forward due to inertia (ಜಡತ್ವ)."],
    "keyTerms": ["Inertia (ಜಡತ್ವ)", "Force (ಬಲ)", "Acceleration (ವೇಗೋತ್ಕರ್ಷ)"],
    "steps": ["1. Net force = 0 means velocity is constant.", "2. External force causes acceleration (F=ma)."],
    "difficulty": "intermediate",
    "practiceQuestion": {
      "question": "Which property makes heavy bodies harder to stop?",
      "options": ["Inertia / Mass", "Velocity", "Temperature", "Color"],
      "correctAnswer": "Inertia / Mass",
      "explanation": "Mass is the measure of inertia."
    },
    "isTextbookGrounded": true,
    "providerUsed": "groq",
    "modelUsed": "openai/gpt-oss-120b",
    "audio": {
      "audioBase64": "<base64-wav-data>",
      "format": "wav",
      "durationEstimateSeconds": 14
    }
  }
}
```

### 2.2 Streaming AI Chat (Server-Sent Events)
- **Endpoint:** `POST /ai/chat/stream`
- **Headers:** `Accept: text/event-stream`
- **Request Body:**
```json
{
  "question": "How do plants synthesize glucose during photosynthesis?",
  "teachingLanguage": "kn-IN",
  "grade": "Class 7",
  "subject": "Science"
}
```
- **SSE Stream Output:**
```
data: {"delta": "ದ್ಯುತಿಸಂಶ್ಲೇಷಣೆ "}
data: {"delta": "ಎಂದರೆ "}
data: {"delta": "ಹಸಿರು ಸಸ್ಯಗಳು "}
data: [DONE]
```

---

## 3. Realtime Voice Pipeline (Sarvam Saaras STT & Bulbul TTS)

### 3.1 Initialize Voice Session
- **Endpoint:** `POST /voice/sessions`
- **Request Body:**
```json
{
  "inputLanguage": "kn-IN",
  "outputLanguage": "kn-IN"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "sessionId": "vs-77192",
    "wsStreamUrl": "/api/v1/voice/sessions/vs-77192/stream",
    "inputLanguage": "kn-IN",
    "outputLanguage": "kn-IN",
    "expiresAt": "2026-03-20T12:00:00Z"
  }
}
```

### 3.2 WebSocket Streaming Audio Protocol
- **URL:** `ws://localhost:8000/api/v1/voice/sessions/:sessionId/stream`
- **Events Inbound (Client -> Server):**
  - Binary frames: 16kHz 16-bit mono linear16 PCM audio frames.
  - JSON control frame: `{"event": "audio.end"}` (Student finished speaking).
  - JSON control frame: `{"event": "user.interrupted"}` (Barge-in: student started speaking).
  - JSON control frame: `{"event": "voice.stop"}` (Student pressed stop speaking).
- **Events Outbound (Server -> Client):**
  - `session.ready`: Audio session initialized.
  - `transcript.final`: Speech recognition transcript with confidence score.
  - `assistant.thinking`: LLM reasoning initiated.
  - `assistant.text.final`: Full generated pedagogical explanation.
  - `tts.audio.chunk`: Sentence-level Base64 WAV chunk for immediate playback.
  - `assistant.interrupted`: Acknowledgement of barge-in interruption.
  - `assistant.completed`: Turn cycle completed.

### 3.3 Text-to-Speech Direct Synthesis
- **Endpoint:** `POST /voice/synthesize`
- **Request Body:**
```json
{
  "text": "ನಮಸ್ಕಾರ ಅನನ್ಯಾ, ಗಣಿತದ ಪ್ರಶ್ನೆಗಳನ್ನು ಅಭ್ಯಾಸ ಮಾಡೋಣ.",
  "languageCode": "kn-IN",
  "speechRate": 1.0
}
```

### 3.4 Speech-to-Text Direct Transcription
- **Endpoint:** `POST /voice/transcribe`
- **Request Body:**
```json
{
  "audioBase64": "<base64-wav-data>",
  "languageCode": "kn-IN"
}
```

---

## 4. Academic Tool Registry

### 4.1 List Available Tools
- **Endpoint:** `GET /ai/tools`

### 4.2 Execute Academic Tool
- **Endpoint:** `POST /ai/tools/execute`
- **Request Body:**
```json
{
  "toolName": "create_study_task",
  "arguments": {
    "title": "Practice Fraction Multiplication",
    "subject": "Mathematics",
    "estimatedMinutes": 30
  }
}
```

---

## 5. Provider Health & Diagnostics Dashboard

- **Endpoint:** `GET /ai/providers/health`
- **Response (200 OK):**
```json
{
  "success": true,
  "timestamp": "2026-11-19T04:10:00.000Z",
  "providers": {
    "groq": {
      "name": "Groq (OpenAI GPT-OSS Models)",
      "configured": true,
      "connected": true,
      "status": "connected",
      "latencyMs": 142,
      "model": "openai/gpt-oss-120b",
      "fastModel": "openai/gpt-oss-20b"
    },
    "sarvamStt": {
      "name": "Sarvam AI Saaras v4 STT",
      "configured": true,
      "status": "connected",
      "model": "saaras:v4"
    },
    "sarvamTts": {
      "name": "Sarvam AI Bulbul v4-flash TTS",
      "configured": true,
      "status": "connected",
      "model": "bulbul:v4-flash"
    },
    "gemini": {
      "name": "Google Gemini (Fallback AI)",
      "configured": false,
      "status": "not_configured"
    }
  }
}
```
