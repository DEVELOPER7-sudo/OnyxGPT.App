# Trigger System - Code Examples & Quick Reference

## Quick Reference - Copy & Paste

### 1. Detect Triggers and Get Enhanced System Prompt

```typescript
import { detectTriggersAndBuildPrompt } from '@/lib/triggers';

const userMessage = "Can you reason through this complex problem?";
const { systemPrompt, detectedTriggers, enhancedSystemPrompt } = detectTriggersAndBuildPrompt(userMessage);

console.log('Detected:', detectedTriggers);
// Output: [{ name: 'reason', tag: 'reason', category: 'Reasoning & Analysis', ... }]

console.log('Enhanced Prompt:', enhancedSystemPrompt);
// Output: System prompt with response format and category-specific guidance
```

### 2. Build Trigger-Aware API Request

```typescript
import { buildTriggerAwareRequestPayload } from '@/lib/trigger-backend-integration';

const payload = buildTriggerAwareRequestPayload(
  messages,        // Chat messages array
  detectedTriggers, // From detectTriggersAndBuildPrompt()
  'gpt-4-turbo',   // Model
  0.7,             // Temperature
  2000,            // Max tokens
  true,            // Use memory context
  ['memory-id-1']  // Selected memory IDs (optional)
);

// Send to API
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
});
```

### 3. Record Trigger Usage After Response

```typescript
import { recordTriggerUsageAfterAPICall } from '@/lib/trigger-backend-integration';

const startTime = Date.now();
// ... process API response ...
const endTime = Date.now();

recordTriggerUsageAfterAPICall(
  detectedTriggers,
  endTime - startTime,    // Response processing time
  selectedMemoryId,       // Memory used (optional)
  customTriggerNames      // Array of custom trigger names
);
```

### 4. Render Trigger Bars (Only Visible Ones)

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

// In your render function:
<TriggerBarRenderer
  message={message}
  customTriggerNames={customTriggerNames}
  registeredTriggerNames={registeredTriggerNames}
/>
```

### 5. Get Memory Context

```typescript
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

// Get recent trigger memory context
const context = triggerMemoryTracker.getRecentTriggerMemoryContext(10);

console.log('Memory Sentence:', context.memoryVariablesSentence);
// Output: "User employed custom triggers: analyze, debate; with built-in triggers: reason, verify."

console.log('Custom Triggers Used:', context.totalCustomTriggers);
console.log('Built-In Triggers Used:', context.totalBuiltInTriggers);
```

### 6. Check If Trigger Should Be Visible

```typescript
import { shouldShowTriggerBar } from '@/lib/trigger-visibility';

const isVisible = shouldShowTriggerBar(
  'my_custom_trigger',
  customTriggerNames,
  registeredTriggerNames
);

if (isVisible) {
  // Show trigger bar in UI
} else {
  // Hide trigger bar (built-in trigger)
}
```

### 7. Create Custom Trigger with System Prompt

```typescript
import { addTrigger } from '@/lib/triggers';
import { generateTriggerSystemPrompt } from '@/lib/trigger-system-prompts';

const customTrigger = {
  trigger: 'my_analysis',
  category: 'Reasoning & Analysis',
  system_instruction: 'Analyze the problem from multiple angles',
  example: 'Use "my_analysis" to get comprehensive problem analysis',
  enabled: true,
  custom: true,
  is_registered: true,  // Shows UI bar
  system_prompt_template: generateTriggerSystemPrompt({
    trigger: 'my_analysis',
    category: 'Reasoning & Analysis',
    system_instruction: 'Analyze the problem from multiple angles',
    example: 'Use "my_analysis" to get comprehensive problem analysis',
    enabled: true,
    custom: true,
  }),
};

addTrigger(customTrigger);
```

### 8. Get Trigger Statistics

```typescript
import { getTriggerStatsForSession } from '@/lib/trigger-backend-integration';

const stats = getTriggerStatsForSession();

