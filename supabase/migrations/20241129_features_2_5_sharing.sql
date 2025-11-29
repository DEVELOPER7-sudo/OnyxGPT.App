-- Feature 3: Chat Sharing & Collaboration
-- Create tables for shared chats, comments, reactions, and access logs

-- Create shared_chats table
CREATE TABLE IF NOT EXISTS public.shared_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL,
  share_token VARCHAR(255) NOT NULL UNIQUE,
  access_type VARCHAR(20) NOT NULL CHECK (access_type IN ('public', 'private', 'password')),
  password_hash VARCHAR(255),
  expires_at TIMESTAMP WITH TIME ZONE,
  allows_comments BOOLEAN DEFAULT TRUE,
  allows_reactions BOOLEAN DEFAULT TRUE,
  allows_export BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  title VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create message_comments table for threaded comments
CREATE TABLE IF NOT EXISTS public.message_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_chat_id UUID NOT NULL REFERENCES public.shared_chats(id) ON DELETE CASCADE,
  message_id VARCHAR(255) NOT NULL,
  user_id UUID,
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  content TEXT NOT NULL,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP WITH TIME ZONE,
  parent_comment_id UUID REFERENCES public.message_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create comment_reactions table for emoji reactions
CREATE TABLE IF NOT EXISTS public.comment_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID NOT NULL REFERENCES public.message_comments(id) ON DELETE CASCADE,
  emoji VARCHAR(50) NOT NULL,
  user_id UUID,
  user_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(comment_id, emoji, COALESCE(user_id, 'anonymous'))
);

-- Create share_access_logs table for tracking access
CREATE TABLE IF NOT EXISTS public.share_access_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_chat_id UUID NOT NULL REFERENCES public.shared_chats(id) ON DELETE CASCADE,
  visitor_ip VARCHAR(45),
  visitor_user_agent TEXT,
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  access_duration_seconds INTEGER,
  device_type VARCHAR(50),
  country VARCHAR(100)
);

-- Create share_notifications table
CREATE TABLE IF NOT EXISTS public.share_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shared_chat_id UUID NOT NULL REFERENCES public.shared_chats(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('comment', 'reaction', 'view')),
  triggered_by_user_id UUID,
  triggered_by_name VARCHAR(255),
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shared_chats_user_id ON public.shared_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_chats_chat_id ON public.shared_chats(chat_id);
CREATE INDEX IF NOT EXISTS idx_shared_chats_share_token ON public.shared_chats(share_token);
CREATE INDEX IF NOT EXISTS idx_shared_chats_expires_at ON public.shared_chats(expires_at);
CREATE INDEX IF NOT EXISTS idx_message_comments_shared_chat_id ON public.message_comments(shared_chat_id);
CREATE INDEX IF NOT EXISTS idx_message_comments_message_id ON public.message_comments(message_id);
CREATE INDEX IF NOT EXISTS idx_message_comments_user_id ON public.message_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comment_reactions_comment_id ON public.comment_reactions(comment_id);
CREATE INDEX IF NOT EXISTS idx_share_access_logs_shared_chat_id ON public.share_access_logs(shared_chat_id);
CREATE INDEX IF NOT EXISTS idx_share_access_logs_accessed_at ON public.share_access_logs(accessed_at);

-- Enable RLS on all tables
ALTER TABLE public.shared_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_access_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.share_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for shared_chats
CREATE POLICY shared_chats_select ON public.shared_chats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY shared_chats_insert ON public.shared_chats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY shared_chats_update ON public.shared_chats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY shared_chats_delete ON public.shared_chats
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for message_comments (allow public access for valid shares)
CREATE POLICY message_comments_select ON public.message_comments
FOR SELECT
TO anon
USING (
  EXISTS (
    SELECT 1 FROM public.shared_chats
    WHERE id = shared_chat_id 
      AND access_type = 'public'
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  )
);

CREATE POLICY message_comments_select_auth ON public.message_comments
FOR SELECT
TO authenticated
USING (
  auth.uid() IN (SELECT user_id FROM public.shared_chats WHERE id = shared_chat_id)
  OR EXISTS (
    SELECT 1 FROM public.shared_chats
    WHERE id = shared_chat_id 
      AND access_type = 'public'
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  )
);

