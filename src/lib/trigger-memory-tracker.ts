// Trigger Memory Tracker - Tracks trigger usage and generates AI context
// This is internal to the backend and not exposed to users

export interface TriggerUsageRecord {
  triggerName: string;
  triggerTag: string;
  category: string;
  isCustom: boolean;
  timestamp: number;
  responseProcessingTime?: number;
  memoryContext?: string[];
  selectedMemoryId?: string;
}

export interface TriggerMemoryContext {
  usedTriggers: TriggerUsageRecord[];
  totalCustomTriggers: number;
  totalBuiltInTriggers: number;
  lastUsedTrigger?: TriggerUsageRecord;
  memoryVariablesSentence: string;
  contextualMemories: Array<{ key: string; value: string; importance?: string }>;
}

class TriggerMemoryTracker {
  private usageHistory: TriggerUsageRecord[] = [];
  private maxHistorySize = 100; // Keep last 100 trigger usages

  /**
   * Record a trigger usage event
   */
  recordTriggerUsage(record: TriggerUsageRecord): void {
    this.usageHistory.unshift(record); // Add to front (most recent first)
    
    // Maintain history size
    if (this.usageHistory.length > this.maxHistorySize) {
      this.usageHistory = this.usageHistory.slice(0, this.maxHistorySize);
    }
  }

  /**
   * Generate memory variable sentence from trigger usage
   * Format: "User's triggers used: [custom_trigger_1], [custom_trigger_2], with built-in triggers: [builtin_1]. Last used trigger: [trigger_name] for [category]."
   */
  generateMemoryVariableSentence(customTriggers: TriggerUsageRecord[], builtInTriggers: TriggerUsageRecord[]): string {
    if (customTriggers.length === 0 && builtInTriggers.length === 0) {
      return '';
    }

    const customTriggerNames = [...new Set(customTriggers.map(t => t.triggerName))];
    const builtInTriggerNames = [...new Set(builtInTriggers.map(t => t.triggerName))];
    
    let sentence = '';
    
    if (customTriggerNames.length > 0) {
      sentence += `User employed custom triggers: ${customTriggerNames.join(', ')}`;
    }
    
    if (builtInTriggerNames.length > 0) {
      if (sentence) sentence += '; ';
      sentence += `with built-in triggers: ${builtInTriggerNames.join(', ')}`;
    }

    const lastTrigger = customTriggers.length > 0 ? customTriggers[0] : builtInTriggers[0];
    if (lastTrigger) {
      sentence += `. Last trigger: "${lastTrigger.triggerName}" (${lastTrigger.category})`;
    }

    sentence += '.';
    
    return sentence;
  }

  /**
   * Get recent trigger memory for AI context
   * Returns context that should be sent to AI via backend without exposing to user
   */
  getRecentTriggerMemoryContext(limit: number = 10): TriggerMemoryContext {
    const recent = this.usageHistory.slice(0, limit);
    
    const customTriggers = recent.filter(t => t.isCustom);
    const builtInTriggers = recent.filter(t => !t.isCustom);
    
    const memoryVariablesSentence = this.generateMemoryVariableSentence(customTriggers, builtInTriggers);
    
    return {
      usedTriggers: recent,
      totalCustomTriggers: [...new Set(customTriggers.map(t => t.triggerName))].length,
      totalBuiltInTriggers: [...new Set(builtInTriggers.map(t => t.triggerName))].length,
      lastUsedTrigger: recent[0],
      memoryVariablesSentence,
      contextualMemories: [], // Will be populated by chat app if needed
    };
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this.usageHistory = [];
  }

  /**
   * Get full usage history
   */
  getHistory(): TriggerUsageRecord[] {
    return [...this.usageHistory];
  }

  /**
   * Get stats for a specific trigger
   */
  getTriggerStats(triggerName: string): { count: number; avgProcessingTime?: number } {
    const records = this.usageHistory.filter(t => t.triggerName.toLowerCase() === triggerName.toLowerCase());
    
    let totalTime = 0;
    let count = 0;
    
    for (const record of records) {
      count++;
      if (record.responseProcessingTime) {
        totalTime += record.responseProcessingTime;
      }
    }
    
    return {
      count,
      avgProcessingTime: count > 0 ? totalTime / count : undefined,
    };
  }

  /**
   * Get frequently used triggers
   */
  getFrequentTriggers(limit: number = 10): Array<{ name: string; count: number; isCustom: boolean }> {
    const triggerMap = new Map<string, { count: number; isCustom: boolean }>();
    
    for (const record of this.usageHistory) {
      const key = record.triggerName.toLowerCase();
      if (!triggerMap.has(key)) {
        triggerMap.set(key, { count: 0, isCustom: record.isCustom });
      }
      const stat = triggerMap.get(key)!;
      stat.count++;
    }
    
    return Array.from(triggerMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
}

// Export singleton instance
export const triggerMemoryTracker = new TriggerMemoryTracker();

/**
 * Serialize trigger memory for backend transmission
 * This is meant to be added to the request context but not shown to user
 */
export const serializeTriggerMemoryForBackend = (context: TriggerMemoryContext): string => {
  return JSON.stringify({
    memoryVariablesSentence: context.memoryVariablesSentence,
    usedTriggersCount: context.usedTriggers.length,
    customTriggersCount: context.totalCustomTriggers,
    builtInTriggersCount: context.totalBuiltInTriggers,
    lastTrigger: context.lastUsedTrigger?.triggerName,
    timestamp: Date.now(),
  });
};