console.log(`Total trigger uses: ${stats.totalTriggerUses}`);
console.log(`Custom triggers: ${stats.customTriggerUses}`);
console.log(`Built-in triggers: ${stats.builtInTriggerUses}`);
console.log(`Most used: ${stats.frequentTriggers[0].name}`);
```

## Complete Integration Example

### Full ChatApp Integration

```typescript
import { useState, useEffect } from 'react';
import { detectTriggersAndBuildPrompt } from '@/lib/triggers';
import { buildTriggerAwareRequestPayload, recordTriggerUsageAfterAPICall } from '@/lib/trigger-backend-integration';
import { getAllTriggers } from '@/lib/triggers';

export const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [settings, setSettings] = useState({});

  // Get custom trigger names on mount
  useEffect(() => {
    const triggers = getAllTriggers();
    const customNames = triggers.filter(t => t.custom).map(t => t.trigger);
    // Store or use customNames...
  }, []);

  const handleSendMessage = async (userMessage: string) => {
    // 1. Detect triggers
    const { systemPrompt, detectedTriggers, enhancedSystemPrompt } = 
      detectTriggersAndBuildPrompt(userMessage);

    console.log('Triggers detected:', detectedTriggers.map(t => t.name));

    // 2. Add user message to chat
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];

    // 3. Build API request with trigger metadata
    const payload = buildTriggerAwareRequestPayload(
      updatedMessages,
      detectedTriggers,
      settings.textModel,
      settings.temperature,
      settings.maxTokens,
      true,  // Use memory context
      settings.selectedMemoryIds
    );

    // 4. Call API
    const startTime = Date.now();
    const response = await fetch('/api/chat/openrouter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    const endTime = Date.now();

    // 5. Record trigger usage
    const customTriggers = getAllTriggers()
      .filter(t => t.custom)
      .map(t => t.trigger);

    recordTriggerUsageAfterAPICall(
      detectedTriggers,
      endTime - startTime,
      settings.selectedMemoryId,
      customTriggers
    );

    // 6. Update messages
    setMessages([
      ...updatedMessages,
      { role: 'assistant', content: data.response }
    ]);
  };

  return (
    <div>
      {/* Your chat UI */}
      <button onClick={() => handleSendMessage(userInput)}>Send</button>
    </div>
  );
};
```

### Full ChatArea Integration

```typescript
import { TriggerBarRenderer } from '@/components/TriggerBarRenderer';
import { getAllTriggers } from '@/lib/triggers';
import ReactMarkdown from 'react-markdown';

export const ChatArea = ({ message }) => {
  // Get custom and registered triggers
  const allTriggers = getAllTriggers();
  const customTriggerNames = allTriggers
    .filter(t => t.custom)
    .map(t => t.trigger);
  const registeredTriggerNames = allTriggers
    .filter(t => t.is_registered)
    .map(t => t.trigger);

  // Parse response
  const { cleanContent, taggedSegments } = parseTriggeredResponse(message.content);

  return (
    <div className="message">
      {/* Think sections */}
      {message.thinkContent && (
        <Card className="bg-blue-500/5 border-blue-500/30 mb-4">
          <div className="text-sm text-blue-400 mb-2">
            🧠 Internal Thinking Process
          </div>
          <ReactMarkdown>{message.thinkContent}</ReactMarkdown>
        </Card>
      )}

      {/* Trigger bars - only visible ones */}
      <TriggerBarRenderer
        message={message}
        customTriggerNames={customTriggerNames}
        registeredTriggerNames={registeredTriggerNames}
      />

      {/* Main response */}
      <div className="prose prose-sm dark:prose-invert">
        <ReactMarkdown>{cleanContent}</ReactMarkdown>
      </div>
    </div>
  );
};
```

## Memory Context Examples

### Recording Trigger Usage

```typescript
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

// Record that user used 'reason' trigger
triggerMemoryTracker.recordTriggerUsage({
  triggerName: 'reason',
  triggerTag: 'reason',
  category: 'Reasoning & Analysis',
  isCustom: false,
  timestamp: Date.now(),
  responseProcessingTime: 2500,  // 2.5 seconds
});

