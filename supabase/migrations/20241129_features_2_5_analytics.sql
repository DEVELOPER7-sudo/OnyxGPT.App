-- Feature 5: Advanced Analytics & Usage Insights
-- Create tables for analytics tracking, metrics, and reports

-- Create user_analytics table for daily statistics
CREATE TABLE IF NOT EXISTS public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  messages_count INTEGER DEFAULT 0,
  chats_created INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_tokens_generated INTEGER DEFAULT 0,
  avg_response_time_ms FLOAT DEFAULT 0,
  model_used TEXT,
  features_used TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create chat_metadata table for chat-level analytics
CREATE TABLE IF NOT EXISTS public.chat_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL,
  title VARCHAR(255),
  model_used VARCHAR(100),
  total_messages INTEGER DEFAULT 0,
  total_tokens_used INTEGER DEFAULT 0,
  total_tokens_generated INTEGER DEFAULT 0,
  avg_response_time_ms FLOAT DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  web_search_used BOOLEAN DEFAULT FALSE,
  images_generated INTEGER DEFAULT 0,
  bookmarks_count INTEGER DEFAULT 0,
  is_archived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, chat_id)
);

-- Create model_usage_stats table
CREATE TABLE IF NOT EXISTS public.model_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  model_name VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  tokens_used INTEGER DEFAULT 0,
  cost_estimated DECIMAL(10, 4) DEFAULT 0,
  avg_response_time_ms FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, model_name)
);

-- Create feature_usage_stats table
CREATE TABLE IF NOT EXISTS public.feature_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  feature_name VARCHAR(100) NOT NULL,
  usage_count INTEGER DEFAULT 0,
  success_count INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  avg_execution_time_ms FLOAT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, feature_name)
);

-- Create token_usage_log table for detailed token tracking
CREATE TABLE IF NOT EXISTS public.token_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chat_id UUID,
  message_id VARCHAR(255),
  model_name VARCHAR(100),
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER DEFAULT 0,
  cost_usd DECIMAL(10, 6) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create analytics_reports table for saved reports
CREATE TABLE IF NOT EXISTS public.analytics_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  report_type VARCHAR(50) NOT NULL CHECK (report_type IN ('daily', 'weekly', 'monthly', 'custom')),
  date_range_start DATE,
  date_range_end DATE,
  metrics_included TEXT[] DEFAULT '{}',
  data JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create productivity_insights table
CREATE TABLE IF NOT EXISTS public.productivity_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  productive_hours INTEGER,
  peak_activity_hour INTEGER,
  total_sessions INTEGER,
  avg_session_duration_minutes INTEGER,
  most_used_model VARCHAR(100),
  avg_response_quality_score FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create cost_estimates table
CREATE TABLE IF NOT EXISTS public.cost_estimates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  model_costs JSONB,
  total_cost_usd DECIMAL(10, 6) DEFAULT 0,
  estimated_monthly_cost DECIMAL(10, 2) DEFAULT 0,
  estimated_yearly_cost DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analytics_date ON public.user_analytics(date);
