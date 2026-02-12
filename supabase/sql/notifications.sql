-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('connection_accepted', 'connection_declined', 'connection_request')),
  connection_id UUID REFERENCES connections(id) ON DELETE CASCADE,
  idea_id UUID REFERENCES ideas(id) ON DELETE SET NULL,
  actor_name TEXT NOT NULL,
  idea_title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT false,
  seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id) WHERE read = false;
CREATE INDEX idx_notifications_seen_at ON notifications(seen_at) WHERE seen_at IS NOT NULL;

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Service can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.jwt()->>'sub');

CREATE POLICY "Users can delete own notifications"
  ON notifications FOR DELETE
  USING (user_id = auth.jwt()->>'sub');

-- Add rejection_reason to connections table
ALTER TABLE connections ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
