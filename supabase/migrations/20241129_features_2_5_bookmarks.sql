-- Feature 4: Smart Bookmarks & Research Library
-- Create tables for bookmarks, folders, citations, and metadata

-- Create bookmark_folders table
CREATE TABLE IF NOT EXISTS public.bookmark_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#f59e0b', -- Amber default
  icon VARCHAR(50),
  parent_folder_id UUID REFERENCES public.bookmark_folders(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bookmarks table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message_id VARCHAR(255) NOT NULL,
  chat_id UUID NOT NULL,
  content TEXT NOT NULL,
  title VARCHAR(255),
  note TEXT,
  folder_id UUID REFERENCES public.bookmark_folders(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  is_important BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, message_id)
);

-- Create bookmark_citations table for citation metadata
CREATE TABLE IF NOT EXISTS public.bookmark_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookmark_id UUID NOT NULL REFERENCES public.bookmarks(id) ON DELETE CASCADE,
  format VARCHAR(50) NOT NULL CHECK (format IN ('APA', 'MLA', 'Chicago', 'Harvard')),
  citation_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(bookmark_id, format)
);

-- Create bookmark_snapshots for version history
CREATE TABLE IF NOT EXISTS public.bookmark_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bookmark_id UUID NOT NULL REFERENCES public.bookmarks(id) ON DELETE CASCADE,
  content_before TEXT,
  content_after TEXT,
  change_type VARCHAR(50) NOT NULL CHECK (change_type IN ('created', 'edited', 'moved', 'tagged')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_user_id ON public.bookmark_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_folders_parent_id ON public.bookmark_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_chat_id ON public.bookmarks(chat_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_folder_id ON public.bookmarks(folder_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_is_important ON public.bookmarks(is_important);
CREATE INDEX IF NOT EXISTS idx_bookmark_citations_bookmark_id ON public.bookmark_citations(bookmark_id);
CREATE INDEX IF NOT EXISTS idx_bookmark_snapshots_bookmark_id ON public.bookmark_snapshots(bookmark_id);

-- Enable RLS on all tables
ALTER TABLE public.bookmark_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmark_snapshots ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookmark_folders
CREATE POLICY bookmark_folders_select ON public.bookmark_folders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY bookmark_folders_insert ON public.bookmark_folders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id AND (parent_folder_id IS NULL OR EXISTS (
  SELECT 1 FROM public.bookmark_folders WHERE id = parent_folder_id AND user_id = auth.uid()
)));

CREATE POLICY bookmark_folders_update ON public.bookmark_folders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY bookmark_folders_delete ON public.bookmark_folders
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for bookmarks
CREATE POLICY bookmarks_select ON public.bookmarks
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY bookmarks_insert ON public.bookmarks
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY bookmarks_update ON public.bookmarks
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY bookmarks_delete ON public.bookmarks
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for bookmark_citations
CREATE POLICY bookmark_citations_select ON public.bookmark_citations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookmarks b
    WHERE b.id = bookmark_id AND b.user_id = auth.uid()
  )
);

CREATE POLICY bookmark_citations_insert ON public.bookmark_citations
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookmarks b
    WHERE b.id = bookmark_id AND b.user_id = auth.uid()
  )
);

CREATE POLICY bookmark_citations_delete ON public.bookmark_citations
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookmarks b
    WHERE b.id = bookmark_id AND b.user_id = auth.uid()
  )
);

-- RLS Policies for bookmark_snapshots
CREATE POLICY bookmark_snapshots_select ON public.bookmark_snapshots
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookmarks b
    WHERE b.id = bookmark_id AND b.user_id = auth.uid()
  )
);

CREATE POLICY bookmark_snapshots_insert ON public.bookmark_snapshots
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.bookmarks b
    WHERE b.id = bookmark_id AND b.user_id = auth.uid()
  )
);

-- Create helper functions for bookmarks management
CREATE OR REPLACE FUNCTION public.get_bookmarks_with_citations(_user_id UUID)
RETURNS TABLE(
  id UUID,
  title VARCHAR,
  content TEXT,
  chat_id UUID,
  is_important BOOLEAN,
  folder_id UUID,
  apa_citation TEXT,
  mla_citation TEXT,
  chicago_citation TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.title,
    b.content,
    b.chat_id,
    b.is_important,
    b.folder_id,
    MAX(CASE WHEN bc.format = 'APA' THEN bc.citation_text END) as apa_citation,
    MAX(CASE WHEN bc.format = 'MLA' THEN bc.citation_text END) as mla_citation,
    MAX(CASE WHEN bc.format = 'Chicago' THEN bc.citation_text END) as chicago_citation,
    b.created_at
  FROM public.bookmarks b
  LEFT JOIN public.bookmark_citations bc ON b.id = bc.bookmark_id
  WHERE b.user_id = _user_id
  GROUP BY b.id, b.title, b.content, b.chat_id, b.is_important, b.folder_id, b.created_at
  ORDER BY b.is_important DESC, b.created_at DESC;
$$;

-- Create function to search bookmarks
CREATE OR REPLACE FUNCTION public.search_bookmarks(_user_id UUID, _query TEXT)
RETURNS TABLE(
  id UUID,
  title VARCHAR,
  content TEXT,
  relevance_score FLOAT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.title,
    b.content,
    (
      CASE WHEN b.title ILIKE '%' || _query || '%' THEN 0.5 ELSE 0 END +
      CASE WHEN b.content ILIKE '%' || _query || '%' THEN 0.3 ELSE 0 END +
      CASE WHEN b.note ILIKE '%' || _query || '%' THEN 0.2 ELSE 0 END
    )::FLOAT as relevance_score
  FROM public.bookmarks b
  WHERE b.user_id = _user_id
    AND (b.title ILIKE '%' || _query || '%'
      OR b.content ILIKE '%' || _query || '%'
      OR b.note ILIKE '%' || _query || '%')
  ORDER BY relevance_score DESC, b.created_at DESC;
$$;

-- Create function to export bookmarks
CREATE OR REPLACE FUNCTION public.export_bookmarks(_user_id UUID)
RETURNS TABLE(
  id UUID,
  title VARCHAR,
  content TEXT,
  folder_name VARCHAR,
  citations JSONB,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    b.id,
    b.title,
    b.content,
    COALESCE(bf.name, 'Uncategorized') as folder_name,
    JSONB_OBJECT_AGG(COALESCE(bc.format, 'none'), COALESCE(bc.citation_text, '')) as citations,
    b.created_at
  FROM public.bookmarks b
  LEFT JOIN public.bookmark_folders bf ON b.folder_id = bf.id
  LEFT JOIN public.bookmark_citations bc ON b.id = bc.bookmark_id
  WHERE b.user_id = _user_id
  GROUP BY b.id, b.title, b.content, bf.name, b.created_at
  ORDER BY b.created_at DESC;
$$;