CREATE POLICY message_comments_insert ON public.message_comments
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.shared_chats
    WHERE id = shared_chat_id 
      AND allows_comments = TRUE
      AND access_type = 'public'
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  )
  OR (
    auth.uid() IN (SELECT user_id FROM public.shared_chats WHERE id = shared_chat_id)
  )
);

-- RLS Policies for comment_reactions
CREATE POLICY comment_reactions_select ON public.comment_reactions
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.message_comments mc
    JOIN public.shared_chats sc ON mc.shared_chat_id = sc.id
    WHERE mc.id = comment_id 
      AND sc.allows_reactions = TRUE
      AND (sc.expires_at IS NULL OR sc.expires_at > CURRENT_TIMESTAMP)
  )
);

CREATE POLICY comment_reactions_insert ON public.comment_reactions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.message_comments mc
    JOIN public.shared_chats sc ON mc.shared_chat_id = sc.id
    WHERE mc.id = comment_id 
      AND sc.allows_reactions = TRUE
      AND (sc.expires_at IS NULL OR sc.expires_at > CURRENT_TIMESTAMP)
  )
);

-- RLS Policies for share_access_logs
CREATE POLICY share_access_logs_select ON public.share_access_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shared_chats
    WHERE id = shared_chat_id AND user_id = auth.uid()
  )
);

CREATE POLICY share_access_logs_insert ON public.share_access_logs
FOR INSERT
TO anon, authenticated
WITH CHECK (TRUE);

-- RLS Policies for share_notifications
CREATE POLICY share_notifications_select ON public.share_notifications
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.shared_chats
    WHERE id = shared_chat_id AND user_id = auth.uid()
  )
);

-- Create helper functions for sharing management
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT
LANGUAGE sql
AS $$
  SELECT substring(md5(random()::TEXT || CURRENT_TIMESTAMP::TEXT), 1, 32);
$$;

CREATE OR REPLACE FUNCTION public.get_share_details(_share_token VARCHAR)
RETURNS TABLE(
  id UUID,
  chat_id UUID,
  access_type VARCHAR,
  allows_comments BOOLEAN,
  allows_reactions BOOLEAN,
  view_count INTEGER,
  total_comments INTEGER,
  expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    sc.id,
    sc.chat_id,
    sc.access_type,
    sc.allows_comments,
    sc.allows_reactions,
    sc.view_count,
    COUNT(DISTINCT mc.id)::INTEGER as total_comments,
    sc.expires_at
  FROM public.shared_chats sc
  LEFT JOIN public.message_comments mc ON sc.id = mc.shared_chat_id
  WHERE sc.share_token = _share_token
    AND (sc.access_type = 'public' OR sc.expires_at > CURRENT_TIMESTAMP)
  GROUP BY sc.id, sc.chat_id, sc.access_type, sc.allows_comments, sc.allows_reactions, sc.view_count, sc.expires_at;
$$;

-- Create function to get access logs for a shared chat
CREATE OR REPLACE FUNCTION public.get_share_access_stats(_shared_chat_id UUID)
RETURNS TABLE(
  total_visits INTEGER,
  unique_visitors INTEGER,
  last_visited TIMESTAMP WITH TIME ZONE,
  avg_duration_seconds FLOAT,
  most_common_device VARCHAR
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    COUNT(*)::INTEGER as total_visits,
    COUNT(DISTINCT visitor_ip)::INTEGER as unique_visitors,
    MAX(accessed_at) as last_visited,
    AVG(COALESCE(access_duration_seconds, 0))::FLOAT as avg_duration_seconds,
    MODE() WITHIN GROUP (ORDER BY device_type) as most_common_device
  FROM public.share_access_logs
  WHERE shared_chat_id = _shared_chat_id;
$$;

-- Create function to record share view
CREATE OR REPLACE FUNCTION public.record_share_view(_share_token VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.shared_chats
  SET view_count = view_count + 1
  WHERE share_token = _share_token
    AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP);
  
  RETURN FOUND;
END;
$$;
