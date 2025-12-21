# Bot System Setup - Quick Start

## Error: "Could not find the table 'public.bots'"

**This means the Supabase database tables haven't been created yet.**

---

## ⚡ Quick Setup (5 minutes)

### 1️⃣ Run the SQL Script

1. Open your **Supabase Project Dashboard**
2. Go to **SQL Editor**
3. Click **New Query**
4. Open file: `SETUP_BOTS_TABLE.sql` from project root
5. Copy ALL the contents
6. Paste into Supabase SQL Editor
7. Click **Run**
8. Wait for success ✅

### 2️⃣ Create Storage Bucket

1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Name: `bot-avatars`
4. Toggle **Public** ON
5. Click **Create**

### 3️⃣ Test It

1. Go to your app `/bots` page
2. Click **Create Bot**
3. Fill form and submit
4. Should work! ✅

---

## What Gets Created

✅ `bots` table - stores all bot configurations  
✅ `bot_chats` table - tracks bot usage  
✅ RLS policies - security rules for who can see what  
✅ `increment_bot_usage` function - counts bot usage  
✅ Indexes - for fast queries  

---

## Key Files

- **SETUP_BOTS_TABLE.sql** - SQL script to run in Supabase
- **SUPABASE_SETUP_GUIDE.md** - Detailed step-by-step guide
- **BOT_ERROR_FIXES_ACTUAL.md** - Technical details of fixes
- **QUICK_FIX_REFERENCE.md** - Error explanations

---

## Troubleshooting

### Still seeing "table not found"?
- Refresh browser (Ctrl+Shift+R)
- Make sure SQL script fully executed
- Check you're in correct Supabase project

### Can't upload bot avatar?
- Verify `bot-avatars` bucket exists
- Check bucket is marked **Public**

### RLS Error when creating bot?
- Make sure you're logged in
- Check all RLS policies exist in Supabase
- Refresh page

---

## Done! 🎉

Your bot system is ready. You can now:
- ✅ Create bots with custom models
- ✅ Edit existing bots
- ✅ Delete bots
- ✅ Make bots public/private
- ✅ Launch bot chats
- ✅ Track bot usage

For detailed docs, see `SUPABASE_SETUP_GUIDE.md`
