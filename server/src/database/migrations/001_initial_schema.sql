-- ==============================================================================
-- SAHAAYALEARN PRODUCTION DATABASE SCHEMA (001_initial_schema.sql)
-- Supabase PostgreSQL + pgvector + Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 2. Profiles Table (Base identity linked to Supabase auth)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'guardian', 'educator', 'admin')),
  preferred_language TEXT NOT NULL DEFAULT 'kn-IN',
  grade TEXT DEFAULT 'Class 7',
  school_board TEXT DEFAULT 'Karnataka State Board',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Student Learner Profiles (Pedagogical preferences & accessibility)
CREATE TABLE IF NOT EXISTS learner_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  learning_level TEXT NOT NULL DEFAULT 'intermediate' CHECK (learning_level IN ('foundation', 'intermediate', 'advanced')),
  preferred_teaching_language TEXT NOT NULL DEFAULT 'kn-IN',
  academic_response_language TEXT NOT NULL DEFAULT 'en-IN',
  preferred_explanation_style TEXT NOT NULL DEFAULT 'analogies' CHECK (preferred_explanation_style IN ('analogies', 'visual_step_by_step', 'concise')),
  selected_subjects TEXT[] NOT NULL DEFAULT ARRAY['Mathematics', 'Science'],
  accessibility_preferences JSONB NOT NULL DEFAULT '{"reducedMotion": false, "screenReaderOptimized": false, "fontSize": "medium"}'::jsonb,
  pin_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(profile_id)
);

-- 4. Guardian Links Table (Parent-student relationship)
CREATE TABLE IF NOT EXISTS guardian_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  relationship TEXT NOT NULL DEFAULT 'parent' CHECK (relationship IN ('parent', 'guardian', 'teacher')),
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_profile_id, guardian_profile_id)
);

-- 5. Consent Records Table (Digital Personal Data Protection Act compliance)
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('audio_processing', 'progress_tracking', 'family_summaries', 'offline_storage')),
  consent_version TEXT NOT NULL DEFAULT '1.0',
  consent_status TEXT NOT NULL DEFAULT 'granted' CHECK (consent_status IN ('granted', 'withdrawn', 'expired')),
  verification_method TEXT NOT NULL DEFAULT 'app_confirmation',
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  withdrawn_at TIMESTAMPTZ
);

-- 6. Learning Sessions Table
CREATE TABLE IF NOT EXISTS learning_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_type TEXT NOT NULL DEFAULT 'voice_tutor' CHECK (session_type IN ('voice_tutor', 'text_tutor', 'quiz', 'misconception_correction', 'revision')),
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  teaching_language TEXT NOT NULL DEFAULT 'kn-IN',
  academic_language TEXT NOT NULL DEFAULT 'en-IN',
  session_summary TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- 7. Conversation Messages Table (Pedagogical dialogue log)
CREATE TABLE IF NOT EXISTS conversation_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES learning_sessions(id) ON DELETE CASCADE,
  speaker TEXT NOT NULL CHECK (speaker IN ('student', 'tutor', 'system')),
  message_text TEXT NOT NULL,
  language_code TEXT NOT NULL DEFAULT 'kn-IN',
  message_type TEXT NOT NULL DEFAULT 'text' CHECK (message_type IN ('text', 'speech_transcription', 'spoken_synthesis', 'diagnostic_prompt')),
  response_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Source & Dataset Registry Table (Attribution & copyright compliance)
CREATE TABLE IF NOT EXISTS source_registry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  source_url TEXT,
  source_type TEXT NOT NULL CHECK (source_type IN ('official_curriculum', 'open_educational_resource', 'original_sahaaya_lesson')),
  author TEXT NOT NULL,
  publisher TEXT NOT NULL,
  license TEXT NOT NULL,
  attribution_text TEXT NOT NULL,
  permitted_usage TEXT NOT NULL DEFAULT 'non_commercial_educational',
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  review_status TEXT NOT NULL DEFAULT 'approved' CHECK (review_status IN ('pending', 'approved', 'restricted', 'rejected'))
);

