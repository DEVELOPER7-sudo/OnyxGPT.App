// Trigger Backend Integration
// Handles communication with backend for trigger processing and memory tracking
// This is transparent to the user - memory context is sent but not displayed

import { DetectedTrigger } from '@/lib/triggers';
import { Message, Memory } from '@/types/chat';
import {
  TriggerMemoryContext,
  triggerMemoryTracker,
  TriggerUsageRecord,
} from '@/lib/trigger-memory-tracker';
import {
  generateBackendSafeSystemPrompt,
  generateMemoryAwareSystemPrompt,
  buildCompleteEnhancedSystemPrompt,
} from '@/lib/trigger-system-prompts';
import {
  buildSystemPromptWithMemoryContext,
  buildMemoryContextPayload,
  shouldIncludeMemoryContext,
  selectMemoriesForTrigger,
} from '@/lib/memory-context-integration';
import { storage } from '@/lib/storage';

/**
 * Build request payload for backend with trigger metadata and memory context
 * Includes memory context and details internally without exposing to user
 */
export const buildTriggerAwareRequestPayload = (
  messages: Message[],
  detectedTriggers: DetectedTrigger[],
  model: string,
  temperature?: number,
  maxTokens?: number,
  useMemoryContext: boolean = true,
  selectedMemoryIds?: string[],
  userSettings?: { enableMemoryContext?: boolean }
) => {
  // Check if memory context should be included
  const includeMemory = useMemoryContext && shouldIncludeMemoryContext(detectedTriggers, userSettings);

  // Get trigger memory context
  let triggerMemoryContext: TriggerMemoryContext | undefined;
  if (includeMemory) {
    triggerMemoryContext = triggerMemoryTracker.getRecentTriggerMemoryContext(10);
  }

  // Get user memory context
  let userMemoryPayload: ReturnType<typeof buildMemoryContextPayload> | undefined;
  let autoSelectedMemoryIds = selectedMemoryIds || [];

  if (includeMemory) {
    // Auto-select relevant memories for each trigger if not manually selected
    if (!selectedMemoryIds || selectedMemoryIds.length === 0) {
      const autoSelected = new Set<string>();
      detectedTriggers.forEach(trigger => {
        const memIds = selectMemoriesForTrigger(trigger, 2);
        memIds.forEach(id => autoSelected.add(id));
      });
      autoSelectedMemoryIds = Array.from(autoSelected);
    }

    userMemoryPayload = buildMemoryContextPayload(autoSelectedMemoryIds);
  }

  // Build system prompt with both trigger and memory context
  let systemPrompt = '';
  
  if (detectedTriggers.length > 0) {
    const triggers = detectedTriggers.map(dt => ({
      trigger: dt.name,
      category: dt.category,
      system_instruction: dt.instruction,
    }));

    // Build base system prompt with triggers
    systemPrompt = buildCompleteEnhancedSystemPrompt(
      triggers as any,
      triggerMemoryContext?.memoryVariablesSentence,
      undefined
    );

    // Add memory context section if enabled
    if (includeMemory && userMemoryPayload) {
      systemPrompt += '\n\n' + buildSystemPromptWithMemoryContext(
        detectedTriggers,
        autoSelectedMemoryIds
      );
    }
  }

  // Add system prompt to messages
  const messagesWithSystem = [
    {
      role: 'system' as const,
      content: systemPrompt,
    },
    ...messages,
  ];

  return {
    messages: messagesWithSystem,
    model,
    temperature: temperature || 0.7,
    max_tokens: maxTokens || 2000,
    // Hidden metadata - not exposed to user
    _metadata: {
      triggers: detectedTriggers.map(t => t.name),
      triggerCount: detectedTriggers.length,
      memoryContextIncluded: includeMemory,
      selectedMemoriesCount: autoSelectedMemoryIds.length,
      memoryDetails: userMemoryPayload?.memoryDetails,
      memoryCount: userMemoryPayload?.memoryCount,
      timestamp: Date.now(),
    },
  };
};

/**
 * Record trigger usage after API call completes
 */
export const recordTriggerUsageAfterAPICall = (
  detectedTriggers: DetectedTrigger[],
  responseProcessingTime?: number,
  selectedMemoryId?: string,
  customTriggerNames: string[] = []
) => {
  detectedTriggers.forEach(trigger => {
    const triggerTag = trigger.tag;
    const isCustom = customTriggerNames.some(
      name => name.toLowerCase() === trigger.name.toLowerCase()
    );

    const record: TriggerUsageRecord = {
      triggerName: trigger.name,
      triggerTag,
      category: trigger.category,
      isCustom,
      timestamp: Date.now(),
      responseProcessingTime,
      selectedMemoryId,
    };

    triggerMemoryTracker.recordTriggerUsage(record);
  });
};

