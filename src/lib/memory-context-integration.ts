// Memory Context Integration for Triggers
// Adds memory details to system prompts and API calls without exposing to users

import { Memory } from '@/types/chat';
import { DetectedTrigger } from '@/lib/triggers';
import { storage } from '@/lib/storage';

export interface MemoryContextMetadata {
  totalMemories: number;
  memoriesByCategory: Record<string, number>;
  memoriesByImportance: Record<string, number>;
  recentlyAdded: Memory[];
  highImportanceMemories: Memory[];
  selectedMemoryIds?: string[];
}

export interface MemoryDetailsSentence {
  sentence: string;
  memoryCount: number;
  categories: string[];
  importance: string[];
  metadata: MemoryContextMetadata;
}

/**
 * Generate a comprehensive memory details sentence
 * Format: "User has saved 15 memories: 5 Work items (3 high priority), 4 Personal notes (2 high priority), 3 Project goals, 2 Health reminders, and 1 Other note. Recently added: Python best practices (high), Morning routine (medium). Context: Work-focused with technical interests."
 */
export const generateMemoryDetailsSentence = (): MemoryDetailsSentence => {
  const allMemories = storage.getMemories();
  
  if (allMemories.length === 0) {
    return {
      sentence: '',
      memoryCount: 0,
      categories: [],
      importance: [],
      metadata: {
        totalMemories: 0,
        memoriesByCategory: {},
        memoriesByImportance: {},
        recentlyAdded: [],
        highImportanceMemories: [],
      },
    };
  }

  // Organize by category
  const memoriesByCategory: Record<string, Memory[]> = {};
  allMemories.forEach(mem => {
    const category = mem.category || 'Other';
    if (!memoriesByCategory[category]) {
      memoriesByCategory[category] = [];
    }
    memoriesByCategory[category].push(mem);
  });

  // Organize by importance
  const memoriesByImportance: Record<string, Memory[]> = {
    high: [],
    medium: [],
    low: [],
  };
  allMemories.forEach(mem => {
    const importance = mem.importance || 'low';
    if (memoriesByImportance[importance]) {
      memoriesByImportance[importance].push(mem);
    }
  });

  // Get recently added (last 5)
  const recentlyAdded = allMemories.slice(0, 5);

  // Get high importance memories (up to 3)
  const highImportanceMemories = memoriesByImportance.high.slice(0, 3);

  // Build sentence components
  const parts: string[] = [];

  // Main memory count
  parts.push(`User has saved ${allMemories.length} memories`);

  // Category breakdown
  const categoryParts: string[] = [];
  Object.entries(memoriesByCategory).forEach(([category, mems]) => {
    const highCount = mems.filter(m => m.importance === 'high').length;
    const mediumCount = mems.filter(m => m.importance === 'medium').length;
    
    if (highCount > 0 || mediumCount > 0) {
      categoryParts.push(
        `${mems.length} ${category} ${mems.length === 1 ? 'item' : 'items'} (${highCount} high, ${mediumCount} medium)`
      );
    } else {
      categoryParts.push(`${mems.length} ${category}`);
    }
  });

  if (categoryParts.length > 0) {
    parts.push(`: ${categoryParts.join(', ')}`);
  }

  // Recently added
  if (recentlyAdded.length > 0) {
    const recentLabels = recentlyAdded
      .slice(0, 3)
      .map(m => `${m.key} (${m.importance || 'medium'})`)
      .join(', ');
    parts.push(`. Recently added: ${recentLabels}`);
  }

  // User profile inference
  const profileParts: string[] = [];
  if (memoriesByCategory['Work'] && memoriesByCategory['Work'].length > 0) {
    profileParts.push('work-focused');
  }
  if (memoriesByCategory['Personal'] && memoriesByCategory['Personal'].length > 0) {
    profileParts.push('personal development');
  }
  if (memoriesByCategory['Skills'] && memoriesByCategory['Skills'].length > 0) {
    profileParts.push('skill-building');
  }
  if (memoriesByCategory['Projects'] && memoriesByCategory['Projects'].length > 0) {
    profileParts.push('project-oriented');
  }

  if (profileParts.length > 0) {
    parts.push(`. User focus: ${profileParts.join(', ')}`);
  }

  const sentence = parts.join('') + '.';

  return {
    sentence,
    memoryCount: allMemories.length,
    categories: Object.keys(memoriesByCategory),
    importance: Object.keys(memoriesByImportance).filter(k => memoriesByImportance[k].length > 0),
    metadata: {
      totalMemories: allMemories.length,
      memoriesByCategory: Object.entries(memoriesByCategory).reduce((acc, [key, val]) => {
        acc[key] = val.length;
        return acc;
      }, {} as Record<string, number>),
      memoriesByImportance: Object.entries(memoriesByImportance).reduce((acc, [key, val]) => {
        acc[key] = val.length;
        return acc;
      }, {} as Record<string, number>),
      recentlyAdded,
      highImportanceMemories,
    },
  };
};

