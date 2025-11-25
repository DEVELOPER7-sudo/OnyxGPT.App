# Trigger System Integration Guide

## Quick Start - 5 Steps to Enable

### Step 1: Update ChatApp.tsx Message Handler

In `src/pages/ChatApp.tsx`, update the `handleOpenRouterChat` function:

```typescript
import { detectTriggersAndBuildPrompt } from '@/lib/triggers';
import { buildTriggerAwareRequestPayload, recordTriggerUsageAfterAPICall } from '@/lib/trigger-backend-integration';
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

// In your chat message handler
const { systemPrompt, detectedTriggers, enhancedSystemPrompt } = detectTriggersAndBuildPrompt(userMessage);

// Build API request with trigger metadata
const requestPayload = buildTriggerAwareRequestPayload(
  [
    // Add your system message if needed
    ...messages,
  ],
  detectedTriggers,
  settings.textModel,
  settings.temperature,
  settings.maxTokens,
  true, // useMemoryContext
  selectedMemoryIds // if available
);

// Send to API
const response = await fetch('/api/chat/openrouter', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
  body: JSON.stringify(requestPayload),
});

// After response received
const startTime = Date.now();
// ... process response ...
const endTime = Date.now();

// Record trigger usage
recordTriggerUsageAfterAPICall(
  detectedTriggers,
  endTime - startTime,
  selectedMemoryId,
  customTriggerNames
);
```

### Step 2: Update ChatArea.tsx to Use TriggerBarRenderer

```typescript
import { TriggerBarRenderer } from '@/components/TriggerBarRenderer';
import { getAllTriggers } from '@/lib/triggers';

// Get custom and registered trigger names
const allTriggers = getAllTriggers();
const customTriggerNames = allTriggers
  .filter(t => t.custom)
  .map(t => t.trigger);

const registeredTriggerNames = allTriggers
  .filter(t => t.is_registered)
  .map(t => t.trigger);

// Replace the old trigger tag rendering with
<TriggerBarRenderer
  message={message}
  customTriggerNames={customTriggerNames}
  registeredTriggerNames={registeredTriggerNames}
/>

// This automatically:
// - Only shows custom/registered trigger bars
// - Hides built-in trigger bars
// - Maintains all existing functionality
```

### Step 3: Store Custom Trigger Metadata

When a user creates a custom trigger, include metadata:

```typescript
import { generateTriggerSystemPrompt } from '@/lib/trigger-system-prompts';

const createCustomTrigger = (name: string, instruction: string) => {
  const newTrigger: Trigger = {
    trigger: name,
    category: 'Reasoning & Analysis',
    system_instruction: instruction,
    example: `Use "${name}" to...`,
    enabled: true,
    custom: true,
    is_registered: true, // Mark as registered to show UI bar
    system_prompt_template: generateTriggerSystemPrompt({
      trigger: name,
      category: 'Reasoning & Analysis',
      system_instruction: instruction,
      example: `Use "${name}" to...`,
      enabled: true,
      custom: true,
    }),
  };

  addTrigger(newTrigger);
};
```

### Step 4: Initialize Memory Tracker on App Load

In `ChatApp.tsx` useEffect:

```typescript
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

useEffect(() => {
  // Initialize trigger memory tracker
  triggerMemoryTracker.clearHistory();
  
  // Load user's custom triggers
  const allTriggers = getAllTriggers();
  console.log(`Loaded ${allTriggers.length} triggers`);
  console.log(`Custom: ${allTriggers.filter(t => t.custom).length}`);
  console.log(`Registered: ${allTriggers.filter(t => t.is_registered).length}`);
}, []);
```

### Step 5: Display Memory Context (Optional - Internal Only)

For debugging/analytics (not shown to users):

```typescript
import { getTriggerStatsForSession } from '@/lib/trigger-backend-integration';

// In a debug console or analytics view
const stats = getTriggerStatsForSession();
console.log('Trigger Stats:', {
  totalUses: stats.totalTriggerUses,
  customUses: stats.customTriggerUses,
  builtInUses: stats.builtInTriggerUses,
  frequentTriggers: stats.frequentTriggers,
  memoryContext: stats.recentMemoryContext.memoryVariablesSentence,
});
```

## Detailed Integration Points

### 1. Message Detection & Processing

**File:** `src/pages/ChatApp.tsx` (in `handleOpenRouterChat` function)

```typescript
// BEFORE: Old system
const { systemPrompt, detectedTriggers } = detectTriggersAndBuildPrompt(userMessage);
// systemPrompt is basic, no memory context

// AFTER: New system
const { systemPrompt, detectedTriggers, enhancedSystemPrompt } = detectTriggersAndBuildPrompt(userMessage);
// enhancedSystemPrompt includes response format guidance
// systemPrompt remains for compatibility
```

### 2. API Request Building

**File:** `src/pages/ChatApp.tsx`

```typescript
// BEFORE
const response = await fetch('...', {
  body: JSON.stringify({ messages, model, temperature, max_tokens }),
});

// AFTER
const requestPayload = buildTriggerAwareRequestPayload(
  messages,
  detectedTriggers,
  model,
  temperature,
  maxTokens,
  true,
  selectedMemoryIds
);

const response = await fetch('...', {
  body: JSON.stringify(requestPayload),
});
```