-- 9. Learning Content Table (Approved curriculum units)
CREATE TABLE IF NOT EXISTS learning_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  grade TEXT NOT NULL,
  board TEXT NOT NULL DEFAULT 'NCERT',
  subject TEXT NOT NULL,
  chapter TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en-IN',
  source_id UUID REFERENCES source_registry(id) ON DELETE SET NULL,
  license TEXT NOT NULL DEFAULT 'SahaayaLearn Original License / OER',
  review_status TEXT NOT NULL DEFAULT 'approved' CHECK (review_status IN ('pending', 'approved', 'archived')),
  storage_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Content Chunks Table (RAG text segments + vector embeddings)
CREATE TABLE IF NOT EXISTS content_chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES learning_content(id) ON DELETE CASCADE,
  chunk_index INT NOT NULL,
  content_text TEXT NOT NULL,
  embedding vector(768),
  page_number INT,
  language TEXT NOT NULL DEFAULT 'en-IN',
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(content_id, chunk_index)
);

-- Vector Index using HNSW for fast nearest neighbor semantic search
CREATE INDEX IF NOT EXISTS content_chunks_embedding_hnsw_idx 
ON content_chunks USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Full-text search index for hybrid retrieval
CREATE INDEX IF NOT EXISTS content_chunks_fts_idx 
ON content_chunks USING gin (to_tsvector('english', content_text));

-- 11. Misconception Library Table (Catalogue of root reasoning gaps)
CREATE TABLE IF NOT EXISTS misconception_library (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  concept TEXT NOT NULL,
  misconception_code TEXT NOT NULL UNIQUE,
  misconception_description TEXT NOT NULL,
  diagnostic_question TEXT NOT NULL,
  correction_strategy TEXT NOT NULL,
  verification_question TEXT NOT NULL,
  review_status TEXT NOT NULL DEFAULT 'approved' CHECK (review_status IN ('draft', 'approved', 'deprecated')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Student Misconceptions History Table (Sahaaya X-Ray telemetry)
CREATE TABLE IF NOT EXISTS student_misconceptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES learning_sessions(id) ON DELETE SET NULL,
  concept TEXT NOT NULL,
  misconception_code TEXT NOT NULL,
  evidence_summary TEXT NOT NULL,
  confidence_level TEXT NOT NULL DEFAULT 'hypothesis' CHECK (confidence_level IN ('hypothesis', 'confirmed', 'resolved')),
  verification_status TEXT NOT NULL DEFAULT 'in_review' CHECK (verification_status IN ('in_review', 'verified', 'dismissed')),
  correction_status TEXT NOT NULL DEFAULT 'pending' CHECK (correction_status IN ('pending', 'in_progress', 'corrected')),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 13. Quiz Questions Table
CREATE TABLE IF NOT EXISTS quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject TEXT NOT NULL,
  grade TEXT NOT NULL,
  topic TEXT NOT NULL,
  question_text TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'kn-IN',
  question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'numeric_input', 'free_response', 'spoken_explanation')),
  options JSONB DEFAULT '[]'::jsonb,
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  source_reference TEXT,
  review_status TEXT NOT NULL DEFAULT 'approved' CHECK (review_status IN ('draft', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Quiz Attempts Table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  hints_used INT NOT NULL DEFAULT 0,
  confidence_self_report TEXT CHECK (confidence_self_report IN ('completely_sure', 'fairly_sure', 'not_sure', 'guessing')),
  evaluation_feedback TEXT NOT NULL,
  concept_mastery_after NUMERIC(4, 2),
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. Concept Mastery Table (Detailed learner knowledge graph)
CREATE TABLE IF NOT EXISTS concept_mastery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  concept TEXT NOT NULL,
  mastery_score NUMERIC(4, 2) NOT NULL DEFAULT 0.0 CHECK (mastery_score >= 0.0 AND mastery_score <= 1.0),
  attempts_count INT NOT NULL DEFAULT 0,
  last_practised_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_assessment_result BOOLEAN,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_profile_id, subject, concept)
);

