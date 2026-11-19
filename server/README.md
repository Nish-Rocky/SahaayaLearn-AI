# SahaayaLearn Backend Server

Production-structured, multilingual AI-powered educational backend for SahaayaLearn.

---

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and fill in your API credentials:
```bash
cp .env.example .env
```
Key variables:
- `GEMINI_API_KEY`: Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)
- `SARVAM_API_KEY`: Sarvam AI API key from [Sarvam AI](https://docs.sarvam.ai/)
- `SUPABASE_URL` & `SUPABASE_SERVICE_ROLE_KEY`: Supabase credentials for PostgreSQL + pgvector

*Note: The server includes an automatic high-fidelity curricular fallback engine, allowing the full REST and WebSocket suite to run even before API keys are populated.*

### 3. Run Provider Verification
```bash
npm run verify:providers
```

### 4. Run Tests
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:8000`.

---

## Key Modules
- **`src/orchestration/ai-orchestrator.ts`:** Central coordinator for user input, language routing, RAG retrieval, Gemini reasoning, and speech synthesis.
- **`src/services/gemini.service.ts`:** Gemini 3.8 Flash reasoning with strict Zod structured outputs.
- **`src/services/sarvam-stt.service.ts`:** Real-time Indian speech recognition (`saaras:v4`).
- **`src/services/sarvam-tts.service.ts`:** Natural regional speech synthesis (`bulbul:v4-flash`).
- **`src/modules/misconceptions/misconception-engine.ts`:** Sahaaya X-Ray diagnostic engine.
- **`src/modules/tutoring/language-ladder.service.ts`:** 3-step multilingual academic ladder.
- **`src/websocket/voice-gateway.ts`:** Real-time audio streaming and interruption handling.