// Record that user used custom 'analyze_code' trigger
triggerMemoryTracker.recordTriggerUsage({
  triggerName: 'analyze_code',
  triggerTag: 'analyze_code',
  category: 'Coding & Development',
  isCustom: true,
  timestamp: Date.now(),
  responseProcessingTime: 3200,
});
```

### Getting Memory Context for Next Request

```typescript
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

// Get recent trigger usage
const context = triggerMemoryTracker.getRecentTriggerMemoryContext(5);

// Output:
// {
//   usedTriggers: [
//     { triggerName: 'analyze_code', isCustom: true, ... },
//     { triggerName: 'reason', isCustom: false, ... },
//     ...
//   ],
//   totalCustomTriggers: 1,
//   totalBuiltInTriggers: 2,
//   lastUsedTrigger: { ... },
//   memoryVariablesSentence: "User employed custom triggers: analyze_code; with built-in triggers: reason, verify.",
//   contextualMemories: []
// }

// Use in system prompt:
const systemPrompt = `
Current AI Memory Context (Internal Only):
${context.memoryVariablesSentence}

Continue providing contextual, aware responses based on trigger patterns.
`;
```

## System Prompt Generation Examples

### Default System Prompt Template

```typescript
import { buildDefaultSystemPromptTemplate } from '@/lib/triggers';

const template = buildDefaultSystemPromptTemplate({
  trigger: 'reason',
  category: 'Reasoning & Analysis',
  system_instruction: 'Structure your response with <reason> tags...',
  example: 'Use "reason" to analyze complex problems',
  enabled: true,
});

console.log(template);
// Output:
// ## Trigger: reason (Reasoning & Analysis)
//
// **System Instruction**: Structure your response with <reason> tags...
//
// **Response Format**: 
// - Begin your response by clearly indicating which trigger is active...
// - Provide comprehensive, in-depth analysis...
// ...
```

### Enhanced System Prompt with Memory

```typescript
import { buildEnhancedSystemPromptWithMemory } from '@/lib/triggers';
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

const memoryContext = triggerMemoryTracker.getRecentTriggerMemoryContext();

const enhanced = buildEnhancedSystemPromptWithMemory(
  detectedTriggers,
  memoryContext.memoryVariablesSentence,
  [
    { key: 'User Role', value: 'Senior Python Developer' },
    { key: 'Focus Areas', value: 'System Design, Performance' }
  ]
);

console.log(enhanced);
// Output:
// ## Active Triggers & Response Format
//
// ### Trigger 1: reason
// Category: Reasoning & Analysis
// ...
//
// ## AI Memory Context (Internal Only)
//
// Trigger Usage: User employed custom triggers...
//
// ## Selected Memory Context
// - **User Role**: Senior Python Developer
// - **Focus Areas**: System Design, Performance
//
// ## Response Guidelines
// ...
```

## Testing Examples

### Test Trigger Detection

```typescript
import { detectTriggersAndBuildPrompt } from '@/lib/triggers';

describe('Trigger Detection', () => {
  test('detects reason trigger', () => {
    const { detectedTriggers } = detectTriggersAndBuildPrompt(
      'Can you reason through this?'
    );
    
    expect(detectedTriggers).toContainEqual(
      expect.objectContaining({ name: 'reason' })
    );
  });

  test('detects multiple triggers', () => {
    const { detectedTriggers } = detectTriggersAndBuildPrompt(
      'Reason through this and analyze the data'
    );
    
    expect(detectedTriggers).toHaveLength(2);
    expect(detectedTriggers.map(t => t.name)).toEqual(
      expect.arrayContaining(['reason', 'analyze'])
    );
  });
});
```

### Test Visibility Logic

```typescript
import { shouldShowTriggerBar } from '@/lib/trigger-visibility';

describe('Trigger Visibility', () => {
  test('shows custom triggers', () => {
    const isVisible = shouldShowTriggerBar(
      'my_trigger',
      ['my_trigger'],  // customTriggerNames
      []               // registeredTriggerNames
    );
    
    expect(isVisible).toBe(true);
  });

  test('hides built-in triggers', () => {
    const isVisible = shouldShowTriggerBar(
      'reason',
      [],  // customTriggerNames
      []   // registeredTriggerNames
    );
    
    expect(isVisible).toBe(false);
  });

  test('shows registered triggers', () => {
    const isVisible = shouldShowTriggerBar(
      'reason',
      [],           // customTriggerNames
      ['reason']    // registeredTriggerNames
    );
    
    expect(isVisible).toBe(true);
  });
});
```

### Test Memory Tracking

```typescript
import { triggerMemoryTracker } from '@/lib/trigger-memory-tracker';

