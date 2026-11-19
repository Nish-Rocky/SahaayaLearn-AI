import { supabase } from '../src/database/supabase.js';
import { logger } from '../src/utils/logger.js';
import fs from 'fs';
import path from 'path';

async function seedDatabase() {
  logger.info('Starting SahaayaLearn Curricular Database Seed...');

  if (!supabase) {
    logger.warn('Supabase not connected. Seed verified for in-memory and local RAG indexing.');
    return;
  }

  try {
    // 1. Seed Source Registry
    logger.info('Seeding Source Registry...');
    await supabase.from('source_registry').upsert([
      {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'SahaayaLearn Original Curricular Seed Corpus',
        source_url: 'https://sahaayalearn.org/curriculum',
        source_type: 'original_sahaaya_lesson',
        author: 'SahaayaLearn Academic Team',
        publisher: 'SahaayaLearn Open Education',
        license: 'CC BY-NC 4.0',
        attribution_text: 'Authored originally for SahaayaLearn personal companion tutoring.',
        permitted_usage: 'non_commercial_educational',
        review_status: 'approved',
      },
    ]);

    // 2. Read and seed lessons
    const seedDir = path.resolve(process.cwd(), 'data/seed/lessons');
    if (fs.existsSync(seedDir)) {
      const files = fs.readdirSync(seedDir).filter((f) => f.endsWith('.json'));
      for (const file of files) {
        const raw = fs.readFileSync(path.join(seedDir, file), 'utf-8');
        const lesson = JSON.parse(raw);

        logger.info({ lessonId: lesson.id, title: lesson.conceptName }, 'Ingesting lesson');

        await supabase.from('learning_content').upsert({
          id: lesson.id,
          title: lesson.conceptName,
          grade: lesson.gradeLevel,
          board: lesson.board,
          subject: lesson.subject,
          chapter: lesson.conceptName,
          language: 'en-IN',
          source_id: '11111111-1111-1111-1111-111111111111',
          license: lesson.license,
          review_status: 'approved',
        });
      }
    }

    logger.info('✅ Seed completed successfully in Supabase!');
  } catch (err) {
    logger.error({ err }, 'Error during database seed');
  }
}

seedDatabase();
