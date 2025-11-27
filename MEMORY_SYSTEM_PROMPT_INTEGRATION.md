# Memory System Prompt Integration Guide

## Overview

The system now automatically parses all user-added memories and sends them **in the system prompt** to the AI. This means the AI has immediate access to all your memories without needing to be explicitly asked, enabling more personalized and contextual responses.

## How It Works

### 1. Memory Parsing
When you send a message, the system:
- Retrieves all saved memories from storage
- Generates a comprehensive sentence summarizing your memories
- Organizes memories by category, importance, and recency

### 2. System Prompt Integration
The memory context is added to the system prompt with multiple sections:

```
[INTERNAL MEMORY CONTEXT]
User has saved 15 memories: 5 Work items (3 high priority), 4 Personal notes...
Memory Categories: Work, Personal, Projects, Health
High Priority Items: Python best practices, Morning routine

[SELECTED USER MEMORIES FOR CONTEXT]
- Python best practices: Best practices for writing Python code (high priority)
- Morning routine: Daily routine to follow (medium priority)

[RELEVANT MEMORY SUGGESTIONS]
- Web development tips: Tips for modern web development
- Project goals: Goals for current projects

[MEMORY USAGE GUIDELINES]
- When relevant, reference or build upon user memories naturally
- Use memory context to provide personalized, contextual responses
- Do not explicitly mention that you are using memory
- Maintain consistency with previously stored information
```

### 3. AI Access
The AI can now:
- ✅ Know about your memories immediately
- ✅ Use memories to provide personalized responses
- ✅ Reference your work, interests, and preferences
- ✅ Build context from all stored memories at once
- ✅ Maintain consistency with your stored information

## Key Features

### Automatic Memory Summary
The system generates intelligent sentences like:
```
"User has saved 15 memories: 5 Work items (3 high priority), 
4 Personal notes (2 high priority), 3 Project goals, 2 Health reminders. 
Recently added: Python best practices (high), Morning routine (medium). 
User focus: work-focused, project-oriented."
```

### Multiple Context Sections

1. **Internal Memory Context** - Overall summary of all memories
2. **Selected Memories** - Specific memories chosen for the task (if any)
3. **Relevant Memory Suggestions** - AI-selected memories matching the trigger/topic
4. **Memory Usage Guidelines** - Instructions for the AI on how to use memories

### Trigger-Based Relevance
When you use specific triggers (like `@analyze`, `@research`, `@plan`):
- The system finds memories relevant to that trigger
- Only the most relevant memories are suggested to the AI
- This keeps the system prompt concise while maximizing utility

## Memory Structure

Each memory contains:
```typescript
interface Memory {
  id: string;                           // Unique identifier
  key: string;                          // Memory label/name
  value: string;                        // Memory content
  timestamp: number;                    // Creation date
  category?: string;                    // Work, Personal, Skills, Projects, etc.
  importance?: 'low' | 'medium' | 'high'; // Priority level
  tags?: string[];                      // Search tags
  autoExtracted?: boolean;              // Auto-extracted from responses
}
```

## Memory Categories

Common categories:
- **Work** - Job-related information
- **Personal** - Personal development and life
- **Skills** - Technical and professional skills
- **Projects** - Current projects and goals
- **Health** - Health and wellness information
- **Other** - Miscellaneous information

## Implementation Details

### Files Modified
- `/src/pages/ChatApp.tsx` - Added memory context to system prompt building

### Functions Used
- `buildSystemPromptWithMemoryContext()` - Main function that builds memory sections
- `generateMemoryDetailsSentence()` - Creates the summary sentence
- `getRelevantMemoriesForContext()` - Finds memories relevant to triggers
- `storage.getMemories()` - Retrieves all stored memories

### Memory Integration Flow

```
User sends message
    ↓
Detect triggers & extract memory context
    ↓
Build system prompt with:
  - Base instructions
  - Trigger instructions
  - Memory context (ALL sections)
    ↓
Send to AI with complete context
    ↓
AI responds using memory information
```

## Usage Examples

### Example 1: Work Context
**Memory Stored:**
- Python best practices (Work, high)
- Project X timeline (Work, high)
- Team meeting notes (Work, medium)

