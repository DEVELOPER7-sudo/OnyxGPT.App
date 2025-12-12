# /websearch Command - Quick Start

## What It Does
Triggers structured web search with mandatory URL listing in `<websearch>` markdown blocks.

## Usage

### Type in Prompt Box
```
/websearch [your research question]
```

### Examples
```
/websearch latest AI news 2025
/websearch Python web frameworks
/websearch how does machine learning work
/websearch quantum computing explained
/websearch stocks market today
```

## Guaranteed Response Format

AI MUST respond with:

```
<websearch>
## URLs Searched

- [Source Name](https://example.com) - What this source is about
- [Source Name](https://example.com) - What this source is about
- [Source Name](https://example.com) - What this source is about

## Findings

[Your research answer based on those sources]
</websearch>
```

## Key Rules

✅ **AI MUST**:
- Create `<websearch>` block
- List EVERY URL searched
- Use full URLs (not shortened)
- Add descriptions for each URL
- Cite sources in findings
- Close with `</websearch>`

❌ **AI CANNOT**:
- Skip URL listing
- Use fake/fabricated URLs
- Use shortened URLs (bit.ly, tinyurl, etc.)
- Hide sources
- Skip the `<websearch>` block

## vs. Web Search Toggle

| Feature | Toggle | /websearch Command |
|---------|--------|------------------|
| Activation | Settings menu | Type `/websearch` |
| Format Required | No | Yes - `<websearch>` mandatory |
| URL Listing | Optional | Required |
| Applies to | All messages when ON | Only that message |
| Default | OFF | N/A |

## Validation

**Valid Response** ✅
```
<websearch>
## URLs Searched

- [TechCrunch](https://techcrunch.com) - Tech industry news
- [OpenAI Blog](https://openai.com/blog) - AI announcements

## Findings

Based on these sources...
</websearch>
```

**Invalid Response** ❌
```
Based on my search, AI is developing rapidly...
(Missing <websearch> block and URLs)
```

## Tips

1. **Be specific** - More specific queries = better results
   - ✅ `/websearch latest GPT-4 improvements 2025`
   - ❌ `/websearch AI`

2. **Ask for sources** - Always get transparent URLs
   - All URLs are listed in block
   - All URLs are clickable
   - All URLs are real sources

3. **Cite findings** - Response includes source citations
   - Each claim linked to a source
   - Easy to verify information
   - Transparent research

## Placeholder Hint

Chat input shows: `"Type a message, /img for images, or /websearch for research..."`

This reminds users of both available commands.

## Technical Details

**Files Involved**:
- `/src/lib/websearch-formatter.ts` - Format definitions
- `/src/pages/ChatApp.tsx` - Command handling
- `/src/components/ChatArea.tsx` - UI hint

**System Prompt Sent**:
- Enforces `<websearch>` format
- Lists all URL requirements
- Prevents fake URLs
- Provides example format

## Commands Overview

```
/img [description]     → Generate image
/websearch [query]     → Research with URL listing
[regular message]      → Normal chat
```

---

**Summary**: Type `/websearch` to get research with guaranteed URL transparency.
