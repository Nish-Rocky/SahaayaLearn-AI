# SahaayaLearn Database Architecture

## Technology Stack
- PostgreSQL 15+ on Supabase
- `pgvector` extension for 768-dimensional embeddings (`vector(768)`)
- HNSW Indexing (`hnsw (embedding vector_cosine_ops)`)
- Row Level Security (RLS) on all user-owned tables

---

## Entity Relationship Overview

```
profiles (Base Identity)
  ├── learner_profiles (Grade, Teaching Language, Academic Language, PIN)
  ├── guardian_links (Parent-Child relationships)
  ├── consent_records (DPDP Act 2023 Consent Logs)
  ├── learning_sessions (Voice/Text sessions)
  │     └── conversation_messages (Pedagogical dialogue log)
  ├── student_misconceptions (Sahaaya X-Ray diagnostic history)
  ├── concept_mastery (Concept scores 0.0 to 1.0)
  ├── quiz_attempts (Spoken/written quiz submissions)
  ├── learning_missions (Life-to-lesson activities)
  └── family_summaries (Regional spoken weekly updates)

source_registry (Curriculum Attribution & License)
  └── learning_content (Approved curriculum documents)
        └── content_chunks (Text segments + 768-dim vector embeddings)

misconception_library (Standardized catalogue of reasoning gaps)
```

---

## Row Level Security (RLS) Policies
- All student data is isolated to their authenticated session (`auth_user_id = auth.uid()`).
- Guardians can only view authorized progress records after explicit linkage and consent.
- Curricular textbooks and misconceptions library are publicly readable for educational grounding.
