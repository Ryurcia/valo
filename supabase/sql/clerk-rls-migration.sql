-- Migration: Update RLS policies to use Clerk JWT (auth.jwt()->>'sub')
-- Run this in the Supabase SQL Editor after enabling Clerk as a third-party auth provider

-- ============================================================
-- IDEAS TABLE
-- ============================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can update their own ideas" ON ideas;
DROP POLICY IF EXISTS "Users can delete their own ideas" ON ideas;

-- Recreate with Clerk JWT
CREATE POLICY "Users can update their own ideas" ON ideas
  FOR UPDATE USING ((select auth.jwt()->>'sub') = user_id);

CREATE POLICY "Users can delete their own ideas" ON ideas
  FOR DELETE USING ((select auth.jwt()->>'sub') = user_id);

-- ============================================================
-- COMMENTS TABLE
-- ============================================================

-- Drop the buggy policy (was comparing user_id = user_id, i.e. column to itself)
DROP POLICY IF EXISTS "Users can delete their own comments" ON comments;

-- Also tighten insert to check user_id matches the JWT
DROP POLICY IF EXISTS "Users can insert comments" ON comments;

CREATE POLICY "Users can insert comments" ON comments
  FOR INSERT WITH CHECK ((select auth.jwt()->>'sub') = user_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING ((select auth.jwt()->>'sub') = user_id);

-- ============================================================
-- VOTES TABLE
-- ============================================================

-- Drop the overly permissive policies (were USING (true))
DROP POLICY IF EXISTS "Users can update their own votes" ON votes;
DROP POLICY IF EXISTS "Users can delete their own votes" ON votes;
DROP POLICY IF EXISTS "Users can insert votes" ON votes;

CREATE POLICY "Users can insert votes" ON votes
  FOR INSERT WITH CHECK ((select auth.jwt()->>'sub') = user_id);

CREATE POLICY "Users can update their own votes" ON votes
  FOR UPDATE USING ((select auth.jwt()->>'sub') = user_id);

CREATE POLICY "Users can delete their own votes" ON votes
  FOR DELETE USING ((select auth.jwt()->>'sub') = user_id);

-- ============================================================
-- CONNECTIONS TABLE (if RLS is enabled)
-- ============================================================

-- Check if connections has RLS — if so, update policies
-- These are safe to run even if the policies don't exist yet
DROP POLICY IF EXISTS "Users can insert connections" ON connections;
DROP POLICY IF EXISTS "Users can view their connections" ON connections;
DROP POLICY IF EXISTS "Users can update received connections" ON connections;

CREATE POLICY "Users can insert connections" ON connections
  FOR INSERT WITH CHECK ((select auth.jwt()->>'sub') = requester_id);

CREATE POLICY "Users can view their connections" ON connections
  FOR SELECT USING (
    (select auth.jwt()->>'sub') = requester_id
    OR (select auth.jwt()->>'sub') = recipient_id
  );

CREATE POLICY "Users can update received connections" ON connections
  FOR UPDATE USING ((select auth.jwt()->>'sub') = recipient_id);

-- ============================================================
-- USERS TABLE (if RLS is enabled)
-- ============================================================

DROP POLICY IF EXISTS "Users can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK ((select auth.jwt()->>'sub') = clerk_id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING ((select auth.jwt()->>'sub') = clerk_id);