/**
 * Build memory context for system prompt (internal use only)
 * This is added to the system prompt but not shown to users
 */
export const buildMemoryContextForSystemPrompt = (): string => {
  const memoryDetails = generateMemoryDetailsSentence();

  if (!memoryDetails.sentence) {
    return '';
  }

  return `[USER MEMORY CONTEXT - INTERNAL ONLY]
${memoryDetails.sentence}

Memory Categories: ${memoryDetails.categories.join(', ')}
High Priority Items: ${memoryDetails.metadata.highImportanceMemories
    .map(m => m.key)
    .join(', ') || 'None'}`;
};

/**
 * Get relevant memories for a specific trigger or topic
 */
export const getRelevantMemoriesForContext = (
  trigger: DetectedTrigger,
  limit: number = 3
): Memory[] => {
  const allMemories = storage.getMemories();

  // Rank memories by relevance to trigger category
  const triggerCategory = trigger.category.toLowerCase();
  const ranked = allMemories.sort((a, b) => {
    // Higher importance first
    const importanceOrder = { high: 3, medium: 2, low: 1 };
    const aImportance = importanceOrder[a.importance || 'low'] || 0;
    const bImportance = importanceOrder[b.importance || 'low'] || 0;

    if (aImportance !== bImportance) {
      return bImportance - aImportance;
    }

    // Then by category relevance
    const aRelevance = (a.category || '').toLowerCase().includes(triggerCategory) ? 1 : 0;
    const bRelevance = (b.category || '').toLowerCase().includes(triggerCategory) ? 1 : 0;

    if (aRelevance !== bRelevance) {
      return bRelevance - aRelevance;
    }

    // Then by recency
    return (b.timestamp || 0) - (a.timestamp || 0);
  });

  return ranked.slice(0, limit);
};

/**
 * Build enhanced system prompt with memory context for triggers
 */
export const buildSystemPromptWithMemoryContext = (
  detectedTriggers: DetectedTrigger[],
  selectedMemoryIds?: string[]
): string => {
  const memoryDetails = generateMemoryDetailsSentence();
  const systemPromptParts: string[] = [];

  // Memory context section
  if (memoryDetails.sentence) {
    systemPromptParts.push('[INTERNAL MEMORY CONTEXT]');
    systemPromptParts.push(memoryDetails.sentence);
    systemPromptParts.push('');
  }

  // Selected memories section
  if (selectedMemoryIds && selectedMemoryIds.length > 0) {
    const allMemories = storage.getMemories();
    const selectedMemories = allMemories.filter(m => selectedMemoryIds.includes(m.id));

    if (selectedMemories.length > 0) {
      systemPromptParts.push('[SELECTED USER MEMORIES FOR CONTEXT]');
      selectedMemories.forEach(mem => {
        systemPromptParts.push(`- ${mem.key}: ${mem.value} (${mem.importance || 'medium'} priority)`);
      });
      systemPromptParts.push('');
    }
  }

  // Trigger-specific memory recommendations
  if (detectedTriggers.length > 0) {
    systemPromptParts.push('[RELEVANT MEMORY SUGGESTIONS]');
    const allRelevantMemories: Memory[] = [];

    detectedTriggers.forEach(trigger => {
      const relevant = getRelevantMemoriesForContext(trigger, 2);
      allRelevantMemories.push(...relevant);
    });

    // Remove duplicates
    const uniqueMemories = Array.from(
      new Map(allRelevantMemories.map(m => [m.id, m])).values()
    ).slice(0, 5);

    if (uniqueMemories.length > 0) {
      uniqueMemories.forEach(mem => {
        systemPromptParts.push(`- ${mem.key}: ${mem.value}`);
      });
    }
    systemPromptParts.push('');
  }

  // Usage guidance
  systemPromptParts.push('[MEMORY USAGE GUIDELINES]');
  systemPromptParts.push('- When relevant, reference or build upon user memories naturally');
  systemPromptParts.push('- Use memory context to provide personalized, contextual responses');
  systemPromptParts.push('- Do not explicitly mention that you are using memory');
  systemPromptParts.push('- Maintain consistency with previously stored information');

  return systemPromptParts.join('\n');
};

