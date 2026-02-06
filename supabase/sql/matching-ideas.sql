-- ============================================================
-- Migration: Idea categorization + vector embeddings for similar idea matching
-- Run order: 2 of 4
-- ============================================================

-- Enable the pgvector extension (Supabase supports this natively)
CREATE EXTENSION IF NOT EXISTS vector;

-- Industry/vertical category (structured, for filtering)
-- e.g. 'FinTech', 'HealthTech', 'EdTech', 'E-Commerce', 'SaaS', 'Marketplace', etc.
ALTER TABLE ideas ADD COLUMN category TEXT;

-- Tags for more granular classification (flexible)
-- Stored as a JSONB array, e.g. ["AI", "B2B", "Mobile", "Subscription"]
ALTER TABLE ideas ADD COLUMN tags JSONB DEFAULT '[]'::jsonb;

-- Stage of the idea
-- Expected values: 'concept', 'validating', 'prototype', 'mvp', 'launched'
ALTER TABLE ideas ADD COLUMN stage TEXT DEFAULT 'concept';

-- Whether the idea owner is looking for co-founders on this specific idea
ALTER TABLE ideas ADD COLUMN looking_for_cofounders BOOLEAN DEFAULT false;

-- Embedding vector for semantic similarity search
-- 1536 dimensions matches OpenAI text-embedding-3-small and many other embedding models
ALTER TABLE ideas ADD COLUMN embedding vector(1536);

-- Indexes
CREATE INDEX idx_ideas_category ON ideas (category);
CREATE INDEX idx_ideas_tags ON ideas USING GIN (tags);
CREATE INDEX idx_ideas_stage ON ideas (stage);

-- HNSW index for fast approximate nearest neighbor search on embeddings
CREATE INDEX idx_ideas_embedding ON ideas USING hnsw (embedding vector_cosine_ops);