describe('Memory Tracking', () => {
  beforeEach(() => {
    triggerMemoryTracker.clearHistory();
  });

  test('records trigger usage', () => {
    triggerMemoryTracker.recordTriggerUsage({
      triggerName: 'reason',
      triggerTag: 'reason',
      category: 'Reasoning & Analysis',
      isCustom: false,
      timestamp: Date.now(),
    });

    const history = triggerMemoryTracker.getHistory();
    expect(history).toHaveLength(1);
    expect(history[0].triggerName).toBe('reason');
  });

  test('generates memory variable sentence', () => {
    triggerMemoryTracker.recordTriggerUsage({
      triggerName: 'analyze',
      triggerTag: 'analyze',
      category: 'Reasoning & Analysis',
      isCustom: true,
      timestamp: Date.now(),
    });

    const context = triggerMemoryTracker.getRecentTriggerMemoryContext();
    expect(context.memoryVariablesSentence).toContain('analyze');
    expect(context.memoryVariablesSentence).toContain('custom');
  });
});
```

## Common Patterns

### Pattern 1: Auto-Detect and Enhance

```typescript
// Automatically enhance prompts when triggers detected
const enhanceIfTriggered = (userMessage: string) => {
  const { enhancedSystemPrompt, detectedTriggers } = 
    detectTriggersAndBuildPrompt(userMessage);

  if (detectedTriggers.length > 0) {
    console.log(`🔴 ${detectedTriggers.length} trigger(s) detected`);
    return { enhancedSystemPrompt, detectedTriggers };
  }

  return { enhancedSystemPrompt: '', detectedTriggers: [] };
};
```

### Pattern 2: Conditional Memory Usage

```typescript
// Use memory context only for certain triggers
const shouldUseMemory = (detectedTriggers) => {
  const aiModeningTriggers = ['reason', 'analyze', 'debate'];
  return detectedTriggers.some(t => 
    aiModeningTriggers.includes(t.name)
  );
};

const payload = buildTriggerAwareRequestPayload(
  messages,
  detectedTriggers,
  model,
  temperature,
  maxTokens,
  shouldUseMemory(detectedTriggers)  // Conditional
);
```

### Pattern 3: Visible Trigger Statistics

```typescript
// Show user which triggers will show bars
const getVisibleTriggerInfo = (detectedTriggers, custom, registered) => {
  const visible = detectedTriggers.filter(t =>
    shouldShowTriggerBar(t.name, custom, registered)
  );

  return {
    total: detectedTriggers.length,
    visible: visible.length,
    hidden: detectedTriggers.length - visible.length,
    visibleTriggers: visible.map(t => t.name),
  };
};
```

## Debugging

### Enable Debug Logging

```typescript
// In development
if (import.meta.env.DEV) {
  console.log('=== TRIGGER DEBUG ===');
  console.log('User message:', userMessage);
  console.log('Detected triggers:', detectedTriggers);
  console.log('Enhanced prompt:', enhancedSystemPrompt);
  console.log('Memory context:', triggerMemoryTracker.getRecentTriggerMemoryContext());
  console.log('==================');
}
```

### Check System Health

```typescript
const checkTriggerHealth = () => {
  const triggers = getAllTriggers();
  const memory = triggerMemoryTracker.getRecentTriggerMemoryContext();
  
  return {
    totalTriggers: triggers.length,
    customTriggers: triggers.filter(t => t.custom).length,
    registeredTriggers: triggers.filter(t => t.is_registered).length,
    memoryUsages: memory.usedTriggers.length,
    lastTrigger: memory.lastUsedTrigger?.triggerName,
  };
};

console.log(checkTriggerHealth());
```

That's the complete code reference! Copy and paste examples as needed.
