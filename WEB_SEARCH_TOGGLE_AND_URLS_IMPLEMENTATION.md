# Web Search Toggle and URL Listing Implementation

## Overview
Added a Web Search on/off toggle below the prompt box, and configured AI to list all URLs in `<websearch>` tags only when web search is enabled.

## Changes Made

### 1. UI Component - ChatArea.tsx

**File**: `/src/components/ChatArea.tsx`

**Added**: Web Search Toggle Below Prompt Box (After line 603)
- Toggle switch to enable/disable web search
- Badge showing when enabled with message: "URLs will be listed in <websearch> tags"
- Position: Directly below the input textarea
- Styling: Clean, integrated with existing UI

```tsx
{/* Web Search Toggle Below Prompt Box */}
<div className="flex items-center gap-3 px-1 py-2 border-t border-border/50">
  <div className="flex items-center gap-2">
    <Switch
      checked={webSearchEnabled}
      onCheckedChange={onToggleWebSearch}
      className="h-4 w-8"
    />
    <Label className="text-sm font-medium cursor-pointer hover:text-primary transition-colors">
      Web Search
    </Label>
  </div>
  
  {webSearchEnabled && (
    <Badge variant="secondary" className="text-xs">
      URLs will be listed in &lt;websearch&gt; tags
    </Badge>
  )}
</div>
```

### 2. System Prompt Logic - ChatApp.tsx

**File**: `/src/pages/ChatApp.tsx` (Lines 608-632)

**Added**: Conditional Web Search Instruction
- Only appends web search instruction to system prompt when `webSearchEnabled === true`
- Instruction tells AI to create `<websearch>` block with all URLs
- Format specifies clear URL organization

```tsx
if (webSearchEnabled) {
  const webSearchInstruction = `
## 🔍 Web Search URLs Requirement

When you perform web searches, you MUST:
1. Create a <websearch> block with all URLs listed
2. Format all searched URLs clearly in the block
3. Organize URLs by source type or relevance
4. Close the block with </websearch>

### URL Format in <websearch> tags:
<websearch>
## URLs Searched
- [Source Title](https://url.com) - Brief description
- [Source Title](https://url.com) - Brief description

[Your answer with citations...]
</websearch>

**CRITICAL**: Only use <websearch> tags when actually searching. Show all URLs you accessed.`;
  finalSystemPrompt += webSearchInstruction;
}
```

### 3. System Prompt Template - enhanced-system-prompts.ts

**File**: `/src/lib/enhanced-system-prompts.ts`

**Updated**: WEB_SEARCH_MARKDOWN_FORMAT (Lines 6-57)

Changed from complex multi-phase status format to simple, clear URL listing format:

**Before**: Complex status progression with metadata tables and dynamic updates

**After**: Simple, direct format
```
<websearch>
## URLs Searched

- [Source Title](https://example.com) - Description
- [Source Title](https://example.com) - Description

[Your answer with citations...]
</websearch>
```

**Key Rules Enforced**:
1. ONLY use `<websearch>` tags when actually searching - Never fake it
2. ALWAYS list ALL URLs - Transparency is mandatory
3. Keep organized - Group similar sources together
4. Close properly - End with `</websearch>`
5. Put answer INSIDE block - Citations go in the same block
6. Be honest - If web search is not enabled, DO NOT use this block

## How It Works

### User Perspective
1. User sees toggle below prompt box labeled "Web Search"
2. When toggled ON: Badge appears saying "URLs will be listed in <websearch> tags"
3. When enabled, user asks a research question
4. AI responds with `<websearch>` block containing:
   - List of all URLs searched
   - Their descriptions
   - The answer/findings
   - All organized inside the tags

### System Perspective
1. Toggle state is stored in `webSearchEnabled` state variable
2. When user sends message, `handleOpenRouterChat()` builds system prompt
3. If `webSearchEnabled === true`, adds detailed web search instruction
4. Instruction is sent to API with the message
5. AI follows the instruction and lists URLs in `<websearch>` tags
6. If `webSearchEnabled === false`, NO web search instruction is added (AI doesn't use it)

## Example Response

### When Web Search is ENABLED:
```
<websearch>
## URLs Searched

- [TechCrunch](https://techcrunch.com/2025/12/11/ai) - Latest AI news
- [ArXiv](https://arxiv.org/recent) - Recent research papers
- [GitHub Trending](https://github.com/trending) - Popular projects

Based on my search of recent sources, here are the latest developments in AI...
</websearch>
```

### When Web Search is DISABLED:
```
[No <websearch> tags used]
AI provides answer without web search indication
```

## Testing Instructions

1. **Toggle OFF** (default):
   - Ask AI for current information
   - Should NOT show `<websearch>` tags
   - Should provide normal response

2. **Toggle ON**:
   - Click toggle to enable
   - Badge appears
   - Ask AI for research question
   - Should see `<websearch>` block with URLs listed
   - All URLs should be clickable markdown links
   - Answer should be inside the tags with citations

3. **Verify Honesty**:
   - AI only uses tags when enabled
   - AI lists all URLs accessed
   - No fake/fabricated URLs
   - Proper closing tags

## Integration Points

- **ChatArea.tsx**: UI toggle component
- **ChatApp.tsx**: System prompt building logic
- **enhanced-system-prompts.ts**: Prompt templates and rules
- **All task modes**: Web search instruction works across standard, reasoning, research, creative modes

## Files Modified

1. `/src/components/ChatArea.tsx` - Added toggle UI
2. `/src/pages/ChatApp.tsx` - Added conditional system prompt instruction
3. `/src/lib/enhanced-system-prompts.ts` - Simplified URL format, updated rules
