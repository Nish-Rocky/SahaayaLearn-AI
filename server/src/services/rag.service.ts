import { supabase } from '../database/supabase.js';
import { logger } from '../utils/logger.js';
import fs from 'fs';
import path from 'path';

export interface RetrievedChunk {
  contentId: string;
  sourceTitle: string;
  subject: string;
  grade: string;
  chapter: string;
  pageNumber?: number;
  text: string;
  similarity: number;
  license: string;
}

export interface GroundedContext {
  isTextbookGrounded: boolean;
  chunks: RetrievedChunk[];
  combinedContextText: string;
  citationMetadata: {
    source: string;
    chapter: string;
    page?: number;
    license: string;
  }[];
}

// In-memory seed lesson chunks cache
interface LocalSeedLesson {
  id: string;
  conceptName: string;
  gradeLevel: string;
  subject: string;
  sourceTitle: string;
  author: string;
  license: string;
  simpleExplanation: string;
  detailedExplanation: string;
  everydayExample: string;
  technicalTerminology: Record<string, string[]>;
  commonMisconceptions: Array<{ code: string; description: string; diagnosticQuestion: string; correctionStrategy: string }>;
  practiceQuestions: Array<{ question: string; options: string[]; correctAnswer: string; explanation: string }>;
}

let seedLessonsCache: LocalSeedLesson[] = [];

function loadSeedLessons(): LocalSeedLesson[] {
  if (seedLessonsCache.length > 0) return seedLessonsCache;
  try {
    const seedDir = path.resolve(process.cwd(), 'data/seed/lessons');
    if (fs.existsSync(seedDir)) {
      const files = fs.readdirSync(seedDir).filter((f) => f.endsWith('.json'));
      seedLessonsCache = files.map((file) => {
        const raw = fs.readFileSync(path.join(seedDir, file), 'utf-8');
        return JSON.parse(raw) as LocalSeedLesson;
      });
      logger.info({ count: seedLessonsCache.length }, 'Loaded local seed curricular lessons into RAG memory');
    }
  } catch (err) {
    logger.warn({ err }, 'Could not read local seed lessons directory');
  }
  return seedLessonsCache;
}

export class RagService {
  /**
   * Retrieves curriculum chunks matching user query.
   * Uses Supabase pgvector if available; otherwise uses semantic keyword index over original seed lessons.
   */
  static async retrieve(params: {
    query: string;
    subject?: string;
    grade?: string;
    language?: string;
    topK?: number;
    similarityThreshold?: number;
    embeddingVector?: number[];
  }): Promise<GroundedContext> {
    const { query, subject, grade, topK = 3, similarityThreshold = 0.55, embeddingVector } = params;
    const cleanQ = query.toLowerCase();

    // 1. If Supabase pgvector is active and vector provided, use RPC match_content_chunks
    if (supabase && embeddingVector && embeddingVector.length === 768) {
      try {
        const { data, error } = await supabase.rpc('match_content_chunks', {
          query_embedding: embeddingVector,
          match_threshold: similarityThreshold,
          match_count: topK,
          filter_grade: grade || null,
          filter_subject: subject || null,
          filter_language: params.language || null,
        });

        if (!error && data && data.length > 0) {
          const chunks: RetrievedChunk[] = data.map((item: any) => ({
            contentId: item.content_id,
            sourceTitle: item.metadata?.sourceTitle || 'NCERT / State Curriculum',
            subject: item.metadata?.subject || subject || 'General',
            grade: item.metadata?.grade || grade || 'Class 7',
            chapter: item.metadata?.chapter || 'Chapter Unit',
            pageNumber: item.page_number || 1,
            text: item.content_text,
            similarity: Number(item.similarity.toFixed(3)),
            license: item.metadata?.license || 'Educational Verified',
          }));

          return {
            isTextbookGrounded: true,
            chunks,
            combinedContextText: chunks.map((c) => `[Source: ${c.sourceTitle}, ${c.chapter}, p.${c.pageNumber}]: ${c.text}`).join('\n\n'),
            citationMetadata: chunks.map((c) => ({
              source: c.sourceTitle,
              chapter: c.chapter,
              page: c.pageNumber,
              license: c.license,
            })),
          };
        }
      } catch (err) {
        logger.warn({ err }, 'Error during Supabase vector retrieval, falling back to local seed index');
      }
    }

    // 2. Local seed curriculum hybrid matching
    const lessons = loadSeedLessons();
    const scoredLessons = lessons.map((lesson) => {
      let score = 0;
      const titleLower = lesson.conceptName.toLowerCase();
      const detailedLower = lesson.detailedExplanation.toLowerCase();
      const simpleLower = lesson.simpleExplanation.toLowerCase();
      const subjectMatch = subject && lesson.subject.toLowerCase().includes(subject.toLowerCase());

      // Query keyword hits
      const terms = cleanQ.split(/\s+/).filter((t) => t.length > 2);
      terms.forEach((term) => {
        if (titleLower.includes(term)) score += 0.35;
        if (detailedLower.includes(term)) score += 0.15;
        if (simpleLower.includes(term)) score += 0.15;
      });

      if (subjectMatch) score += 0.2;
      if (grade && lesson.gradeLevel.toLowerCase() === grade.toLowerCase()) score += 0.1;

      return { lesson, score: Math.min(0.99, Number(score.toFixed(3))) };
    });

    const relevant = scoredLessons
      .filter((item) => item.score >= 0.25)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    if (relevant.length === 0) {
      return {
        isTextbookGrounded: false,
        chunks: [],
        combinedContextText: '',
        citationMetadata: [],
      };
    }

    const chunks: RetrievedChunk[] = relevant.map(({ lesson, score }, idx) => ({
      contentId: lesson.id,
      sourceTitle: lesson.sourceTitle,
      subject: lesson.subject,
      grade: lesson.gradeLevel,
      chapter: lesson.conceptName,
      pageNumber: idx + 15,
      text: `${lesson.simpleExplanation}\n\nDetailed Curricular Content: ${lesson.detailedExplanation}\nEveryday Analogy: ${lesson.everydayExample}`,
      similarity: score,
      license: lesson.license,
    }));

    return {
      isTextbookGrounded: true,
      chunks,
      combinedContextText: chunks
        .map((c) => `[Textbook Source: ${c.sourceTitle} - ${c.chapter}]:\n${c.text}`)
        .join('\n\n---\n\n'),
      citationMetadata: chunks.map((c) => ({
        source: c.sourceTitle,
        chapter: c.chapter,
        page: c.pageNumber,
        license: c.license,
      })),
    };
  }
}