CREATE INDEX IF NOT EXISTS idx_user_analytics_user_date ON public.user_analytics(user_id, date);
CREATE INDEX IF NOT EXISTS idx_chat_metadata_user_id ON public.chat_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_metadata_chat_id ON public.chat_metadata(chat_id);
CREATE INDEX IF NOT EXISTS idx_chat_metadata_created_at ON public.chat_metadata(created_at);
CREATE INDEX IF NOT EXISTS idx_model_usage_stats_user_date ON public.model_usage_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_feature_usage_stats_user_date ON public.feature_usage_stats(user_id, date);
CREATE INDEX IF NOT EXISTS idx_token_usage_log_user_id ON public.token_usage_log(user_id);
CREATE INDEX IF NOT EXISTS idx_token_usage_log_created_at ON public.token_usage_log(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_reports_user_id ON public.analytics_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_productivity_insights_user_date ON public.productivity_insights(user_id, date);
CREATE INDEX IF NOT EXISTS idx_cost_estimates_user_date ON public.cost_estimates(user_id, date);

-- Enable RLS on all tables
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.model_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.productivity_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cost_estimates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_analytics
CREATE POLICY user_analytics_select ON public.user_analytics
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY user_analytics_insert ON public.user_analytics
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY user_analytics_update ON public.user_analytics
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for chat_metadata
CREATE POLICY chat_metadata_select ON public.chat_metadata
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY chat_metadata_insert ON public.chat_metadata
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY chat_metadata_update ON public.chat_metadata
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for model_usage_stats
CREATE POLICY model_usage_stats_select ON public.model_usage_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY model_usage_stats_insert ON public.model_usage_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY model_usage_stats_update ON public.model_usage_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for feature_usage_stats
CREATE POLICY feature_usage_stats_select ON public.feature_usage_stats
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY feature_usage_stats_insert ON public.feature_usage_stats
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY feature_usage_stats_update ON public.feature_usage_stats
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for token_usage_log
CREATE POLICY token_usage_log_select ON public.token_usage_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY token_usage_log_insert ON public.token_usage_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for analytics_reports
CREATE POLICY analytics_reports_select ON public.analytics_reports
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY analytics_reports_insert ON public.analytics_reports
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY analytics_reports_update ON public.analytics_reports
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for productivity_insights
CREATE POLICY productivity_insights_select ON public.productivity_insights
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY productivity_insights_insert ON public.productivity_insights
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for cost_estimates
CREATE POLICY cost_estimates_select ON public.cost_estimates
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY cost_estimates_insert ON public.cost_estimates
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY cost_estimates_update ON public.cost_estimates
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create helper functions for analytics
CREATE OR REPLACE FUNCTION public.get_daily_analytics(_user_id UUID, _date DATE)
RETURNS TABLE(
  messages_count INTEGER,
  chats_created INTEGER,
  total_tokens_used INTEGER,
  avg_response_time_ms FLOAT,
  models_used TEXT[]
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    messages_count,
    chats_created,
    total_tokens_used,
    avg_response_time_ms,
    ARRAY_AGG(DISTINCT model_used) as models_used
  FROM public.user_analytics
  WHERE user_id = _user_id AND date = _date
  GROUP BY messages_count, chats_created, total_tokens_used, avg_response_time_ms;
$$;

-- Create function to get usage trends
CREATE OR REPLACE FUNCTION public.get_usage_trends(_user_id UUID, _days INTEGER DEFAULT 30)
RETURNS TABLE(
  date DATE,
  messages_count INTEGER,
  tokens_used INTEGER,
  avg_response_time_ms FLOAT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    date,
    messages_count,
    total_tokens_used,
    avg_response_time_ms
  FROM public.user_analytics
  WHERE user_id = _user_id 
    AND date >= CURRENT_DATE - _days
  ORDER BY date ASC;
$$;

-- Create function to get model usage breakdown
CREATE OR REPLACE FUNCTION public.get_model_breakdown(_user_id UUID, _days INTEGER DEFAULT 30)
RETURNS TABLE(
  model_name VARCHAR,
  usage_count INTEGER,
  tokens_used INTEGER,
  cost_usd DECIMAL,
  percentage_of_total FLOAT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH model_stats AS (
    SELECT 
      model_name,
      SUM(usage_count)::INTEGER as usage_count,
      SUM(tokens_used)::INTEGER as tokens_used,
      SUM(cost_estimated) as cost_usd
    FROM public.model_usage_stats
    WHERE user_id = _user_id 
      AND date >= CURRENT_DATE - _days
    GROUP BY model_name
  ),
  total AS (
    SELECT SUM(usage_count) as total_usage
    FROM model_stats
  )
  SELECT 
    ms.model_name,
    ms.usage_count,
    ms.tokens_used,
    ms.cost_usd,
    CASE WHEN t.total_usage > 0 THEN (ms.usage_count::FLOAT / t.total_usage) * 100 ELSE 0 END as percentage_of_total
  FROM model_stats ms, total t
  ORDER BY usage_count DESC;
$$;
