-- Feature 2: Advanced Collections & Organization
-- Create tables for managing chat collections, items, tags, and mappings

-- Create chat_collections table
CREATE TABLE IF NOT EXISTS public.chat_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#6366f1', -- Indigo default
  icon VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create collection_items table (junction table for chats in collections)
CREATE TABLE IF NOT EXISTS public.collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.chat_collections(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create chat_tags table for tag definitions
CREATE TABLE IF NOT EXISTS public.chat_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  color VARCHAR(7) DEFAULT '#e0e7ff',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, name)
);

-- Create chat_tag_mapping table (junction table for chats and tags)
CREATE TABLE IF NOT EXISTS public.chat_tag_mapping (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID NOT NULL,
  tag_id UUID NOT NULL REFERENCES public.chat_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chat_id, tag_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_collections_user_id ON public.chat_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON public.collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_chat_id ON public.collection_items(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_tags_user_id ON public.chat_tags(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_tag_mapping_chat_id ON public.chat_tag_mapping(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_tag_mapping_tag_id ON public.chat_tag_mapping(tag_id);

-- Enable RLS on all tables
ALTER TABLE public.chat_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_tag_mapping ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_collections
CREATE POLICY chat_collections_select ON public.chat_collections
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY chat_collections_insert ON public.chat_collections
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_collections_update ON public.chat_collections
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_collections_delete ON public.chat_collections
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for collection_items
CREATE POLICY collection_items_select ON public.collection_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chat_collections
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

CREATE POLICY collection_items_insert ON public.collection_items
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_collections
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

CREATE POLICY collection_items_update ON public.collection_items
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chat_collections
    WHERE id = collection_id AND user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_collections
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

CREATE POLICY collection_items_delete ON public.collection_items
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chat_collections
    WHERE id = collection_id AND user_id = auth.uid()
  )
);

-- RLS Policies for chat_tags
CREATE POLICY chat_tags_select ON public.chat_tags
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY chat_tags_insert ON public.chat_tags
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_tags_update ON public.chat_tags
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_tags_delete ON public.chat_tags
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for chat_tag_mapping
CREATE POLICY chat_tag_mapping_select ON public.chat_tag_mapping
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chat_tags ct
    WHERE ct.id = tag_id AND ct.user_id = auth.uid()
  )
);

CREATE POLICY chat_tag_mapping_insert ON public.chat_tag_mapping
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_tags ct
    WHERE ct.id = tag_id AND ct.user_id = auth.uid()
  )
);

CREATE POLICY chat_tag_mapping_delete ON public.chat_tag_mapping
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chat_tags ct
    WHERE ct.id = tag_id AND ct.user_id = auth.uid()
  )
);

-- Create helper functions for collections management
CREATE OR REPLACE FUNCTION public.get_collections_with_count(_user_id UUID)
RETURNS TABLE(
  id UUID,
  name VARCHAR,
  description TEXT,
  color VARCHAR,
  icon VARCHAR,
  chat_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    cc.id,
    cc.name,
    cc.description,
    cc.color,
    cc.icon,
    COUNT(ci.id)::INTEGER as chat_count,
    cc.created_at
  FROM public.chat_collections cc
  LEFT JOIN public.collection_items ci ON cc.id = ci.collection_id
  WHERE cc.user_id = _user_id
  GROUP BY cc.id, cc.name, cc.description, cc.color, cc.icon, cc.created_at
  ORDER BY cc.created_at DESC;
$$;

-- Create function to get chats by collection
CREATE OR REPLACE FUNCTION public.get_collection_chats(_collection_id UUID)
RETURNS TABLE(chat_id UUID, position INTEGER)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ci.chat_id, ci.position
  FROM public.collection_items ci
  WHERE ci.collection_id = _collection_id
  ORDER BY ci.position, ci.created_at;
$$;
