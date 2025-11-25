# Enhanced Trigger System - Complete Implementation Guide

## Overview

The enhanced trigger system provides:
1. **System Prompts for Triggers** - Comprehensive, category-specific system prompts
2. **Long-Form AI Responses** - Triggers generate longer, more detailed responses
3. **Smart Trigger Bar Visibility** - Only custom/registered triggers show UI bars
4. **AI Memory Tracking** - Internal memory of trigger usage without user exposure
5. **Backend Integration** - Memory context sent to APIs without exposing to users

## Architecture

### New Core Files

#### 1. `src/lib/trigger-memory-tracker.ts`
Tracks trigger usage and generates memory context for the AI.

**Key Features:**
- Records every trigger usage with metadata
- Generates memory variable sentences (e.g., "User employed custom triggers: analyze, debate")
- Provides context for AI without exposing to users
- Maintains usage history and statistics

**Usage Example:**
```typescript
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

// Record a trigger use
triggerMemoryTracker.recordTriggerUsage({
  triggerName: 'reason',
  triggerTag: 'reason',
  category: 'Reasoning & Analysis',
  isCustom: false,
  timestamp: Date.now(),
});

// Get memory context for backend
const context = triggerMemoryTracker.getRecentTriggerMemoryContext(10);
// Returns: { usedTriggers, memoryVariablesSentence, ... }
```

#### 2. `src/lib/trigger-system-prompts.ts`
Generates comprehensive system prompts for each trigger with metadata.

**Key Functions:**
- `generateTriggerSystemPrompt()` - Full system prompt for a trigger
- `generateCustomTriggerSystemPrompt()` - For user-created triggers
- `generateBackendSafeSystemPrompt()` - For API calls
- `buildCompleteEnhancedSystemPrompt()` - Multi-trigger support

**Example Output:**
```
# TRIGGER ACTIVATION: REASON
Category: Reasoning & Analysis
Type: Built-in (Server-Side)

## Core Directive
Structure your response as follows: [reasoning]...

## Response Structure
1. **Activation Header** 🔴 Reason Trigger Active | Mode: Reasoning & Analysis
2. **Thinking Section** <reason>...</reason>
3. **Main Response** [Long-form analysis]
4. **Conclusion** [Key takeaways]

## Quality Guidelines
- **Depth**: Provide comprehensive, in-depth responses (not brief)
- **Structure**: Use clear sections and logical flow
...
```

#### 3. `src/lib/trigger-visibility.ts`
Controls which trigger bars are visible in the UI.

**Key Functions:**
- `filterVisibleTriggers()` - Returns only custom/registered triggers
- `shouldShowTriggerBar()` - Checks if trigger should be visible
- `formatTriggerForDisplay()` - Styling and formatting info

**Rule:** Built-in triggers are used internally but don't show UI bars.

#### 4. `src/components/TriggerBarRenderer.tsx`
Smart renderer that only displays visible trigger bars.

**Usage:**
```typescript
import { TriggerBarRenderer } from '@/components/TriggerBarRenderer';

<TriggerBarRenderer
  message={message}
  customTriggerNames={customTriggers}
  registeredTriggerNames={registeredTriggers}
/>
```

#### 5. `src/lib/trigger-backend-integration.ts`
Handles secure communication with backend APIs.

**Key Functions:**
- `buildTriggerAwareRequestPayload()` - Adds trigger metadata to API requests
- `recordTriggerUsageAfterAPICall()` - Logs trigger use
- `prepareChatMessagesWithTriggerContext()` - Prepares messages with context

## How It Works

### 1. Message Flow with Triggers

```
User Message
    ↓
Detect Triggers (detectTriggersAndBuildPrompt)
    ↓
Build System Prompts (buildEnhancedSystemPromptWithMemory)
    ↓
Get Memory Context (triggerMemoryTracker.getRecentTriggerMemoryContext)
    ↓
Prepare API Request (buildTriggerAwareRequestPayload)
    ├─ Add trigger system prompts
    ├─ Add memory variable sentence [INTERNAL]
    ├─ Add selected memory context [INTERNAL]
    └─ Send to OpenRouter/API
    ↓
Receive AI Response
    ↓
Record Trigger Usage (recordTriggerUsageAfterAPICall)
    ├─ Store in triggerMemoryTracker
    └─ Update memory variables for next request
    ↓
Render Trigger Bars
    ├─ Filter via TriggerBarRenderer
    ├─ Show only custom/registered triggers
    └─ Hide built-in trigger bars
```