/**
 * Select best memories to include in API request based on trigger
 */
export const selectMemoriesForTrigger = (
  trigger: DetectedTrigger,
  limit: number = 3
): string[] => {
  const relevant = getRelevantMemoriesForContext(trigger, limit);
  return relevant.map(m => m.id);
};

/**
 * Create memory variable sentence for internal logging/analytics
 * Similar to trigger memory but for all added memories
 */
export const createMemoryVariableForLogging = (): string => {
  const { sentence } = generateMemoryDetailsSentence();
  return `MEMORY_STATE: ${sentence}`;
};

/**
 * Build complete memory context payload for API
 * Includes all memory-related metadata in structured format
 */
export const buildMemoryContextPayload = (
  selectedMemoryIds?: string[]
): {
  memoryCount: number;
  memoryDetails: string;
  selectedMemories: Array<{ id: string; key: string; value: string; importance?: string }>;
  memoryMetadata: MemoryContextMetadata;
} => {
  const memoryDetails = generateMemoryDetailsSentence();
  const allMemories = storage.getMemories();

  let selectedMemories: typeof allMemories = [];
  if (selectedMemoryIds && selectedMemoryIds.length > 0) {
    selectedMemories = allMemories.filter(m => selectedMemoryIds.includes(m.id));
  }

  return {
    memoryCount: memoryDetails.memoryCount,
    memoryDetails: memoryDetails.sentence,
    selectedMemories: selectedMemories.map(m => ({
      id: m.id,
      key: m.key,
      value: m.value,
      importance: m.importance,
    })),
    memoryMetadata: memoryDetails.metadata,
  };
};

/**
 * Check if memory context should be included in request
 */
export const shouldIncludeMemoryContext = (
  triggers: DetectedTrigger[],
  userSettings?: { enableMemoryContext?: boolean }
): boolean => {
  // Check user setting first
  if (userSettings?.enableMemoryContext === false) {
    return false;
  }

  // Include for analytical/reasoning triggers
  const analyticalTriggers = ['reason', 'analyze', 'debate', 'research', 'plan'];
  return triggers.some(t => analyticalTriggers.includes(t.name.toLowerCase()));
};

/**
 * Auto-extract important information from response and suggest adding to memory
 */
export const suggestMemoryFromResponse = (
  response: string,
  trigger: DetectedTrigger
): Array<{ key: string; value: string; category: string; importance: 'low' | 'medium' | 'high' }> => {
  const suggestions: Array<{ key: string; value: string; category: string; importance: 'low' | 'medium' | 'high' }> = [];

  // This is a basic implementation
  // In production, you'd use NLP to extract meaningful facts

  // For now, return empty (advanced feature for future)
  // When implemented, extract key facts from response automatically

  return suggestions;
};

/**
 * Format memory context for debugging/logging
 */
export const formatMemoryContextForDebug = (): string => {
  const memoryDetails = generateMemoryDetailsSentence();
  const lines: string[] = [];

  lines.push('=== MEMORY CONTEXT DEBUG INFO ===');
  lines.push(`Total Memories: ${memoryDetails.memoryCount}`);
  lines.push(`Categories: ${memoryDetails.categories.join(', ') || 'None'}`);
  lines.push(`Details: ${memoryDetails.sentence}`);
  lines.push('');
  lines.push('Memory Metadata:');
  lines.push(`  By Category: ${JSON.stringify(memoryDetails.metadata.memoriesByCategory, null, 2)}`);
  lines.push(`  By Importance: ${JSON.stringify(memoryDetails.metadata.memoriesByImportance, null, 2)}`);
  lines.push('');
  lines.push('Recently Added:');
  memoryDetails.metadata.recentlyAdded.forEach(mem => {
    lines.push(`  - ${mem.key}: ${mem.value.substring(0, 50)}...`);
  });
  lines.push('');
  lines.push('High Importance Items:');
  memoryDetails.metadata.highImportanceMemories.forEach(mem => {
    lines.push(`  - ${mem.key}: ${mem.value.substring(0, 50)}...`);
  });
  lines.push('=== END DEBUG INFO ===');

  return lines.join('\n');
};
