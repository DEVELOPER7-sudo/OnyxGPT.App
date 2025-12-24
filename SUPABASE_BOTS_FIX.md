# Supabase Bots Table Setup - CRITICAL FIX

## Problem
`Error: Could not find the table 'public.bots' in the schema cache`

This means the migration hasn't been applied to your Supabase database.

## Solution

### Option 1: Using Supabase Dashboard (RECOMMENDED)

1. Go to https://supabase.com and log in to your project
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the entire SQL from `/supabase/migrations/20251218_create_bots_table.sql`
5. Click **Run**
6. Verify success - you should see "Query successful"

### Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase migration up
```

## Verification

After running the migration, verify the tables exist:

1. In Supabase Dashboard, go to **Database** → **Tables**
2. You should see:
   - `bots` table
   - `bot_chats` table
   - Both with proper indexes and RLS policies

## If Still Getting Errors

1. Clear browser cache (Cmd/Ctrl + Shift + Delete)
2. Refresh the page
3. Check Supabase logs for any SQL errors
4. Ensure your Supabase project is not paused

## Storage Bucket

Also ensure the `bot-avatars` storage bucket exists:

1. Go to **Storage** in Supabase Dashboard
2. If `bot-avatars` doesn't exist, click **Create new bucket**
3. Name it `bot-avatars`
4. Set it as **Public**
5. Save