### 2. Trigger Bar Visibility Logic

**Visible Triggers:**
- Custom triggers (user-created)
- Registered triggers (explicitly registered by admin/system)

**Hidden Triggers:**
- Built-in system triggers (used internally, no UI bar)

**Example:**
```typescript
// Custom trigger "my_special_analysis" - SHOWS BAR
// Built-in trigger "reason" - USES INTERNALLY, NO BAR
// Registered trigger "deep_research" - SHOWS BAR
```

### 3. Memory Context Flow (Transparent to User)

```
Trigger Used
    ↓
triggerMemoryTracker.recordTriggerUsage()
    ├─ Add to history: { triggerName, isCustom, timestamp, ... }
    └─ Generate memory variable sentence
    ↓
Next Request
    ↓
triggerMemoryTracker.getRecentTriggerMemoryContext()
    ├─ Returns: "User employed custom triggers: analyze, debate; with built-in triggers: reason. Last trigger: analyze"
    └─ Add to system prompt [INTERNAL - NOT SHOWN]
    ↓
API Call
    ├─ Include memory context in request
    └─ Send to OpenRouter (hidden from user)
    ↓
Response
    ├─ AI has awareness of trigger usage patterns
    └─ Better context for consistent responses
```

## Enhanced Trigger Interface

### Updated `Trigger` Interface

```typescript
export interface Trigger {
  // Existing fields
  trigger: string;
  category: string;
  system_instruction: string;
  example: string;
  enabled: boolean;
  custom?: boolean;
  tag?: string;
  metadata_support?: boolean;

  // NEW FIELDS
  system_prompt_template?: string;      // Custom system prompt
  trigger_response_format?: string;     // Response format instruction
  is_registered?: boolean;               // True for custom/registered triggers
}
```

## Usage Examples

### Example 1: Using TriggerBarRenderer in ChatArea

```typescript
import { TriggerBarRenderer } from '@/components/TriggerBarRenderer';
import { getAllTriggers } from '@/lib/triggers';

// In your chat component
const allTriggers = getAllTriggers();
const customTriggerNames = allTriggers
  .filter(t => t.custom)
  .map(t => t.trigger);

const registeredTriggerNames = allTriggers
  .filter(t => t.is_registered)
  .map(t => t.trigger);

// Render with visibility control
<TriggerBarRenderer
  message={message}
  customTriggerNames={customTriggerNames}
  registeredTriggerNames={registeredTriggerNames}
/>
```

### Example 2: Recording Trigger Usage

```typescript
import { recordTriggerUsageAfterAPICall } from '@/lib/trigger-backend-integration';
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

// After API call completes
const endTime = Date.now();
const processingTime = endTime - startTime;

recordTriggerUsageAfterAPICall(
  detectedTriggers,
  processingTime,
  selectedMemoryId,
  customTriggerNames
);

// Later, get memory context
const memoryContext = triggerMemoryTracker.getRecentTriggerMemoryContext();
console.log('Memory:', memoryContext.memoryVariablesSentence);
// Output: "User employed custom triggers: analyze; with built-in triggers: reason, debate. Last trigger: analyze."
```

### Example 3: Building Trigger-Aware Request

```typescript
import { buildTriggerAwareRequestPayload } from '@/lib/trigger-backend-integration';

const payload = buildTriggerAwareRequestPayload(
  messages,
  detectedTriggers,
  'gpt-4',
  0.7,
  2000,
  true,  // useMemoryContext
  ['memory-id-1', 'memory-id-2']  // selectedMemoryIds
);

// payload includes:
// - messages with system prompts
// - trigger metadata
// - memory context (internal, not shown to user)
// - selected memory items (internal)

const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

## Memory Variable Sentence Format

The system generates sentences like:

```
"User employed custom triggers: analyze, debate; with built-in triggers: reason, verify. Last trigger: analyze (Reasoning & Analysis)."
```

This is:
- ✅ Generated internally
- ✅ Sent to AI via backend
- ✅ Used for context
- ❌ NOT shown to user
- ❌ NOT exposed in UI

## System Prompt Example

When triggers are detected, the system generates:

```markdown
## Active Triggers & Response Format

### Trigger 1: reason
Category: Reasoning & Analysis
Instruction: Structure your response as follows: <reason>...</reason>

