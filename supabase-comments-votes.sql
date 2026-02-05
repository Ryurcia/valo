-- Create the comments table
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_image TEXT,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for comments
CREATE INDEX comments_idea_id_idx ON comments(idea_id);
CREATE INDEX comments_created_at_idx ON comments(created_at DESC);

-- Enable RLS for comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read comments
CREATE POLICY "Comments are viewable by everyone" ON comments
  FOR SELECT USING (true);

-- Policy: Authenticated users can insert comments
CREATE POLICY "Users can insert comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Policy: Users can delete their own comments
CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (user_id = user_id);

-- Create the votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  vote_type INTEGER NOT NULL CHECK (vote_type IN (-1, 1)), -- -1 for downvote, 1 for upvote
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(idea_id, user_id) -- One vote per user per idea
);

-- Create indexes for votes
CREATE INDEX votes_idea_id_idx ON votes(idea_id);
CREATE INDEX votes_user_id_idx ON votes(user_id);

-- Enable RLS for votes
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read votes
CREATE POLICY "Votes are viewable by everyone" ON votes
  FOR SELECT USING (true);

-- Policy: Authenticated users can insert votes
CREATE POLICY "Users can insert votes" ON votes
  FOR INSERT WITH CHECK (true);

-- Policy: Users can update their own votes
CREATE POLICY "Users can update their own votes" ON votes
  FOR UPDATE USING (true);

-- Policy: Users can delete their own votes
CREATE POLICY "Users can delete their own votes" ON votes
  FOR DELETE USING (true);

-- Add vote_count column to ideas table for quick access
ALTER TABLE ideas ADD COLUMN vote_count INTEGER DEFAULT 0;

-- Create a function to update vote count
CREATE OR REPLACE FUNCTION update_idea_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE ideas SET vote_count = vote_count + NEW.vote_type WHERE id = NEW.idea_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE ideas SET vote_count = vote_count - OLD.vote_type WHERE id = OLD.idea_id;
  ELSIF TG_OP = 'UPDATE' THEN
    UPDATE ideas SET vote_count = vote_count - OLD.vote_type + NEW.vote_type WHERE id = NEW.idea_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vote count updates
CREATE TRIGGER update_vote_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON votes
FOR EACH ROW EXECUTE FUNCTION update_idea_vote_count();
