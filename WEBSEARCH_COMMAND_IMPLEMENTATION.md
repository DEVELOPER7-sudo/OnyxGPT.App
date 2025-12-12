# /websearch Command Implementation

## Overview
Added a `/websearch` command that triggers structured web search with mandatory `<websearch>` markdown block formatting and URL listing.

## How It Works

### User Usage
User types in the prompt box:
```
/websearch latest AI developments in 2025
```

The system:
1. Detects the `/websearch` command
2. Extracts the query: `latest AI developments in 2025`
3. Automatically enables web search
4. Sends special system prompt instruction to AI
5. AI responds with structured `<websearch>` block

### Response Format (Mandatory)
```
<websearch>
## URLs Searched

- [TechCrunch](https://techcrunch.com/2025/12/11/ai) - Latest AI industry news
- [OpenAI Blog](https://openai.com/news) - Official announcements
- [ArXiv](https://arxiv.org/recent) - Research papers
- [GitHub Trending](https://github.com/trending) - Popular projects

## Findings

Based on my search of these sources:
[AI's research findings with citations]
</websearch>
```

## Files Changed

### 1. `/src/lib/websearch-formatter.ts` (NEW)
**Purpose**: Web search markdown formatting utilities

**Key Functions**:

#### `generateWebSearchSystemPrompt(query: string): string`
- Creates the system prompt instruction for `/websearch` command
- Enforces mandatory `<websearch>` block format
- Lists all requirements for URL formatting
- Provides example format
- **Key Rule**: "Do NOT use fake/fabricated URLs"

#### `validateWebSearchBlock(content: string): { isValid, errors, foundURLs }`
- Validates websearch markdown format
- Checks for opening/closing tags
- Extracts URLs from markdown links
- Verifies URL descriptions
- Returns validation errors

#### `formatURLsToWebSearchBlock(urls: WebSearchURL[], findings: string): string`
- Converts array of URLs to formatted websearch block
- Organizes URLs by category
- Combines with findings text

#### `extractURLsFromWebSearchBlock(content: string): WebSearchURL[]`
- Parses websearch block and extracts URLs
- Returns structured URL data with descriptions

### 2. `/src/pages/ChatApp.tsx`
**Changes**:

#### Import
```tsx
import { generateWebSearchSystemPrompt } from '@/lib/websearch-formatter';
```

#### New Function: `handleWebSearchCommand`
```tsx
const handleWebSearchCommand = async (
  query: string, 
  chatId: string, 
  messages: Message[]
) => {
  // Extract query from /websearch command
  // Temporarily enable web search
  // Call handleTextChat with web search enabled
  // Restore previous state
}
```

#### Message Handling
```tsx
const isWebSearchCommand = content.trim().startsWith('/websearch');
// ...
if (isWebSearchCommand) {
  const query = content.replace('/websearch', '').trim();
  await handleWebSearchCommand(query, currentChatId, updatedChat.messages);
}
```

#### System Prompt Building
```tsx
if (isWebSearchCommand && webSearchQuery) {
  finalSystemPrompt = `${generateWebSearchSystemPrompt(webSearchQuery)}\n\n${TRIGGER_TAG_ENFORCEMENT_PREFIX}`;
}
```

### 3. `/src/components/ChatArea.tsx`
**Changes**:
- Updated placeholder text to: `"Type a message, /img for images, or /websearch for research..."`
- Users now see hint about `/websearch` command in the input field

## System Prompt Instructions

When `/websearch` command is detected, AI receives:

```
## 🔍 Web Search Command Format

You are executing a /websearch command for: "[query]"

**MANDATORY REQUIREMENTS:**

1. **MUST create a <websearch> block** with this exact structure:
```
<websearch>
## URLs Searched

[List all URLs with descriptions]

## Findings

[Your research answer with citations]
</websearch>
```

2. **List EVERY URL** you search or access
3. **Use full URLs** - not shortened or partial
4. **Add descriptions** - briefly explain what each source is
5. **Keep URLs organized** - group by relevance or category
6. **Cite as you write** - Reference sources in your findings
7. **Close the block properly** - End with </websearch>
8. **No fake URLs** - Only list actual sources you accessed
```

## Key Differences from Toggle

### Web Search Toggle (Settings)
- Optional, user can leave on or off
- Works with any message when enabled
- AI may or may not use web search

### /websearch Command
- **Explicit trigger** - User must type `/websearch`
- **Mandatory format** - AI MUST use `<websearch>` block
- **Forces URL listing** - All URLs must be listed
- **Honesty enforced** - Cannot use fake URLs
- **One-time use** - Auto-enables just for this query
- **Temporary state** - Returns to previous setting after

## Validation

The `websearch-formatter.ts` provides validation:

```tsx
const validation = validateWebSearchBlock(content);

if (!validation.isValid) {
  console.log('Errors:', validation.errors);
  console.log('Found URLs:', validation.foundURLs);
}
```

**Checks**:
- `<websearch>` tags present
- `</websearch>` closing tag
- At least one URL listed
- "URLs Searched" header
- Each URL has description

## Examples

### Example 1: Technology Research
```
User: /websearch latest Python frameworks 2025

Response:
<websearch>
## URLs Searched

- [Real Python](https://realpython.com) - Python tutorials and articles
- [GitHub Trending](https://github.com/trending/python) - Trending Python projects
- [PyPI](https://pypi.org) - Python package registry
- [Hacker News](https://news.ycombinator.com) - Tech community discussions

## Findings

Based on my search, here are the latest Python frameworks...
</websearch>
```

### Example 2: Current Events
```
User: /websearch breaking news today

Response:
<websearch>
## URLs Searched

- [BBC News](https://bbc.com/news) - International news
- [Reuters](https://reuters.com) - Breaking news updates
- [CNN](https://cnn.com) - Current events coverage
- [Associated Press](https://apnews.com) - Wire news service

## Findings

Today's major stories include...
</websearch>
```

## Testing

1. **Type command**:
   ```
   /websearch what are quantum computers
   ```

2. **Verify response**:
   - Should start with `<websearch>`
   - Should have `## URLs Searched` section
   - Should list at least 3-5 URLs
   - Each URL should have markdown format: `[Title](URL)`
   - Should have description after each URL
   - Should close with `</websearch>`

3. **Validate URLs**:
   - All URLs should be clickable
   - No shortened URLs (bit.ly, goo.gl, etc.)
   - No fake/fabricated URLs
   - Real sources that contain the information

4. **Check format**:
   ```tsx
   import { validateWebSearchBlock } from '@/lib/websearch-formatter';
   const validation = validateWebSearchBlock(aiResponse);
   console.log('Valid:', validation.isValid);
   console.log('URLs:', validation.foundURLs);
   ```

## Command Summary

| Command | Purpose | Format | Response |
|---------|---------|--------|----------|
| `/websearch` | Research query | `/websearch [query]` | `<websearch>` block with URLs |
| `/img` | Generate image | `/img [description]` | Generated image |
| Regular message | Normal chat | Any text | Standard response |

## Integration Points

- **ChatApp.tsx**: Command detection and routing
- **ChatArea.tsx**: User input hint
- **websearch-formatter.ts**: Formatting and validation
- **System Prompts**: Enforces format at AI level

## Benefits

1. **Explicit Intent**: User explicitly requests web search
2. **Forced Format**: AI can't skip URL listing
3. **Honesty**: Can't use fake URLs
4. **Transparency**: All sources visible to user
5. **Reusable**: Can validate and extract URLs programmatically
6. **Consistent**: Same format every time
