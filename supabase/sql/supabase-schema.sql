-- Create the ideas table
CREATE TABLE ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  problem TEXT NOT NULL,
  solution TEXT NOT NULL,
  audience TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL DEFAULT '',
  stage TEXT NOT NULL DEFAULT 'Concept',
  looking_for_cofounder BOOLEAN NOT NULL DEFAULT false,
  market_analysis JSONB,
  competitors JSONB,
  difficulty TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on user_id for faster lookups
CREATE INDEX ideas_user_id_idx ON ideas(user_id);

-- Create an index on created_at for sorting
CREATE INDEX ideas_created_at_idx ON ideas(created_at DESC);

-- Enable Row Level Security
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read all ideas (public feed)
CREATE POLICY "Ideas are viewable by everyone" ON ideas
  FOR SELECT USING (true);

-- Policy: Authenticated users can insert their own ideas
CREATE POLICY "Users can insert their own ideas" ON ideas
  FOR INSERT WITH CHECK (true);

-- Policy: Users can update their own ideas
CREATE POLICY "Users can update their own ideas" ON ideas
  FOR UPDATE USING (auth.uid()::text = user_id);

-- Policy: Users can delete their own ideas
CREATE POLICY "Users can delete their own ideas" ON ideas
  FOR DELETE USING (auth.uid()::text = user_id);
