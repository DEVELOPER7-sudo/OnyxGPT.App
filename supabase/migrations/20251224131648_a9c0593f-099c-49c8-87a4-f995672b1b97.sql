-- Create bots table
CREATE TABLE public.bots (
  uuid UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  creator_username TEXT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  pfp_url TEXT,
  system_prompt TEXT NOT NULL,
  model_id TEXT NOT NULL DEFAULT 'gpt-5',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'unlisted', 'public')),
  capabilities JSONB NOT NULL DEFAULT '{"memory": false, "files": false, "tools": []}'::jsonb,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bot_chats table to track bot usage in chats
CREATE TABLE public.bot_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bot_uuid UUID NOT NULL REFERENCES public.bots(uuid) ON DELETE CASCADE,
  chat_id TEXT NOT NULL,
  user_id UUID NOT NULL,
  bot_config JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on bots table
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Enable RLS on bot_chats table
ALTER TABLE public.bot_chats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bots table

-- Anyone can view public bots
CREATE POLICY "Anyone can view public bots"
ON public.bots FOR SELECT
USING (visibility = 'public');

-- Users can view their own bots (any visibility)
CREATE POLICY "Users can view their own bots"
ON public.bots FOR SELECT
USING (auth.uid() = creator_id);

-- Users can view unlisted bots (via direct link)
CREATE POLICY "Users can view unlisted bots"
ON public.bots FOR SELECT
USING (visibility = 'unlisted');

-- Users can insert their own bots
CREATE POLICY "Users can insert their own bots"
ON public.bots FOR INSERT
WITH CHECK (auth.uid() = creator_id);

-- Users can update their own bots
CREATE POLICY "Users can update their own bots"
ON public.bots FOR UPDATE
USING (auth.uid() = creator_id);

-- Users can delete their own bots
CREATE POLICY "Users can delete their own bots"
ON public.bots FOR DELETE
USING (auth.uid() = creator_id);

-- RLS Policies for bot_chats table

-- Users can view their own bot chats
CREATE POLICY "Users can view their own bot chats"
ON public.bot_chats FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own bot chats
CREATE POLICY "Users can insert their own bot chats"
ON public.bot_chats FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own bot chats
CREATE POLICY "Users can delete their own bot chats"
ON public.bot_chats FOR DELETE
USING (auth.uid() = user_id);

-- Create function to increment bot usage count
CREATE OR REPLACE FUNCTION public.increment_bot_usage(bot_uuid UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.bots
  SET usage_count = usage_count + 1,
      updated_at = now()
  WHERE uuid = bot_uuid;
END;
$$;

-- Create indexes for better query performance
CREATE INDEX idx_bots_creator_id ON public.bots(creator_id);
CREATE INDEX idx_bots_visibility ON public.bots(visibility);
CREATE INDEX idx_bots_category ON public.bots(category);
CREATE INDEX idx_bots_usage_count ON public.bots(usage_count DESC);
CREATE INDEX idx_bot_chats_user_id ON public.bot_chats(user_id);
CREATE INDEX idx_bot_chats_bot_uuid ON public.bot_chats(bot_uuid);
CREATE INDEX idx_bot_chats_chat_id ON public.bot_chats(chat_id);

-- Create trigger to update updated_at on bots
CREATE OR REPLACE FUNCTION public.update_bots_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_bots_updated_at
BEFORE UPDATE ON public.bots
FOR EACH ROW
EXECUTE FUNCTION public.update_bots_updated_at();