### Trigger 2: analyze
Category: Reasoning & Analysis
Instruction: Break down the topic into key components...

## AI Memory Context (Internal Only)
Trigger Usage: User employed custom triggers: analyze; with built-in triggers: reason.

## Selected Memory Context
- **User Role**: Software Engineer
- **Focus Areas**: Python, Cloud Architecture

## Response Guidelines
- Provide thorough, comprehensive responses to each trigger
- Use structured thinking with appropriate XML tags
- Ensure responses are informative and detailed
- Maintain context from any related memories when relevant
```

## Configuration

### Making Built-In Trigger Visible

```typescript
import { promoteBuiltinToRegistered } from '@/lib/trigger-visibility';

// Promote built-in trigger to registered (makes it visible)
const updatedRegistered = promoteBuiltinToRegistered(
  'reason',
  registeredTriggerNames
);
// Now 'reason' trigger will show a UI bar when detected
```

### Creating Custom Trigger with System Prompt

```typescript
import { Trigger } from '@/lib/triggers';
import { generateTriggerSystemPrompt } from '@/lib/trigger-system-prompts';

const customTrigger: Trigger = {
  trigger: 'my_analysis',
  category: 'Reasoning & Analysis',
  system_instruction: 'Perform custom analysis...',
  example: 'Use "my_analysis" to...',
  enabled: true,
  custom: true,
  is_registered: true,
  trigger_response_format: 'Structured with analysis blocks',
  system_prompt_template: generateTriggerSystemPrompt({
    trigger: 'my_analysis',
    category: 'Reasoning & Analysis',
    system_instruction: 'Perform custom analysis...',
    example: 'Use "my_analysis" to...',
    enabled: true,
    custom: true,
  }),
};

addTrigger(customTrigger);
```

## Monitoring & Analytics

The system provides internal analytics (not shown to user):

```typescript
import { getTriggerStatsForSession } from '@/lib/trigger-backend-integration';

const stats = getTriggerStatsForSession();
// Returns:
// {
//   totalTriggerUses: 42,
//   customTriggerUses: 15,
//   builtInTriggerUses: 27,
//   frequentTriggers: [...],
//   recentMemoryContext: { memoryVariablesSentence: '...' }
// }
```

## Best Practices

1. **Use Memory Context** - Enable memory context for better AI awareness
2. **Register Important Triggers** - Register built-in triggers to show UI bars
3. **Create Meaningful Custom Triggers** - User-created triggers should have clear purposes
4. **Monitor Trigger Usage** - Use analytics to understand patterns (internally)
5. **Update System Prompts** - Regularly refine trigger system prompts for better responses

## API Integration

### OpenRouter Integration

The backend now receives:

```javascript
{
  messages: [
    {
      role: 'system',
      content: '## Active Triggers & Response Format\n...' // Enhanced prompt
    },
    // ... chat messages
  ],
  model: 'gpt-4-turbo',
  temperature: 0.7,
  max_tokens: 2000,
  _metadata: {  // Internal only
    triggers: ['reason', 'analyze'],
    triggerCount: 2,
    memoryContextIncluded: true,
    selectedMemoriesCount: 2,
    timestamp: 1234567890
  }
}
```

## Troubleshooting

### Trigger Bars Not Showing

**Issue:** Trigger bars aren't visible for custom triggers

**Solution:**
1. Check if trigger is marked as `custom: true` or `is_registered: true`
2. Verify trigger name in `customTriggerNames`/`registeredTriggerNames` arrays
3. Use `shouldShowTriggerBar()` to debug visibility

### Memory Context Not Included

**Issue:** Memory context not being sent to API

**Solution:**
1. Ensure `useMemoryContext: true` in `buildTriggerAwareRequestPayload()`
2. Check `triggerMemoryTracker.getHistory()` for recorded usage
3. Verify selected memory IDs are valid

### Long Responses Not Generated

**Issue:** AI responses are still brief even with triggers

**Solution:**
1. Check system prompt includes response format guidance
2. Verify `max_tokens` is set high enough (2000+)
3. Ensure trigger response format is properly configured

## Future Enhancements

1. **Auto-Extract Memory** - Automatically save key facts from AI responses
2. **Trigger Chaining** - Execute multiple triggers in sequence
3. **Conditional Triggers** - Trigger based on context/patterns
4. **Performance Metrics** - Track response quality vs trigger type
5. **ML-Based Trigger Suggestions** - Recommend triggers based on user input
