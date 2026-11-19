# SahaayaLearn Backend API Documentation (v1)

## Base URL
- Local: `http://localhost:8000/api/v1`
- WebSocket: `ws://localhost:8000/api/v1/voice/sessions/:sessionId/stream`

---

## 1. Authentication & Profiles

### Guest Session Initialization
`POST /api/v1/auth/guest-session`
- Request: `{ "displayName": "Ananya", "grade": "Class 7", "language": "kn-IN" }`
- Response: User profile and learner profile objects with guest status.

### Get Active Profile
`GET /api/v1/profile`
- Headers: `x-student-id: <UUID>`
- Response: User display profile and pedagogical preferences.

### Update Preferences
`PATCH /api/v1/profile/preferences`
- Request: `{ "preferred_teaching_language": "kn-IN", "academic_response_language": "en-IN" }`

---

## 2. Tutoring & Pedagogical Intelligence

### Ask Tutor
`POST /api/v1/tutor/ask`
- Request:
  ```json
  {
    "question": "Can you explain fractions in Kannada?",
    "subject": "Mathematics",
    "grade": "Class 7",
    "teachingLanguage": "kn-IN",
    "academicLanguage": "en-IN",
    "sessionId": "optional-session-id",
    "synthesizeVoice": false
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": {
      "answer": "...",
      "shortExplanation": "...",
      "examples": ["..."],
      "keyTerms": ["..."],
      "isTextbookGrounded": true,
      "citations": [...],
      "practiceQuestion": { ... }
    }
  }
  ```

### Language Ladder
`POST /api/v1/tutor/language-ladder`
- Request: `{ "concept": "Fractions", "teachingLanguage": "kn-IN", "academicLanguage": "en-IN", "studentResponse": "..." }`
- Response: 3-step progression (Home language -> Conceptual bridge -> Academic expression) + evaluation without grammar penalties.

### Life-to-Lesson Real-World Mission
`POST /api/v1/tutor/real-world-example`
- Request: `{ "topic": "Fractions", "grade": "Class 7" }`
- Response: Concrete Indian daily-life scenario challenge with progressive hints.

---

## 3. Voice Assistant & Streaming

### Create Voice Session
`POST /api/v1/voice/sessions`
- Request: `{ "inputLanguage": "kn-IN", "outputLanguage": "kn-IN" }`
- Response: `{ "sessionId": "sess_...", "wsStreamUrl": "/api/v1/voice/sessions/.../stream" }`

### Real-Time Voice WebSocket Stream
`ws://localhost:8000/api/v1/voice/sessions/:sessionId/stream`
- Protocol Events:
  - `session.ready`
  - `transcript.partial`
  - `transcript.final`
  - `assistant.thinking`
  - `assistant.text.delta`
  - `assistant.audio.start`
  - `assistant.audio.chunk`
  - `assistant.audio.end`
  - `user.interrupted`
  - `assistant.turn.complete`

---

## 4. Quizzes & Misconceptions

### Submit Quiz Answer
`POST /api/v1/quizzes/:quizId/submit`
- Request:
  ```json
  {
    "questionId": "q_frac_101",
    "answer": "2/4",
    "confidence": "completely_sure",
    "hintsUsed": 0
  }
  ```
- Evaluates mathematical equivalence (e.g. 2/4 === 1/2) using Decimal.js and triggers Confidence Shield calibration.

---

## 5. Learning Telemetry

### Get Progress Telemetry
`GET /api/v1/progress`
- Returns concept-level mastery scores (0.0 to 1.0), streak days, misconception resolution counts, and spoken learning hours.