### 3. Trigger Bar Rendering

**File:** `src/components/ChatArea.tsx`

```typescript
// BEFORE: Shows all trigger bars
{message.taggedSegments && message.taggedSegments.map(segment => (
  <CollapsibleTriggerTag ... />
))}

// AFTER: Only shows visible triggers
<TriggerBarRenderer
  message={message}
  customTriggerNames={customTriggerNames}
  registeredTriggerNames={registeredTriggerNames}
/>
```

### 4. Memory Recording

**File:** `src/pages/ChatApp.tsx` (after API response)

```typescript
// Record that triggers were used
recordTriggerUsageAfterAPICall(
  detectedTriggers,
  responseTime,
  selectedMemoryId,
  customTriggerNames
);

// This enables:
// - Memory variable generation
// - Usage statistics
// - Frequency tracking
// - Context for next requests
```

## Configuration Options

### Enable/Disable Memory Context

```typescript
const requestPayload = buildTriggerAwareRequestPayload(
  messages,
  detectedTriggers,
  model,
  temperature,
  maxTokens,
  false,  // Set to false to disable memory context
  selectedMemoryIds
);
```

### Select Specific Memories for Context

```typescript
// Pass selected memory IDs
const selectedMemoryIds = ['memory-1', 'memory-2', 'memory-3'];

const requestPayload = buildTriggerAwareRequestPayload(
  messages,
  detectedTriggers,
  model,
  temperature,
  maxTokens,
  true,
  selectedMemoryIds  // Only these memories included in context
);
```

### Customize System Prompt Template

```typescript
const customPrompt = generateCustomTriggerSystemPrompt(
  myCustomTrigger,
  `Custom instructions: Always provide examples and explain thoroughly`,
  true  // includeMemory
);
```

## Testing Integration

### Test 1: Verify Triggers Are Detected

```typescript
const message = "Can you reason through this problem?";
const { detectedTriggers } = detectTriggersAndBuildPrompt(message);
console.log(detectedTriggers);
// Should show: [{ name: 'reason', tag: 'reason', category: '...', ... }]
```

### Test 2: Verify Trigger Bar Visibility

```typescript
const customTriggers = ['my_trigger'];
const registered = [];

const isVisible = shouldShowTriggerBar('my_trigger', customTriggers, registered);
console.log(isVisible); // Should be true

const isHidden = shouldShowTriggerBar('reason', customTriggers, registered);
console.log(isHidden); // Should be false (built-in)
```

### Test 3: Verify Memory Context

```typescript
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

// Record a trigger
triggerMemoryTracker.recordTriggerUsage({
  triggerName: 'reason',
  triggerTag: 'reason',
  category: 'Reasoning & Analysis',
  isCustom: false,
  timestamp: Date.now(),
});

// Get context
const context = triggerMemoryTracker.getRecentTriggerMemoryContext();
console.log(context.memoryVariablesSentence);
// Should output: "User employed ... with built-in triggers: reason."
```

### Test 4: Verify Request Payload

```typescript
const payload = buildTriggerAwareRequestPayload(
  messages,
  detectedTriggers,
  'gpt-4',
  0.7,
  2000,
  true
);

console.log(payload);
// Should include:
// - messages with system prompt prepended
// - _metadata with trigger info
// - memory context in system prompt
```

## Troubleshooting Checklist

- [ ] `detectTriggersAndBuildPrompt()` returns enhanced system prompt
- [ ] `TriggerBarRenderer` only shows custom/registered triggers
- [ ] `buildTriggerAwareRequestPayload()` includes trigger metadata
- [ ] Memory context is added to system prompt (internal)
- [ ] `recordTriggerUsageAfterAPICall()` is called after each response
- [ ] Custom triggers have `is_registered: true`
- [ ] No TypeScript errors with new interfaces
- [ ] Trigger system prompts are comprehensive and detailed

## Performance Considerations

1. **Memory History Size** - Default 100 records, configurable in `trigger-memory-tracker.ts`
2. **System Prompt Size** - Enhanced prompts are ~500-1000 tokens
3. **API Overhead** - Minimal (<50ms) for building payloads
4. **Storage** - Trigger history stored in memory (not persisted)

## Security Notes

⚠️ **Important:** Memory context is:
- ✅ Internal only (not shown to users)
- ✅ Sent to AI via backend
- ✅ Not persisted to localStorage
- ✅ Not exposed in UI

The `_metadata` field in requests is informational only and doesn't affect API functionality.

## Next Steps

1. **Implement Steps 1-5** above
2. **Test with sample triggers** (run tests from testing section)
3. **Monitor logs** for trigger detection and recording
4. **Adjust system prompts** based on response quality
5. **Consider auto-memory extraction** (future enhancement)

## Support

For issues or questions:
1. Check TRIGGER_SYSTEM_ENHANCED.md for detailed documentation
2. Review trigger detection in `src/lib/triggers.ts`
3. Check ChatApp.tsx for message handling
4. Verify custom triggers have correct metadata
