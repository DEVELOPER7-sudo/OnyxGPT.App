# Create Bot Tables NOW - Copy & Paste Method

## Method 1: Using Supabase Dashboard (Easiest)

### Step 1: Get Your Supabase URL and Key
1. Go to https://supabase.com
2. Log in to your project
3. Click **Settings** → **API** (left sidebar)
4. Copy your **Project URL** and **Anon Key**

### Step 2: Run This Script in Browser Console

Open your browser's Developer Tools (F12) and go to **Console** tab.

Copy and paste this script:

```javascript
// Replace with your actual values
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';

const setupDatabase = async () => {
  try {
    // Create client
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Run SQL to create tables
    const sql = `
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

      CREATE INDEX IF NOT EXISTS idx_bots_creator_id ON public.bots(creator_id);
      CREATE INDEX IF NOT EXISTS idx_bots_visibility ON public.bots(visibility);
      CREATE INDEX IF NOT EXISTS idx_bots_category ON public.bots(category);
      CREATE INDEX IF NOT EXISTS idx_bots_created_at ON public.bots(created_at DESC);

      CREATE TABLE IF NOT EXISTS public.bot_chats (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        bot_uuid UUID NOT NULL REFERENCES public.bots(uuid) ON DELETE CASCADE,
        chat_id TEXT NOT NULL,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        bot_config JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_bot_chats_bot_uuid ON public.bot_chats(bot_uuid);
      CREATE INDEX IF NOT EXISTS idx_bot_chats_user_id ON public.bot_chats(user_id);
      CREATE INDEX IF NOT EXISTS idx_bot_chats_chat_id ON public.bot_chats(chat_id);

      ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.bot_chats ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "Users can view public bots" ON public.bots;
      DROP POLICY IF EXISTS "Users can view their own bots" ON public.bots;
      DROP POLICY IF EXISTS "Users can create bots" ON public.bots;
      DROP POLICY IF EXISTS "Users can update their own bots" ON public.bots;
      DROP POLICY IF EXISTS "Users can delete their own bots" ON public.bots;
      DROP POLICY IF EXISTS "Users can view their own bot_chats" ON public.bot_chats;
      DROP POLICY IF EXISTS "Users can create bot_chats" ON public.bot_chats;

      CREATE POLICY "Users can view public bots"
        ON public.bots FOR SELECT
        USING (visibility = 'public');

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

      CREATE POLICY "Users can view their own bot_chats"
        ON public.bot_chats FOR SELECT
        USING (user_id = auth.uid());

      CREATE POLICY "Users can create bot_chats"
        ON public.bot_chats FOR INSERT
        WITH CHECK (user_id = auth.uid());

      CREATE OR REPLACE FUNCTION public.increment_bot_usage(bot_uuid UUID)
      RETURNS void AS $$
      BEGIN
        UPDATE public.bots
        SET usage_count = usage_count + 1
        WHERE uuid = bot_uuid;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      GRANT EXECUTE ON FUNCTION public.increment_bot_usage(UUID) TO authenticated;
      GRANT EXECUTE ON FUNCTION public.increment_bot_usage(UUID) TO anon;
    `;

    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error:', error);
      console.log('Use Method 2 instead (SQL Editor)');
    } else {
      console.log('✅ Tables created successfully!');
    }
  } catch (e) {
    console.error('Setup failed:', e);
  }
};

setupDatabase();
```

---

## Method 2: Using Supabase SQL Editor (Recommended)

### Step 1: Open SQL Editor
1. Go to your **Supabase Project Dashboard**
2. Click **SQL Editor** in left sidebar
3. Click **New Query**

### Step 2: Copy This SQL

```sql
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bots_creator_id ON public.bots(creator_id);
CREATE INDEX IF NOT EXISTS idx_bots_visibility ON public.bots(visibility);
CREATE INDEX IF NOT EXISTS idx_bots_category ON public.bots(category);
CREATE INDEX IF NOT EXISTS idx_bots_created_at ON public.bots(created_at DESC);

-- Create bot_chats table
CREATE TABLE IF NOT EXISTS public.bot_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bot_uuid UUID NOT NULL REFERENCES public.bots(uuid) ON DELETE CASCADE,
  chat_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  bot_config JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bot_chats indexes
CREATE INDEX IF NOT EXISTS idx_bot_chats_bot_uuid ON public.bot_chats(bot_uuid);
CREATE INDEX IF NOT EXISTS idx_bot_chats_user_id ON public.bot_chats(user_id);
CREATE INDEX IF NOT EXISTS idx_bot_chats_chat_id ON public.bot_chats(chat_id);

-- Enable RLS
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bot_chats ENABLE ROW LEVEL SECURITY;

-- Drop old policies if exist
DROP POLICY IF EXISTS "Users can view public bots" ON public.bots;
DROP POLICY IF EXISTS "Users can view their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can create bots" ON public.bots;
DROP POLICY IF EXISTS "Users can update their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can delete their own bots" ON public.bots;
DROP POLICY IF EXISTS "Users can view their own bot_chats" ON public.bot_chats;
DROP POLICY IF EXISTS "Users can create bot_chats" ON public.bot_chats;

-- RLS Policies for bots
CREATE POLICY "Users can view public bots"
  ON public.bots FOR SELECT
  USING (visibility = 'public');

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

-- Create increment function
CREATE OR REPLACE FUNCTION public.increment_bot_usage(bot_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.bots
  SET usage_count = usage_count + 1
  WHERE uuid = bot_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.increment_bot_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_bot_usage(UUID) TO anon;
```

### Step 3: Run It
1. Paste the SQL above into the editor
2. Click **RUN** button
3. Wait for success message ✅

---

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase (left sidebar)
2. Click **New Bucket**
3. Name: `bot-avatars`
4. Toggle **Public** ON
5. Click **Create bucket**

---

## Done! ✅

Now go back to your app:
1. Log in
2. Visit `/bots`
3. Create a bot
4. Should work! 🎉

---

## If You Get an Error

### "Function exec_sql not found"
Use Method 2 (SQL Editor) instead

### "RLS policies not created"
Drop and recreate them:
```sql
DROP POLICY IF EXISTS "Users can view public bots" ON public.bots;
CREATE POLICY "Users can view public bots"
  ON public.bots FOR SELECT
  USING (visibility = 'public');
```

### Still not working?
Check `SUPABASE_SETUP_GUIDE.md` for detailed troubleshooting

---

**You're all set!** 🚀

The bot system is now ready to use.
