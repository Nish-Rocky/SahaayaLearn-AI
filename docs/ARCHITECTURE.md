# SAHAAYALEARN — PLATFORM ARCHITECTURE & SPECIFICATION

## 1. Executive Summary & Brand Positioning

- **Product:** SahaayaLearn
- **Tagline:** "Learning that listens. Teaching that understands."
- **Secondary Tagline:** "Your personal AI-powered academic companion."
- **Core Vision:** "Everything a student needs to learn, organise, practise, improve and succeed — in one intelligent platform."
- **Initial Target Users:** Students in Classes 6–10 across India, first-generation learners, and multilingual students preparing for state board and national examinations.

---

## 2. Shared Multi-Portal Infrastructure

SahaayaLearn provides four distinct authenticated environments over a unified educational data layer:

```
                               ┌────────────────────────────────┐
                               │  SAHAAYALEARN API & GATEWAY    │
                               │   (Fastify + WebSocket + AI)   │
                               └──────────────┬─────────────────┘
                                              │
         ┌───────────────────┬────────────────┴──────────────────┬───────────────────┐
         │                   │                                   │                   │
┌────────▼────────┐ ┌────────▼────────┐                 ┌────────▼────────┐ ┌────────▼────────┐
│ PORTAL A:       │ │ PORTAL B:       │                 │ PORTAL C:       │ │ PORTAL D:       │
│ STUDENT         │ │ PARENT/GUARDIAN │                 │ TEACHER         │ │ ADMIN           │
│ /student/*      │ │ /guardian/*     │                 │ /teacher/*      │ │ /admin/*        │
│                 │ │                 │                 │                 │                   │
│ • Dashboard     │ │ • Linked Child  │                 │ • My Classes    │ │ • User Accounts │
│ • AI Tutor      │ │ • Progress      │                 │ • Assignments   │ │ • Curriculum    │
│ • Voice Studio  │ │ • Family Voice  │                 │ • Misconception │ │ • Content Lib   │
│ • Timetable     │ │ • DPDP Consent  │                 │   Analytics     │ │ • Provider      │
│ • Flashcards    │ │ • Recovery      │                 │ • Reviews       │ │   Health        │
│ • Mistake DNA   │ └─────────────────┘                 └─────────────────┘ └─────────────────┘
└─────────────────┘
```

---

## 3. The 5-Stage Adaptive Pedagogical Cycle

```
 UNDERSTAND ──► EXPLAIN ──► PRACTISE ──► EVALUATE ──► IMPROVE
   (Voice)      (Visual &    (Spoken      (Sahaaya     (Targeted
                 Analogy)     Quizzes)     X-Ray)      Remediation)
```

1. **UNDERSTAND:** Student speaks in home language (Kannada, Hindi, etc.). Sarvam `saaras:v4` transcribes with acoustic speech recovery.
2. **EXPLAIN:** Grounded RAG retrieves verified curriculum context (NCERT & State Board). Gemini generates structured reasoning with relatable Indian analogies (ragi roti, gully cricket, kirana store).
3. **PRACTISE:** Interactive oral quizzes and mock examinations test understanding without shaming.
4. **EVALUATE:** Sahaaya X-Ray diagnoses the exact misconception behind incorrect answers (e.g. adding denominators directly in fractions).
5. **IMPROVE:** Spaced repetition flashcards (SM-2 algorithm) and Concept Galaxy update the student's Academic Twin.

---

## 4. Security & DPDP Act 2023 Compliance

- **Zero Voiceprint Retention:** Audio buffers are processed ephemerally and discarded.
- **Guardian Consent Gateway:** Child accounts require verified parental consent before personal data is tracked.
- **Student Privacy:** Conversations with the AI tutor are shielded from classmates and advertisers. Parents receive synthesized progress reports via the Family Voice Bridge without exposing raw transcripts.
- **Account Isolation:** Row Level Security (RLS) and cryptographic learner IDs (`SL-8K4P92`) prevent cross-profile data leakage.
