# SahaayaLearn RAG & Knowledge Retrieval

## Core Architecture
- **Embeddings:** Gemini Embeddings (`gemini-embedding-001`, 768 dimensions)
- **Vector Search:** Supabase `pgvector` with HNSW cosine distance index
- **Hybrid Retrieval:** Combined vector similarity and PostgreSQL full-text search (`tsvector`)
- **Chunking Strategy:** 500–900 tokens per educational segment with 100-token overlap, preserving chapter hierarchy and mathematical equations.

---

## Strict Grounding Rules
1. Every answer is cross-checked against retrieved curriculum source metadata.
2. If no authoritative textbook source satisfies the minimum similarity threshold (0.55), the tutor explicitly marks the answer as supplementary and does not invent fake page numbers.
3. Citations are returned as structured metadata (`sourceTitle`, `chapter`, `pageNumber`, `license`).