/**
 * Get trigger stats for current session
 * Used for internal analytics, not shown to user
 */
export const getTriggerStatsForSession = () => {
  const history = triggerMemoryTracker.getHistory();
  
  return {
    totalTriggerUses: history.length,
    customTriggerUses: history.filter(h => h.isCustom).length,
    builtInTriggerUses: history.filter(h => !h.isCustom).length,
    frequentTriggers: triggerMemoryTracker.getFrequentTriggers(5),
    recentMemoryContext: triggerMemoryTracker.getRecentTriggerMemoryContext(5),
  };
};

/**
 * Build system message for assistant about trigger processing
 * This is internal context, added to request but not visible
 */
export const buildInternalTriggerContext = (
  detectedTriggers: DetectedTrigger[],
  previousResponses?: number,
  averageResponseLength?: number
): string => {
  if (detectedTriggers.length === 0) return '';

  const triggerNames = detectedTriggers.map(t => t.name).join(', ');
  const categories = [...new Set(detectedTriggers.map(t => t.category))].join(', ');

  let context = `[INTERNAL TRIGGER PROCESSING]\n`;
  context += `Active Triggers: ${triggerNames}\n`;
  context += `Categories: ${categories}\n`;
  context += `Processing Mode: Enhanced Response Format\n`;

  if (previousResponses !== undefined && previousResponses > 0) {
    context += `Previous Responses in Session: ${previousResponses}\n`;
  }

  if (averageResponseLength !== undefined && averageResponseLength > 0) {
    context += `Target Response Length: ${averageResponseLength}+ tokens\n`;
  }

  context += `Instruction: Provide thorough, comprehensive responses when triggers are active.\n`;

  return context;
};

/**
 * Prepare chat messages with trigger context for backend
 * This is called before sending to OpenRouter/API
 */
export const prepareChatMessagesWithTriggerContext = (
  messages: Message[],
  detectedTriggers: DetectedTrigger[],
  includeMemoryContext: boolean = true,
  selectedMemoryIds?: string[]
) => {
  const chatMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  // Build enhanced system prompt
  let systemPrompt = '';
  
  if (detectedTriggers.length > 0) {
    const memoryContext = includeMemoryContext
      ? triggerMemoryTracker.getRecentTriggerMemoryContext()
      : undefined;

    let selectedMemories: Array<{ key: string; value: string; importance?: string }> = [];
    if (selectedMemoryIds && selectedMemoryIds.length > 0) {
      const allMemories = storage.getMemories();
      selectedMemories = allMemories
        .filter(m => selectedMemoryIds.includes(m.id))
        .map(m => ({
          key: m.key,
          value: m.value,
          importance: m.importance,
        }));
    }

    const triggerObjects = detectedTriggers.map(dt => ({
      trigger: dt.name,
      category: dt.category,
      system_instruction: dt.instruction,
    }));

    systemPrompt = buildCompleteEnhancedSystemPrompt(
      triggerObjects as any,
      memoryContext?.memoryVariablesSentence,
      selectedMemories.length > 0 ? selectedMemories : undefined
    );
  }

  // Prepend system prompt if we have triggers
  if (systemPrompt) {
    chatMessages.unshift({
      role: 'system',
      content: systemPrompt,
    });
  }

  return chatMessages;
};

/**
 * Extract and store auto-extracted memory from trigger responses
 * Automatically saves important information from AI responses
 */
export const autoExtractMemoryFromTriggerResponse = (
  response: string,
  triggerName: string,
  confidence: number = 0.8
): Array<{ key: string; value: string }> => {
  const extracted: Array<{ key: string; value: string }> = [];

  // This is a simplified version - in production, you'd use NLP
  // to intelligently extract facts from the response

  // For now, we just return empty array
  // Production implementation would:
  // 1. Parse response for key facts
  // 2. Generate key-value pairs
  // 3. Store with auto_extracted flag and confidence score

  return extracted;
};

/**
 * Send trigger usage analytics to backend
 * This is completely internal and transparent to user
 */
export const sendTriggerAnalyticsToBackend = async (
  userId: string,
  stats: {
    totalTriggerUses: number;
    customTriggerUses: number;
    builtInTriggerUses: number;
  }
) => {
  // This would be an API call to track trigger usage
  // URL would be: /api/triggers/analytics
  // Payload would contain usage statistics

  const payload = {
    userId,
    timestamp: Date.now(),
    stats,
  };

  // In production:
  // try {
  //   await fetch('/api/triggers/analytics', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(payload),
  //   });
  // } catch (error) {
  //   console.error('Failed to send trigger analytics:', error);
  // }

  console.debug('[Trigger Analytics]', payload);
};