-- 16. Learning Plans Table
CREATE TABLE IF NOT EXISTS learning_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_subject TEXT NOT NULL,
  target_grade TEXT NOT NULL,
  learning_goal TEXT NOT NULL,
  recommended_concepts JSONB NOT NULL DEFAULT '[]'::jsonb,
  plan_status TEXT NOT NULL DEFAULT 'active' CHECK (plan_status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 17. Learning Missions Table (Life-to-Lesson real-world challenges)
CREATE TABLE IF NOT EXISTS learning_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  context_type TEXT NOT NULL DEFAULT 'everyday_life',
  mission_description TEXT NOT NULL,
  generated_question TEXT NOT NULL,
  result TEXT,
  completion_status TEXT NOT NULL DEFAULT 'pending' CHECK (completion_status IN ('pending', 'completed', 'skipped')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 18. Family Summaries Table (Family Voice Bridge spoken updates)
CREATE TABLE IF NOT EXISTS family_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  guardian_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  summary_language TEXT NOT NULL DEFAULT 'kn-IN',
  audio_url TEXT,
  delivery_status TEXT NOT NULL DEFAULT 'generated' CHECK (delivery_status IN ('generated', 'sent', 'listened')),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 19. Voice Sessions Table (Short-lived authenticated speech tokens)
CREATE TABLE IF NOT EXISTS voice_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL,
  input_language TEXT NOT NULL DEFAULT 'kn-IN',
  output_language TEXT NOT NULL DEFAULT 'kn-IN',
  provider TEXT NOT NULL DEFAULT 'sarvam',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired', 'error')),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardian_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_misconceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_mastery ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_summaries ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own record
CREATE POLICY "Users can access their own profile"
ON profiles FOR ALL
USING (auth_user_id = auth.uid());

-- Learner Profiles: Owned by the student
CREATE POLICY "Students manage their own learner profile"
ON learner_profiles FOR ALL
USING (profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

-- Learning Sessions & Messages: Isolated to the student
CREATE POLICY "Students view their own learning sessions"
ON learning_sessions FOR ALL
USING (student_profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Students view their own messages"
ON conversation_messages FOR ALL
USING (session_id IN (SELECT s.id FROM learning_sessions s JOIN profiles p ON s.student_profile_id = p.id WHERE p.auth_user_id = auth.uid()));

-- Concept Mastery: Isolated to student and verified guardians
CREATE POLICY "Students and linked guardians view concept mastery"
ON concept_mastery FOR SELECT
USING (
  student_profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid()) OR
  student_profile_id IN (
    SELECT student_profile_id FROM guardian_links gl 
    JOIN profiles p ON gl.guardian_profile_id = p.id 
    WHERE p.auth_user_id = auth.uid() AND gl.verification_status = 'verified'
  )
);

-- Public curriculum tables readable by authenticated & anon users
ALTER TABLE learning_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Curriculum readable by all" ON learning_content FOR SELECT USING (true);

ALTER TABLE content_chunks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Curriculum chunks readable by all" ON content_chunks FOR SELECT USING (true);

ALTER TABLE misconception_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Misconceptions library readable by all" ON misconception_library FOR SELECT USING (true);

-- ==============================================================================
-- HYBRID VECTOR SEARCH SQL FUNCTION
-- ==============================================================================

CREATE OR REPLACE FUNCTION match_content_chunks(
  query_embedding vector(768),
  match_threshold float DEFAULT 0.65,
  match_count int DEFAULT 4,
  filter_grade text DEFAULT NULL,
  filter_subject text DEFAULT NULL,
  filter_language text DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  content_id UUID,
  chunk_index INT,
  content_text TEXT,
  similarity float,
  page_number INT,
  language TEXT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    cc.id,
    cc.content_id,
    cc.chunk_index,
    cc.content_text,
    1 - (cc.embedding <=> query_embedding) AS similarity,
    cc.page_number,
    cc.language,
    cc.metadata
  FROM content_chunks cc
  JOIN learning_content lc ON cc.content_id = lc.id
  WHERE (1 - (cc.embedding <=> query_embedding)) > match_threshold
    AND (filter_grade IS NULL OR lc.grade = filter_grade)
    AND (filter_subject IS NULL OR lc.subject = filter_subject)
    AND (filter_language IS NULL OR cc.language = filter_language)
  ORDER BY cc.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
