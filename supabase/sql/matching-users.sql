-- ============================================================
-- Migration: User profile enrichment for co-founder matching
-- Run order: 1 of 4
-- ============================================================

-- Skills the user has (structured, for filtering)
-- Stored as a JSONB array, e.g. ["React", "Python", "Sales", "UI/UX Design"]
ALTER TABLE users ADD COLUMN skills JSONB DEFAULT '[]'::jsonb;

-- Skills/roles the user is looking for in a co-founder (structured, for filtering)
-- Stored as a JSONB array, e.g. ["Developer", "Designer"]
ALTER TABLE users ADD COLUMN looking_for JSONB DEFAULT '[]'::jsonb;

-- Short bio / elevator pitch about the user
ALTER TABLE users ADD COLUMN bio TEXT;

-- LinkedIn profile URL (optional, for credibility / outreach)
ALTER TABLE users ADD COLUMN linkedin_url TEXT;

-- Availability/commitment level
-- Expected values: 'full-time', 'part-time', 'weekends', 'exploring'
ALTER TABLE users ADD COLUMN availability TEXT;

-- Whether the user is actively seeking a co-founder
ALTER TABLE users ADD COLUMN seeking_cofounder BOOLEAN DEFAULT false;

-- Interests / industries the user cares about (structured, for filtering)
-- Stored as a JSONB array, e.g. ["FinTech", "HealthTech", "EdTech", "SaaS"]
ALTER TABLE users ADD COLUMN interests JSONB DEFAULT '[]'::jsonb;

-- Indexes for JSONB containment queries (e.g. find users whose skills contain "React")
CREATE INDEX idx_users_skills ON users USING GIN (skills);
CREATE INDEX idx_users_looking_for ON users USING GIN (looking_for);
CREATE INDEX idx_users_interests ON users USING GIN (interests);

-- Partial index for filtering by seeking_cofounder flag
CREATE INDEX idx_users_seeking_cofounder ON users (seeking_cofounder) WHERE seeking_cofounder = true;
