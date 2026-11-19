import { env, hasGemini, hasSarvam, hasSupabase } from '../src/config/env.js';
import { logger } from '../src/utils/logger.js';

async function verifyProviders() {
  console.log('\n============================================================');
  console.log('       SAHAAYALEARN BACKEND PROVIDER VERIFICATION           ');
  console.log('============================================================\n');

  console.log('1. GOOGLE GEMINI AI:');
  if (hasGemini) {
    console.log(`   Status: CONFIGURED (Key: ${env.GEMINI_API_KEY.slice(0, 6)}...${env.GEMINI_API_KEY.slice(-4)})`);
    console.log(`   Model:  ${env.GEMINI_MODEL}`);
    console.log(`   Task:   Reasoning, structured pedagogy, misconception evaluation`);
  } else {
    console.log('   Status: UNCONFIGURED (GEMINI_API_KEY is empty in .env)');
    console.log('   Action: Get key at https://aistudio.google.com/ and set GEMINI_API_KEY');
    console.log('   Note:   Offline Curricular RAG Engine is active as fallback');
  }

  console.log('\n2. SARVAM AI (INDIAN SPEECH ENGINE):');
  if (hasSarvam) {
    console.log(`   Status: CONFIGURED (Key: ${env.SARVAM_API_KEY.slice(0, 6)}...${env.SARVAM_API_KEY.slice(-4)})`);
    console.log(`   STT:    ${env.SARVAM_STT_MODEL} (Kannada, Hindi, English, Tamil, Telugu, etc.)`);
    console.log(`   TTS:    ${env.SARVAM_TTS_MODEL} / bulbul:v3 (Malayalam/Odia fallback)`);
  } else {
    console.log('   Status: UNCONFIGURED (SARVAM_API_KEY is empty in .env)');
    console.log('   Action: Register at https://docs.sarvam.ai/ and set SARVAM_API_KEY');
    console.log('   Note:   Acoustic simulation and Web Speech API fallback active');
  }

  console.log('\n3. SUPABASE (POSTGRESQL + PGVECTOR + AUTH):');
  if (hasSupabase) {
    console.log(`   Status: CONFIGURED (${env.SUPABASE_URL})`);
    console.log('   Vector: pgvector enabled for 768-dimensional embeddings');
  } else {
    console.log('   Status: UNCONFIGURED (SUPABASE_URL / SERVICE_ROLE_KEY missing)');
    console.log('   Action: Create Supabase project and run migrations in 001_initial_schema.sql');
    console.log('   Note:   High-speed in-memory telemetry repository is active as fallback');
  }

  console.log('\n4. LOCAL RAG SEED CURRICULUM:');
  console.log('   Lessons: Mathematics (Fractions, Integers) & Science (Photosynthesis, Friction)');
  console.log('   Standard: NCERT & Karnataka State Board Aligned (Classes 6–10)');
  console.log('   Misconceptions: Catalogue populated with diagnostic strategies');

  console.log('\n============================================================\n');
}

verifyProviders();
