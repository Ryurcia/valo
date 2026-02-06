-- ============================================================
-- Migration: Connection requests between users
-- Run order: 3 of 4 (depends on ideas table from migration 2)
-- ============================================================

CREATE TABLE connections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- The user who initiated the connection request (Clerk ID)
  requester_id TEXT NOT NULL,

  -- The user who received the connection request (Clerk ID)
  recipient_id TEXT NOT NULL,

  -- Optional: the idea that prompted this connection
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,

  -- Connection status workflow: pending -> accepted/declined
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined')),

  -- Short message from requester explaining why they want to connect
  message TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Prevent duplicate connection requests between the same pair
  UNIQUE(requester_id, recipient_id)
);

-- Indexes for looking up connections by either party
CREATE INDEX idx_connections_requester ON connections (requester_id);
CREATE INDEX idx_connections_recipient ON connections (recipient_id);

-- Composite partial index for "show me my pending requests" queries
CREATE INDEX idx_connections_recipient_pending
  ON connections (recipient_id, status)
  WHERE status = 'pending';

-- Enable RLS (auth enforced in API routes via Clerk, matching existing app pattern)
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Connections are readable" ON connections
  FOR SELECT USING (true);

CREATE POLICY "Users can send connection requests" ON connections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update connections" ON connections
  FOR UPDATE USING (true);

-- Auto-update updated_at on row changes
CREATE OR REPLACE FUNCTION update_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER connections_updated_at_trigger
BEFORE UPDATE ON connections
FOR EACH ROW EXECUTE FUNCTION update_connections_updated_at();