**System Prompt Includes:**
```
User has saved 3 Work memories (2 high priority, 1 medium priority).
Recently added: Project X timeline (high), Team meeting notes (medium).

[SELECTED USER MEMORIES FOR CONTEXT]
- Python best practices: Best practices for writing...
- Project X timeline: Timeline for project X...
```

**Result:** AI knows about your work context and can reference Python practices and project timeline naturally.

### Example 2: Creative Task
**Message:** `@brainstorm ideas for a web app`

**Memory Context Included:**
```
[RELEVANT MEMORY SUGGESTIONS]
- Web development tips: Tips for modern web development
- JavaScript patterns: Common patterns in JavaScript
- Project goals: Goals for current projects
```

**Result:** AI brainstorms ideas while aware of your web development interests and project goals.

## Settings & Configuration

### Enable/Disable Memory Context
Memory context is automatically included by default. To disable:
```typescript
// In future updates, this can be controlled via settings
const shouldIncludeMemory = userSettings?.enableMemoryContext !== false;
```

### Memory Selection
You can control which memories are used:
1. **Auto-selected** - System automatically finds relevant memories
2. **All memories** - All memories are summarized in context
3. **Selected** - Choose specific memories for a task (future feature)

## Performance Impact

- **Minimal**: Memory context adds ~2-5% to system prompt size
- **Smart filtering**: Only relevant memories included based on triggers
- **Caching**: Memory summaries could be cached for faster lookups (future optimization)

## Privacy & Security

⚠️ **Important Notes:**
- Memory context is added to the system prompt sent to the AI service
- If using external AI services, memories are sent to their servers
- Memories are stored locally in browser `localStorage`
- Use HTTPS in production to secure data in transit
- Consider what you store in memories (no sensitive passwords/API keys)

## Troubleshooting

### Memories Not Appearing in Response
1. Check that memories are saved (Memory Editor panel)
2. Verify memory categories and importance levels are set
3. Check if memory context is in system prompt (enable dev logs)
4. AI may choose not to reference memories - this is normal

### System Prompt Too Long
1. Remove low-priority memories
2. Use triggers to narrow context
3. Archive/delete old memories
4. Future: implement compression algorithms

### Memory Not Relevant to Task
1. Update memory category to match your tasks
2. Add tags to memories for better relevance detection
3. Set importance level to help prioritization
4. Consider splitting memories into smaller, more specific ones

## Future Enhancements

Planned improvements:
- [ ] Selective memory usage per conversation
- [ ] Memory compression/summarization for very large memory sets
- [ ] Smart memory embedding search
- [ ] Auto-extract and suggest memories from responses
- [ ] Memory versioning and history
- [ ] Share memory contexts between conversations
- [ ] Vector-based relevance matching
- [ ] Memory expiration and archival

## Examples of What AI Can Now Do

With memory context integrated, the AI can:

1. **Remember your preferences**
   - "Based on your morning routine memory, I recommend..."

2. **Reference your projects**
   - "For Project X (which you mentioned should launch by...), consider..."

3. **Use your skills**
   - "Since you know Python well (per your memories), here's a Python solution..."

4. **Maintain consistency**
   - "Following the approach you documented in your memories, we should..."

5. **Personalize responses**
   - "For your work-focused goals, here's a business-oriented approach..."

## API Integration

If using the trigger backend integration, memory context is included as:

```typescript
{
  _metadata: {
    memoryCount: 15,
    memoryDetails: "User has saved 15 memories...",
    selectedMemories: [...],
    memoryMetadata: {
      totalMemories: 15,
      memoriesByCategory: { Work: 5, Personal: 4, ... },
      memoriesByImportance: { high: 6, medium: 5, low: 4 },
      recentlyAdded: [...],
      highImportanceMemories: [...]
    }
  }
}
```

## Summary

The memory system prompt integration is a powerful feature that:
- ✅ Automatically includes all your memories in every AI response
- ✅ Provides context about who you are and what you care about
- ✅ Enables personalized, consistent, and contextual AI responses
- ✅ Works seamlessly with triggers and task modes
- ✅ Improves AI quality by providing rich background information

No configuration needed - just add memories and the AI will use them automatically!
