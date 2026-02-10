-- ============================================================
-- Migration: Co-founder requirements per idea
-- Run after: supabase-schema.sql (ideas table must exist)
-- ============================================================

-- Skills the idea owner is looking for in a co-founder
-- Stored as a JSONB array, e.g. ["Frontend", "Marketing", "AI/ML"]
ALTER TABLE ideas ADD COLUMN cofounder_skills_needed JSONB DEFAULT '[]'::jsonb;

-- Roles needed (e.g. ["Technical Co-Founder", "Business Co-Founder"])
ALTER TABLE ideas ADD COLUMN cofounder_roles_needed JSONB DEFAULT '[]'::jsonb;

-- Experience level preference (e.g. 'Any', 'Senior', 'Mid-Level')
ALTER TABLE ideas ADD COLUMN cofounder_experience_level TEXT;

-- Time commitment preference (e.g. 'Full-time', 'Part-time', 'Flexible')
ALTER TABLE ideas ADD COLUMN cofounder_time_commitment TEXT;

-- GIN indexes for containment queries (e.g. find ideas that need "Frontend" skill)
CREATE INDEX idx_ideas_cofounder_skills ON ideas USING GIN (cofounder_skills_needed);
CREATE INDEX idx_ideas_cofounder_roles ON ideas USING GIN (cofounder_roles_needed);
