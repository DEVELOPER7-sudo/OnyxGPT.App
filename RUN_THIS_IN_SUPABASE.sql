-- =========================================
-- BOT SYSTEM SETUP - Run this in Supabase SQL Editor
-- =========================================
-- Copy and paste this ENTIRE file into Supabase SQL Editor and click RUN

-- Create bots table
CREATE TABLE IF NOT EXISTS bots (
  uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  creator_username TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  pfp_url TEXT,
  system_prompt TEXT NOT NULL,
  model_id TEXT NOT NULL DEFAULT 'gpt-5',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  capabilities JSONB DEFAULT '{"memory": false, "files": false, "tools": []}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  usage_count INTEGER DEFAULT 0
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bots_creator_id ON bots(creator_id);
CREATE INDEX IF NOT EXISTS idx_bots_visibility ON bots(visibility);
CREATE INDEX IF NOT EXISTS idx_bots_category ON bots(category);
CREATE INDEX IF NOT EXISTS idx_bots_created_at ON bots(created_at DESC);

-- Create bot_chats junction table to track bot usage in chats
CREATE TABLE IF NOT EXISTS bot_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_uuid UUID NOT NULL REFERENCES bots(uuid) ON DELETE CASCADE,
  chat_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_config JSONB NOT NULL, -- Snapshot of bot config at chat creation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for bot_chats
CREATE INDEX IF NOT EXISTS idx_bot_chats_bot_uuid ON bot_chats(bot_uuid);
CREATE INDEX IF NOT EXISTS idx_bot_chats_user_id ON bot_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_chats_chat_id ON bot_chats(chat_id);

-- Enable RLS
ALTER TABLE bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bots
-- Public bots viewable by everyone (including guests)
CREATE POLICY IF NOT EXISTS "Users can view public bots"
  ON bots FOR SELECT
  USING (visibility = 'public');

-- Users can view their own bots (private, unlisted, public)
CREATE POLICY IF NOT EXISTS "Users can view their own bots"
  ON bots FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create bots"
  ON bots FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can update their own bots"
  ON bots FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can delete their own bots"
  ON bots FOR DELETE
  USING (creator_id = auth.uid());

-- RLS Policies for bot_chats
CREATE POLICY IF NOT EXISTS "Users can view their own bot_chats"
  ON bot_chats FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY IF NOT EXISTS "Users can create bot_chats"
  ON bot_chats FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- =========================================
-- Create increment_bot_usage function
-- =========================================
CREATE OR REPLACE FUNCTION increment_bot_usage(bot_uuid UUID)
RETURNS void
LANGUAGE SQL
AS $$
  UPDATE bots
  SET usage_count = usage_count + 1
  WHERE uuid = bot_uuid;
$$;

-- Grant function execution
GRANT EXECUTE ON FUNCTION increment_bot_usage(UUID) TO authenticated;

-- =========================================
-- VERIFICATION STEPS AFTER RUNNING THIS:
-- =========================================
-- 1. Go to Database → Tables in Supabase Dashboard
--    You should see: "bots" and "bot_chats" tables
--
-- 2. Go to Storage in Supabase Dashboard
--    Create a new bucket called "bot-avatars" and make it PUBLIC
--
-- 3. Return to your app and refresh the page
--
-- 4. Go to /bots - you should now be able to create and view bots
--
-- =========================================
