# Bot System Setup & Testing Checklist

## Pre-Setup Requirements

- [ ] Supabase project created and connected
- [ ] Environment variables set (.env.local with SUPABASE_URL and SUPABASE_ANON_KEY)
- [ ] User authentication working (can log in)

---

## Database Setup

- [ ] Read `BOT_SETUP_INSTRUCTIONS.md`
- [ ] Run `SETUP_BOTS_TABLE.sql` in Supabase SQL Editor
- [ ] Verify `bots` table exists in Supabase Tables list
- [ ] Verify `bot_chats` table exists
- [ ] Check that `bot-avatars` storage bucket exists and is PUBLIC
- [ ] Verify all RLS policies are in place (5 policies on `bots` table)

---

## Code Verification

- [ ] `src/services/botService.ts` has null handling for optional fields
- [ ] `src/pages/BotCreator.tsx` has custom model input field
- [ ] `src/components/BotCard.tsx` has edit button for owners
- [ ] `src/components/Header.tsx` has bots gallery button (visible on mobile)
- [ ] `src/pages/BotsGallery.tsx` has guest user error handling

---

## Feature Testing

### 1. Create Bot ✅
- [ ] Log in with test account
- [ ] Go to `/bots` page
- [ ] Click "Create Bot"
- [ ] Fill minimum required fields:
  - [ ] Bot Name: "Test Bot 1"
  - [ ] System Prompt: "You are helpful"
  - [ ] Model: GPT-5 (or any predefined)
- [ ] Click Create
- [ ] **Expected:** Bot created, redirected to bot launcher

### 2. Create Bot with Custom Model ✅
- [ ] Go to `/bot/create`
- [ ] Fill fields:
  - [ ] Name: "Custom Model Bot"
  - [ ] System Prompt: "Test"
  - [ ] Model: Select "Custom Model"
  - [ ] Custom Model ID: `openrouter:anthropic/claude-3-opus`
- [ ] Click Create
- [ ] **Expected:** Bot created with custom model

### 3. View Bots Gallery ✅
- [ ] As Guest: Visit `/bots` without logging in
  - [ ] Should see public bots only
  - [ ] "Create Bot" button shows error toast
- [ ] As Logged-in User: Visit `/bots`
  - [ ] Should see own bots + public bots
  - [ ] Can see all categories

### 4. Edit Bot ✅
- [ ] Create a bot first
- [ ] In gallery, find your bot
- [ ] Click edit button (pencil icon) on bot card
- [ ] Edit one field (e.g., name or model)
- [ ] Click "Update Bot"
- [ ] **Expected:** Changes saved

### 5. Delete Bot ✅
- [ ] Create a test bot
- [ ] Click edit button
- [ ] Click "Delete" button
- [ ] Confirm deletion
- [ ] **Expected:** Bot deleted, redirected to gallery

### 6. Bot Visibility ✅
- [ ] Create bot and set to **Private**
  - [ ] Guest can't see it
  - [ ] Other users can't see it
  - [ ] You can see it
- [ ] Create bot and set to **Public**
  - [ ] Guest can see it
  - [ ] Other users can see it
  - [ ] Shows in your gallery
- [ ] Create bot and set to **Unlisted**
  - [ ] Only you can see it (via direct link)
  - [ ] Doesn't show in gallery search

### 7. Bot Launch ✅
- [ ] Click on any bot card
- [ ] **Expected:** Redirected to `/bot/{uuid}` launcher
- [ ] Should see bot info bar at top
- [ ] Can create new chat
- [ ] Can send message
- [ ] Model used is the bot's configured model

### 8. Theme Colors ✅
- [ ] Set custom theme color in Settings
- [ ] Go to `/bots` page
- [ ] **Expected:** Theme color applies correctly
- [ ] Go to `/bot/create`
- [ ] **Expected:** Theme color applies correctly
- [ ] Go to bot launcher `/bot/{uuid}`
- [ ] **Expected:** Theme color applies correctly

---

## Mobile Testing

- [ ] Visit `/bots` on mobile
- [ ] Verify bots gallery displays correctly
- [ ] Click bot card - should work
- [ ] Bots button in header visible
- [ ] Create bot form scrollable and usable
- [ ] Buttons are touch-friendly

---

## Error Handling

### Should Show Error Toast

- [ ] Try to create bot without logging in
  - [ ] **Expected:** "You must be logged in" error
- [ ] Try to create bot without name
  - [ ] **Expected:** "Bot name is required" error
- [ ] Try to create bot without system prompt
  - [ ] **Expected:** "System prompt is required" error
- [ ] Try to create custom model without entering model ID
  - [ ] **Expected:** "Please enter a custom model ID" error
- [ ] Try to edit bot you don't own
  - [ ] **Expected:** "Permission denied" error

### Browser Console

- [ ] Open DevTools (F12)
- [ ] Go to Console tab
- [ ] Create a bot
- [ ] **Expected:** Should see `Creating bot with data: {...}` log
- [ ] Should NOT see any red errors

---

## Database Verification

### Check Data in Supabase

1. Go to Supabase Dashboard
2. Click **Table Editor**
3. Select **bots** table
4. **Expected:** See your created bots
5. Verify columns:
   - [ ] uuid (auto-generated)
   - [ ] creator_id (matches your user)
   - [ ] creator_username (random name)
   - [ ] name (your entry)
   - [ ] system_prompt (your entry)
   - [ ] model_id (your selection)
   - [ ] visibility (your selection)
   - [ ] created_at (timestamp)
   - [ ] updated_at (timestamp)
   - [ ] usage_count (0 initially)

---

## Performance Check

- [ ] Load `/bots` page - should load in < 2 seconds
- [ ] Create bot - should submit in < 3 seconds
- [ ] Edit bot - should update in < 3 seconds
- [ ] Delete bot - should delete in < 2 seconds

---

## Summary

**All tests passing?** 🎉

Your bot system is fully functional! You can now:
- ✅ Create bots with any model
- ✅ Edit and delete bots
- ✅ Control visibility (public/private/unlisted)
- ✅ Launch bot chats
- ✅ Track bot usage

**Any tests failing?** See `SUPABASE_SETUP_GUIDE.md` troubleshooting section

---

## Documentation Files

Created for reference:
- `BOT_SETUP_INSTRUCTIONS.md` - Quick 5-minute setup
- `SUPABASE_SETUP_GUIDE.md` - Detailed step-by-step guide
- `BOT_ERROR_FIXES_ACTUAL.md` - Technical error explanations
- `QUICK_FIX_REFERENCE.md` - Summary of fixes
- `SETUP_BOTS_TABLE.sql` - Complete SQL migration script
