# Trigger Bar Streaming Fix

## Problems Fixed

### Problem 1: Delayed Trigger Bar Display
Previously, trigger bars were only created AFTER the AI closed a trigger tag (`</tag>`). This meant users had to wait for the entire trigger section to be streamed before the trigger bar appeared.

### Problem 2: Content Wrapping in Trigger Bars  
When trigger bars appeared, they would sometimes include content that should be in the main response, causing the final answer to be wrapped/hidden in the trigger bar instead of displayed below.

## Solution
Updated the `parseTriggeredResponse()` function in `src/lib/triggers.ts` to:
1. Detect **immediately opened** trigger tags without waiting for the closing tag
2. Properly separate trigger bar content from the final response using **region tracking**

## Changes Made

**File:** `src/lib/triggers.ts` (complete refactor of parseTriggeredResponse function)

### Implementation Strategy: Region Tracking

Instead of using unreliable regex replacements, the new implementation:

1. **Tracks exact regions** to exclude from clean content:
```typescript
const replacements: Array<{ start: number; end: number }> = [];

// For closed tags
replacements.push({ start: match.index, end: match.index + fullMatch.length });

// For opening tags (only the opening tag marker, not content)
replacements.push({ start: openTag.index, end: openTag.endIndex });
```

2. **Removes regions in reverse order** to maintain indices:
```typescript
const sortedReplacements = replacements.sort((a, b) => b.start - a.start);
for (const replacement of sortedReplacements) {
  cleanContent = cleanContent.substring(0, replacement.start) + cleanContent.substring(replacement.end);
}
```

3. **Detects unclosed tags** without false positives:
```typescript
if (!hasClosingTag && !alreadyExists) {
  // Capture content from opening tag to end of stream
  taggedSegments.push({
    tag: openTag.tagName,
    content: content.substring(openTag.endIndex).trim(),
    startIndex: openTag.index,
    endIndex: content.length,
  });
  // Only remove the opening tag marker
  replacements.push({ start: openTag.index, end: openTag.endIndex });
}
```

## Before vs After

### Before
```
User: "reason about this"
AI Response: "<reason>Let me think..."
   [waiting for closing tag...]
AI Response: "This is my reasoning</reason>\n\nFinal answer"
   ✗ Trigger bar appears (empty initially)
   ✗ Final answer might appear in trigger bar content
```

### After  
```
User: "reason about this"
AI Response: "<reason>Let me think..."
   ✓ Trigger bar appears IMMEDIATELY (populated with opening tag content)
AI Response: "Step 1... Step 2...</reason>"
   ✓ Trigger bar updates with new content in real-time
AI Response: "\n\nFinal answer"
   ✓ Final answer appears in main response area (not wrapped)
```

## Test Results

✅ Immediate unclosed tag detection
✅ Clean content properly separated from trigger bars
✅ Closed trigger tag detection
✅ Multiple mixed tags (both open and closed)
✅ Invalid tags are ignored correctly
✅ Tags with underscores (e.g., `deep_research`) work properly
✅ Prevents duplicate trigger bar creation
✅ No content wrapping in trigger bars

## Technical Details

### Key Changes
1. **Region-based removal**: Replaces regex-based removal for precision
2. **Smart tag detection**: Checks for closing tag presence to distinguish open vs closed
3. **Reverse-order processing**: Prevents index shifting issues
4. **Orphaned tag cleanup**: Only removes closing tags not part of tracked regions

### Affected Files
- `src/lib/triggers.ts` - Core parsing logic refactored
- No UI component changes (CollapsibleTriggerTag works with both open/closed tags)
- No API changes required

## Streaming Behavior

During streaming, as chunks arrive:

1. **Chunk 1**: `<reason>` → Trigger bar appears immediately
2. **Chunk 2**: `<reason>Step 1...` → Trigger bar updates with content
3. **Chunk N**: `...Step 5...` → Trigger bar continues updating
4. **Chunk N+1**: `...</reason>` → Trigger bar shows complete content
5. **Chunk N+2**: `\n\nFinal answer...` → Main response displays clean content

The clean content is built progressively, excluding only trigger tag markers.
