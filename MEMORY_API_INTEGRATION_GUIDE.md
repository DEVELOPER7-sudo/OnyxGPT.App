# Memory API Integration Guide

## Quick Start

### Import the Formatter
```typescript
import { formatMemoriesForAPI } from '@/lib/memory-api-formatter';
import { storage } from '@/lib/storage';
```

### Get Formatted Memory Payload
```typescript
const memories = storage.getMemories();
const payload = formatMemoriesForAPI(memories);
```

### Send to Your Endpoint
```typescript
const response = await fetch('YOUR_ENDPOINT/api/memories', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mindstore: payload
  })
});
```

---

## Complete API Format

### Request Body
```json
{
  "mindstore": {
    "memories": [
      {
        "id": "1702910400000",
        "title": "Favorite Programming Language",
        "content": "Python - for data science and AI projects",
        "category": "Skills",
        "importance": "high",
        "tags": ["programming", "expertise", "preferred"],
        "organization": "Work",
        "createdAt": 1702910400000,
        "autoExtracted": false
      },
      {
        "id": "1702910500000",
        "title": "Favorite Food",
        "content": "Sushi",
        "category": "Personal",
        "importance": "low",
        "tags": ["food", "preference", "casual"],
        "organization": "Personal",
        "createdAt": 1702910500000,
        "autoExtracted": false
      }
    ],
    "metadata": {
      "total": 2,
      "byCategory": {
        "Skills": 1,
        "Personal": 1
      },
      "byImportance": {
        "high": 1,
        "low": 1,
        "medium": 0
      },
      "byOrganization": {
        "Work": 1,
        "Personal": 1
      }
    }
  }
}
```

---

## Memory Entry Details

### Memory Fields
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Unique identifier |
| title | string | Yes | Memory key/name (e.g., "Job Title") |
| content | string | Yes | Memory value (e.g., "Software Engineer") |
| category | string | Yes | Category (Personal, Work, Skills, Goals, etc.) |
| importance | enum | Yes | Priority level: "low", "medium", "high" |
| tags | string[] | No | Array of keywords for searching |
| organization | string | No | Organization/company this memory belongs to |
| createdAt | number | Yes | Unix timestamp of creation |
| expiresAt | number | No | Unix timestamp for expiration (auto-remove) |
| autoExtracted | boolean | Yes | Whether AI auto-extracted this memory |

### Metadata Structure
| Field | Type | Description |
|-------|------|-------------|
| total | number | Total count of memories |
| byCategory | Record<string, number> | Count of memories in each category |
| byImportance | Record<string, number> | Count of memories at each importance level |
| byOrganization | Record<string, number> | Count of memories per organization |

---

## Usage Examples

### Example 1: Simple Memory
```typescript
{
  "title": "Preferred Name",
  "content": "Alex",
  "category": "Personal",
  "importance": "medium",
  "tags": ["name", "personal"],
  "organization": "Personal",
  "createdAt": 1702910400000,
  "autoExtracted": false
}
```

### Example 2: Work Memory
```typescript
{
  "title": "Current Role",
  "content": "Senior Full Stack Engineer at TechCorp",
  "category": "Work",
  "importance": "high",
  "tags": ["job", "current", "title"],
  "organization": "TechCorp",
  "createdAt": 1702910400000,
  "autoExtracted": false
}
```

### Example 3: Skill with Expiration
```typescript
{
  "title": "Current Project Tech Stack",
  "content": "React, Node.js, TypeScript, MongoDB",
  "category": "Skills",
  "importance": "high",
  "tags": ["project", "tech", "active"],
  "organization": "Work",
  "createdAt": 1702910400000,
  "expiresAt": 1704500400000,  // 30 days from creation
  "autoExtracted": false
}
```

---

## Integration in ChatApp.tsx

### Current Implementation
```typescript
import { buildMemoryContextPayload } from '@/lib/memory-context-integration';

// In handleTextChat function:
const memoryContextPayload = buildMemoryContextPayload(selectedMemoryIds);

const response = await puter.ai.chat(formattedMessages, {
  model: modelId,
  stream: true,
  // ... other params
  mindstore: memoryContextPayload  // Sent to API
});
```

### Updated Implementation (Recommended)
```typescript
import { formatMemoriesForAPI } from '@/lib/memory-api-formatter';
import { storage } from '@/lib/storage';

// In handleTextChat function:
const userMemories = storage.getMemories();
const memoryPayload = formatMemoriesForAPI(userMemories);

const response = await puter.ai.chat(formattedMessages, {
  model: modelId,
  stream: true,
  // ... other params
  mindstore: memoryPayload  // Use new formatter
});
```

---

## Organization Presets

