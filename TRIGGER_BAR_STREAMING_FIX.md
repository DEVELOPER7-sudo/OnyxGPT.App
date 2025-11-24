# Trigger Bar Streaming Fix

## Problem
Previously, trigger bars were only created AFTER the AI closed a trigger tag (`</tag>`). This meant users had to wait for the entire trigger section to be streamed before the trigger bar appeared.

## Solution
Updated the `parseTriggeredResponse()` function in `src/lib/triggers.ts` to detect **immediately opened** trigger tags without waiting for the closing tag.

### Changes Made

**File:** `src/lib/triggers.ts` (lines 680-709)

**Old Behavior:**
- Only detected completed closed tags: `<tag>content</tag>`
- Only checked for unclosed tags at the END of the streamed content

**New Behavior:**
- Detects BOTH:
  1. Fully closed tags: `<tag>content</tag>`
  2. Immediately opened tags: `<tag>content streaming...` (no closing tag yet)
- Creates trigger bars in real-time as soon as `<tag>` appears
- Continues to update content as more text streams in

### Implementation Details

```typescript
// Detect any opening tag that doesn't have a corresponding closing tag
const allOpeningsRegex = /<([a-zA-Z_][a-zA-Z0-9_]*)>/g;
let openingMatch;

while ((openingMatch = allOpeningsRegex.exec(content)) !== null) {
  const tagName = openingMatch[1];
  const closingTag = `</${tagName}>`;
  
  // Only process valid trigger tags
  if (isValidTriggerTag(tagName) && !isInsideCodeBlock(content, openingMatch.index)) {
    // Check if this tag has a closing counterpart and if it's not already in taggedSegments
    const hasClosingTag = content.includes(closingTag);
    const alreadyExists = taggedSegments.some(seg => seg.tag === tagName);
    
    if (!hasClosingTag && !alreadyExists) {
      // This is an opening tag without a closing tag - capture it immediately
      const openingIndex = openingMatch.index;
      const openingTagEnd = openingMatch.index + openingMatch[0].length;
      const contentAfterTag = content.substring(openingTagEnd).trim();
      
      taggedSegments.push({
        tag: tagName,
        content: contentAfterTag,
        startIndex: openingIndex,
        endIndex: content.length,
      });
    }
  }
}
```

## Benefits

1. **Immediate Feedback:** Users see trigger bars appear as soon as the opening tag is streamed
2. **Better UX:** No longer need to wait for closing tag to see the trigger bar
3. **Real-time Updates:** Trigger bar content updates as more text is streamed
4. **Backward Compatible:** Still fully supports closed tags and all existing functionality

## Test Results

✅ Single closed trigger tag detection
✅ Single open trigger tag detection (streaming)
✅ Multiple mixed tags (both open and closed)
✅ Invalid tags are ignored correctly
✅ Tags with underscores (e.g., `deep_research`) work properly
✅ Prevents duplicate trigger bar creation

## How It Works in Practice

### Before Fix
```
User: "reason about this"
AI Response streaming: "<reason>Let me think..."
   [waiting...]
AI Response continues: "This is my reasoning</reason>"
   ✓ Trigger bar appears NOW (after closing tag)
```

### After Fix
```
User: "reason about this"
AI Response streaming: "<reason>Let me think..."
   ✓ Trigger bar appears IMMEDIATELY (on opening tag)
AI Response continues: "This is my reasoning</reason>"
   ✓ Trigger bar updates with new content
```

## Affected Files

- `src/lib/triggers.ts` - Core parsing logic updated
- No UI component changes needed (CollapsibleTriggerTag works with both open/closed)
- No API changes required

## Testing

The fix has been tested with:
- Edge cases for various tag combinations
- Invalid tag filtering
- Underscore tag names (deep_research, fact_check)
- Code block detection (tags inside code blocks still ignored)
- Multiple trigger tags in single response

All tests passing.
