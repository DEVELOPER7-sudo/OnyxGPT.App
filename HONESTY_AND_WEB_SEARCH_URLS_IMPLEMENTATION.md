# Honesty and Web Search URL Listing Implementation

## Overview
Updated the AI system prompts to enforce two critical behaviors:
1. **Honesty** - Stop claiming features exist without verification
2. **Web Search URL Listing** - Always list the URLs from which AI searched

## Changes Made

### File: `/src/lib/enhanced-system-prompts.ts`

#### 1. Added HONESTY_REQUIREMENT Constant
- **Location**: Line 173
- **Content**: Enforces strict honesty requirements
- **Key Rules**:
  - Only claim features if they actually exist in codebase
  - Be clear about what can and cannot be done
  - Never use "I have it, fix it" without verification
  - Use clear indicators: ✅ YES, ❌ NO, ⚠️ PARTIAL

#### 2. Updated WEB_SEARCH_REQUIREMENTS
- **Added**: URL listing requirement (line 144-149)
- **Format**: "Web Search Results" markdown block with URLs
- **Rule**: ALWAYS list URLs searched with title and description

```markdown
## Web Search Results
- [Title](URL) - Source description
- [Title](URL) - Source description
```

#### 3. Updated All Task Mode Prompts
Applied honesty requirement to all four task modes:
- `standard` - Added HONESTY_REQUIREMENT first
- `reasoning` - Added honesty with logical transparency  
- `research` - Added URL listing requirement (line 338)
- `creative` - Added honesty about speculative vs. proven ideas

#### 4. Updated ENHANCED_SYSTEM_PROMPT_TEMPLATE
- **Order**: HONESTY_REQUIREMENT now comes FIRST (highest priority)
- **Emphasis**: Explicitly notes "Always be honest about what you have and what you can do"

## How It Works

When the AI processes a user request:
1. **Honesty Check First** - Before claiming anything, verify it exists
2. **Web Search** - If searching, use the tools (web_search, read_web_page)
3. **URL Documentation** - List all URLs accessed in "Web Search Results" block
4. **Transparent Answer** - Provide answer with proper citations

## Example Responses

### ✅ CORRECT - Honest with URLs Listed
```
## Web Search Results
- [Example Article](https://example.com/article)
- [Research Paper](https://research.org/paper)

Based on my search...
```

### ❌ WRONG - Claiming without verification
```
"I have that feature implemented, let me fix it"
(without checking the code first)
```

## Testing the Implementation

1. Ask the AI if it has a feature
2. Watch for honest yes/no/partial response
3. Ask for research on current topics
4. Verify "Web Search Results" block appears with URLs

## Integration Points

The changes are integrated into:
- System prompts sent to OpenRouter API
- Memory context integration
- Trigger system prompts
- All task mode handlers

These are applied automatically when generating enhanced system prompts via `generateEnhancedSystemPrompt()`.
