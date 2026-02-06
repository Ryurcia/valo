-- ============================================================
-- Migration: Matching query functions (callable via supabase.rpc())
-- Run order: 4 of 4 (depends on columns from migrations 1 and 2)
-- ============================================================

-- Find ideas similar to a given idea by vector cosine similarity
-- Usage: supabase.rpc('find_similar_ideas', { input_idea_id: '...', match_count: 5, similarity_threshold: 0.7 })
CREATE OR REPLACE FUNCTION find_similar_ideas(
  input_idea_id UUID,
  match_count INT DEFAULT 5,
  similarity_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  problem TEXT,
  audience TEXT,
  category TEXT,
  tags JSONB,
  user_id TEXT,
  vote_count INTEGER,
  similarity FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
  input_embedding vector(1536);
BEGIN
  -- Get the embedding of the input idea
  SELECT ideas.embedding INTO input_embedding
  FROM ideas
  WHERE ideas.id = input_idea_id;

  -- If no embedding exists, return empty
  IF input_embedding IS NULL THEN
    RETURN;
  END IF;

  -- Find similar ideas by cosine similarity
  RETURN QUERY
  SELECT
    i.id,
    i.title,
    i.problem,
    i.audience,
    i.category,
    i.tags,
    i.user_id,
    i.vote_count,
    1 - (i.embedding <=> input_embedding) AS similarity
  FROM ideas i
  WHERE i.id != input_idea_id
    AND i.embedding IS NOT NULL
    AND 1 - (i.embedding <=> input_embedding) > similarity_threshold
  ORDER BY i.embedding <=> input_embedding
  LIMIT match_count;
END;
$$;

-- Find potential co-founder matches for a user
-- Scores based on: complementary skills, mutual looking_for match, shared interests
-- Usage: supabase.rpc('find_cofounder_matches', { input_clerk_id: '...', match_count: 10 })
CREATE OR REPLACE FUNCTION find_cofounder_matches(
  input_clerk_id TEXT,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  clerk_id TEXT,
  first_name TEXT,
  last_name TEXT,
  username TEXT,
  role TEXT,
  skills JSONB,
  looking_for JSONB,
  bio TEXT,
  availability TEXT,
  interests JSONB,
  country TEXT,
  match_score INT
)
LANGUAGE plpgsql
AS $$
DECLARE
  user_looking_for JSONB;
  user_skills JSONB;
  user_interests JSONB;
BEGIN
  -- Get the requesting user's preferences
  SELECT u.looking_for, u.skills, u.interests
  INTO user_looking_for, user_skills, user_interests
  FROM users u
  WHERE u.clerk_id = input_clerk_id;

  RETURN QUERY
  SELECT
    u.clerk_id,
    u.first_name,
    u.last_name,
    u.username,
    u.role,
    u.skills,
    u.looking_for,
    u.bio,
    u.availability,
    u.interests,
    u.country,
    -- Score: count of overlapping skills/interests
    (
      -- How many of my "looking_for" match their skills or role?
      (SELECT COUNT(*)::INT FROM jsonb_array_elements_text(user_looking_for) lf
       WHERE u.skills @> jsonb_build_array(lf.value)
          OR u.role = lf.value)
      +
      -- How many of their "looking_for" match my skills?
      (SELECT COUNT(*)::INT FROM jsonb_array_elements_text(u.looking_for) lf
       WHERE user_skills @> jsonb_build_array(lf.value))
      +
      -- Bonus for shared interests
      (SELECT COUNT(*)::INT FROM jsonb_array_elements_text(user_interests) ui
       WHERE u.interests @> jsonb_build_array(ui.value))
    ) AS match_score
  FROM users u
  WHERE u.clerk_id != input_clerk_id
    AND u.seeking_cofounder = true
  ORDER BY match_score DESC, u.created_at DESC
  LIMIT match_count;
END;
$$;
