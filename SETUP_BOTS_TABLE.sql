-- ============================================
-- BOT SYSTEM SETUP - Run this in Supabase SQL Editor
-- ============================================
-- This script creates the bots table and all related infrastructure
-- Copy and paste this entire script into your Supabase project's SQL Editor

-- Create bots table
CREATE TABLE IF NOT EXISTS public.bots (
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
CREATE INDEX IF NOT EXISTS idx_bots_creator_id ON public.bots(creator_id);
CREATE INDEX IF NOT EXISTS idx_bots_visibility ON public.bots(visibility);
CREATE INDEX IF NOT EXISTS idx_bots_category ON public.bots(category);
CREATE INDEX IF NOT EXISTS idx_bots_created_at ON public.bots(created_at DESC);

-- Create bot_chats junction table to track bot usage in chats
CREATE TABLE IF NOT EXISTS public.bot_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_uuid UUID NOT NULL REFERENCES public.bots(uuid) ON DELETE CASCADE,
  chat_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_config JSONB NOT NULL, -- Snapshot of bot config at chat creation
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for bot_chats
CREATE INDEX IF NOT EXISTS idx_bot_chats_bot_uuid ON public.bot_chats(bot_uuid);
CREATE INDEX IF NOT EXISTS idx_bot_chats_user_id ON public.bot_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_chats_chat_id ON public.bot_chats(chat_id);

-- Enable RLS
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_chats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view public bots" ON public.bots;
DROP POLICY IF EXISTS "Users can view their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can create bots" ON public.bots;
DROP POLICY IF EXISTS "Users can update their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can delete their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can view their own bot_chats" ON public.bot_chats;
DROP POLICY IF EXISTS "Users can create bot_chats" ON public.bot_chats;

-- RLS Policies for bots
-- Public bots viewable by everyone (including guests)
CREATE POLICY "Users can view public bots"
  ON public.bots FOR SELECT
  USING (visibility = 'public');

-- Users can view their own bots (private, unlisted, public)
CREATE POLICY "Users can view their own bots"
  ON public.bots FOR SELECT
  USING (creator_id = auth.uid());

CREATE POLICY "Users can create bots"
  ON public.bots FOR INSERT
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own bots"
  ON public.bots FOR UPDATE
  USING (creator_id = auth.uid())
  WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete their own bots"
  ON public.bots FOR DELETE
  USING (creator_id = auth.uid());

-- RLS Policies for bot_chats
CREATE POLICY "Users can view their own bot_chats"
  ON public.bot_chats FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can create bot_chats"
  ON public.bot_chats FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create storage bucket for bot avatars (if not exists)
-- Note: This needs to be done in Supabase dashboard under Storage
-- Create a bucket named 'bot-avatars' with public access for read

-- Create function to increment bot usage count
CREATE OR REPLACE FUNCTION public.increment_bot_usage(bot_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.bots
  SET usage_count = usage_count + 1
  WHERE uuid = bot_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.increment_bot_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_bot_usage(UUID) TO anon;

-- ============================================
-- SETUP COMPLETE
-- ============================================
-- Your bot system is now ready to use!
-- 
-- Next steps:
-- 1. Make sure you have a 'bot-avatars' storage bucket
-- 2. Set the bucket to allow public reads (for viewing bot avatars)
-- 3. Test by creating a bot from the UI