Standard organizations available:
- `Personal` - Personal/private memories
- `Work` - Employment/job-related
- `Education` - School/learning
- `Freelance` - Freelance/contract work
- `Startup` - Startup-related
- `Enterprise` - Enterprise/corporate
- `Other` - Miscellaneous

Can be extended in `/src/components/MemoryEditor.tsx`:
```typescript
const ORGANIZATIONS = [
  'Personal',
  'Work',
  'Education',
  'Freelance',
  'Startup',
  'Enterprise',
  'Other',
  // Add custom organizations here
];
```

---

## Category Presets

Available categories:
- `Personal` - Personal information
- `Work` - Work-related
- `Preferences` - User preferences
- `Skills` - Technical/personal skills
- `Goals` - Life/work goals
- `Projects` - Active projects
- `Health` - Health-related
- `Notes` - General notes
- `Other` - Miscellaneous

---

## Filtering & Search

### By Category
```typescript
const workMemories = formatMemoriesForAPI(
  userMemories.filter(m => m.category === 'Work')
);
```

### By Organization
```typescript
const techCorpMemories = formatMemoriesForAPI(
  userMemories.filter(m => m.organization === 'TechCorp')
);
```

### By Importance
```typescript
const importantMemories = formatMemoriesForAPI(
  userMemories.filter(m => m.importance === 'high')
);
```

### By Multiple Filters
```typescript
const relevantMemories = formatMemoriesForAPI(
  userMemories.filter(m => 
    m.category === 'Work' && 
    m.organization === 'TechCorp' && 
    m.importance === 'high'
  )
);
```

---

## Validation

### Check Memory Validity
```typescript
import { isValidUserMemory, filterUserMemories } from '@/lib/memory-api-formatter';

// Check single memory
if (isValidUserMemory(memory)) {
  // Safe to use
}

// Filter all memories to remove invalid ones
const validMemories = filterUserMemories(allMemories);
```

### Prebuilt Content Detection
Automatically rejects memories containing:
- "software developer"
- "python programmer"
- "ai developer"
- "default user"
- "test user"
- Auto-extracted flag set to true (configurable)

---

## Statistics

### Get Memory Stats
```typescript
import { getMemoryStats } from '@/lib/memory-api-formatter';

const stats = getMemoryStats(memories);
// Returns:
{
  totalMemories: 5,
  categories: ['Work', 'Personal', 'Skills'],
  organizations: ['TechCorp', 'Personal'],
  topCategory: 'Work',
  topOrganization: 'TechCorp'
}
```

---

## Clean System Prompt Generation

### Generate Prompt from Memories Only
```typescript
import { buildCleanMemorySystemPrompt } from '@/lib/memory-api-formatter';

const systemPrompt = buildCleanMemorySystemPrompt(memories);
// Never includes prebuilt information
// Safe to inject into AI prompt
```

### Example Generated Prompt
```
[USER MEMORIES]
User has 3 stored memories across categories: Work, Personal, Skills.

[IMPORTANT NOTES]
- Current Role: Senior Full Stack Engineer at TechCorp (high)
- Preferred Language: Python (high)

[ORGANIZATIONS]
- TechCorp
- Personal
```

---

## Error Handling

```typescript
try {
  const payload = formatMemoriesForAPI(memories);
  
  // Validate payload
  if (payload.metadata.total === 0) {
    console.log('No memories to send');
    return;
  }
  
  // Send to API
  const response = await fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ mindstore: payload })
  });
  
  if (!response.ok) {
    throw new Error('Failed to sync memories');
  }
} catch (error) {
  console.error('Memory sync error:', error);
  toast.error('Failed to sync memories with server');
}
```

---

## Best Practices

1. ✅ **Always use `formatMemoriesForAPI()`** - Ensures proper structure
2. ✅ **Filter expired memories** - Done automatically by formatter
3. ✅ **Validate with `isValidUserMemory()`** - Before critical operations
4. ✅ **Include metadata** - Helps backend analytics
5. ✅ **Set organization** - Better memory organization
6. ✅ **Use appropriate importance** - For prioritization
7. ✅ **Add tags** - For better searchability
8. ✅ **Set expiration dates** - For temporary memories

---

## Troubleshooting

### Prebuilt Information Still Appearing
- Clear browser cache/localStorage
- Check `isValidUserMemory()` is filtering correctly
- Verify no auto-extracted memories with prebuilt content
- Use `filterUserMemories()` before sending to API

### Metadata Doesn't Match
- Call `formatMemoriesForAPI()` after each memory change
- Ensure expired memories are cleaned with `storage.cleanExpiredMemories()`
- Verify memory count with `storage.getMemories().length`

### Organization Not Showing
- Ensure memory has `organization` field set
- Check ORGANIZATIONS array includes your organization
- Clear edit mode and refresh memory list

---

**Version**: 2.0
**Last Updated**: December 18, 2025
**Status**: Production Ready
