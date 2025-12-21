# Supabase Bot System Setup Guide

## Error: "Could not find the table 'public.bots' in the schema cache"

This error means the `bots` table doesn't exist in your Supabase database yet. Follow these steps to create it:

---

## Step 1: Set Up Database Tables

1. Go to your **Supabase Project Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. **Copy and paste the entire contents** of `SETUP_BOTS_TABLE.sql` from the project root
5. Click **Run** button
6. Wait for success message (should see "Query complete")

**What this does:**
- Creates `bots` table
- Creates `bot_chats` table
- Sets up indexes for fast queries
- Configures Row Level Security (RLS) policies
- Creates increment function for usage tracking

---

## Step 2: Create Storage Bucket for Bot Avatars

1. In Supabase Dashboard, go to **Storage** (left sidebar)
2. Click **New Bucket**
3. Name it: `bot-avatars`
4. **Enable public access** - toggle ON
5. Click **Create bucket**

This allows bot avatars to be viewable by anyone via public URL.

---

## Step 3: Verify Setup

### Check Tables Exist
1. Go to **Database** → **Tables** in Supabase
2. You should see:
   - `bots` table
   - `bot_chats` table
3. Click on `bots` to verify columns

### Check RLS Policies
1. Click on `bots` table
2. Go to **Authentication** tab
3. Verify you see these policies:
   - "Users can view public bots"
   - "Users can view their own bots"
   - "Users can create bots"
   - "Users can update their own bots"
   - "Users can delete their own bots"

### Check Function Exists
1. Go to **Database** → **Functions**
2. You should see `increment_bot_usage` function

---

## Step 4: Test the Setup

1. Go to your app at `http://localhost:5173/bots`
2. Log in with a test account
3. Click **Create Bot**
4. Fill in:
   - Bot Name: "Test Bot"
   - System Prompt: "You are a helpful assistant"
   - Choose a Category
   - Choose a Model (or custom)
   - Set Visibility
5. Click **Create Bot**

**Expected result:** Bot is created successfully and you're taken to the bot launcher

---

## Troubleshooting

### Still getting "table 'public.bots' not found"
- Refresh your browser
- Check that you're connected to the correct Supabase project
- Verify the SQL script ran without errors

### Bot avatars not loading
- Check that `bot-avatars` bucket exists and is public
- Make sure you uploaded a profile picture when creating the bot
- Check browser console for storage errors

### Can't create bot (RLS error)
- Verify all RLS policies were created
- Make sure you're logged in
- Check that your user UUID matches the creator_id

### Bot creation fails with blank form
- Check browser console (F12) for error messages
- The error message will show what went wrong

---

## Database Schema Overview

### `bots` Table
```
uuid           (PRIMARY KEY)
creator_id     (references auth.users)
creator_username
name           (required)
description    (optional)
category       (optional)
pfp_url        (optional)
system_prompt  (required)
model_id       (default: 'gpt-5')
visibility     (private, unlisted, public)
capabilities   (JSON: memory, files, tools)
created_at
updated_at
usage_count
```

### `bot_chats` Table
```
id             (PRIMARY KEY)
bot_uuid       (references bots)
chat_id        (text)
user_id        (references auth.users)
bot_config     (JSON snapshot of bot at chat creation)
created_at
```

---

## RLS Security Rules

| Action | Who Can | Condition |
|--------|---------|-----------|
| View public bots | Everyone | visibility = 'public' |
| View own bots | Owner only | creator_id = current_user |
| Create bots | Logged-in users | creator_id = current_user |
| Edit bots | Owner only | creator_id = current_user |
| Delete bots | Owner only | creator_id = current_user |

---

## API Endpoints Used

The bot system uses these Supabase queries:

- **Fetch bots:** `SELECT * FROM bots` (RLS filters results)
- **Create bot:** `INSERT INTO bots (...) VALUES (...)`
- **Update bot:** `UPDATE bots SET ... WHERE uuid = ? AND creator_id = ?`
- **Delete bot:** `DELETE FROM bots WHERE uuid = ? AND creator_id = ?`
- **Record usage:** `INSERT INTO bot_chats (...) VALUES (...)`
- **Increment usage:** `SELECT increment_bot_usage(bot_uuid)`

---

## Next Steps

After setup is complete:

1. ✅ Test creating a bot
2. ✅ Test editing a bot
3. ✅ Test deleting a bot
4. ✅ Test launching a bot chat
5. ✅ Test different visibility levels (private, public)
6. ✅ Test with custom model IDs

---

## Support

If you encounter errors:

1. Check the browser console (F12) for detailed error messages
2. Check Supabase dashboard logs
3. Verify the SQL script was fully executed
4. Ensure you're using the correct Supabase project URL and keys

The error messages in the browser console will guide you to the specific issue.
