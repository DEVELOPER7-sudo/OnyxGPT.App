# Quick Fix for Bot System Errors

## The Main Problem
Your Supabase database doesn't have the `bots` table yet.

## The Solution (2 Steps)

### Step 1: Run SQL in Supabase (2 minutes)
1. Go to https://supabase.com and log in
2. Open your project
3. Click **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy ALL of the SQL from: `/RUN_THIS_IN_SUPABASE.sql`
6. Paste it into the editor
7. Click **Run** (blue button)
8. Wait for "Query successful"

### Step 2: Create Storage Bucket (1 minute)
1. In Supabase, click **Storage** (left sidebar)
2. Click **Create new bucket**
3. Name: `bot-avatars`
4. Make it **Public**
5. Click **Create bucket**

## Done!
Refresh your app and everything should work.

---

## What Each Feature Does

| Feature | What It Does | Where |
|---------|------------|-------|
| **Create Bot** | Make a custom AI bot with system prompt | `/bot/create` |
| **Bot Gallery** | Browse all public bots | `/bots` |
| **Public/Private** | Share bots or keep them private | Bot visibility setting |
| **Random Username** | Shows who created the bot | Bot card & welcome message |
| **Model Selection** | Pick which AI model to use | Bot creation form |
| **Edit Bot** | Update bot config & model | Click edit icon on your bots |
| **Delete Bot** | Remove bot permanently | Click delete in edit page |

---

## Troubleshooting

**"Could not find the table 'public.bots'"**
→ Haven't run Step 1 yet

**"Failed to load bots"**
→ Migration hasn't completed, wait 30 seconds and refresh

**"You must be logged in to create a bot"**
→ This is correct - guests cannot create bots

**Theme colors look wrong**
→ Clear cache: Cmd/Ctrl + Shift + Delete, then refresh

**Bot avatar upload fails**
→ Didn't create `bot-avatars` bucket in Step 2

**Can't edit/delete bot**
→ Only the creator can edit - make sure you're logged in with the right account

---

## Files Changed

- `src/services/botService.ts` - Better error messages
- `src/pages/BotsGallery.tsx` - Better error handling
- `src/pages/BotCreator.tsx` - Better error logging
- `src/pages/BotLauncher.tsx` - Shows creator username in welcome

No breaking changes - everything is backward compatible.

