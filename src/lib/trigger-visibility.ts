// Trigger Visibility Control - Determines when to show trigger bars in chat
// Rule: Only show trigger bars for custom/registered triggers, not for built-in triggers

import { DetectedTrigger } from '@/lib/triggers';

export interface VisibleTrigger {
  trigger: DetectedTrigger;
  isVisible: boolean;
  reason: 'custom' | 'registered' | 'hidden_builtin';
}

/**
 * Filter triggers to show only custom and registered ones in UI
 * Built-in triggers are used internally but don't show UI bars
 */
export const filterVisibleTriggers = (
  detectedTriggers: DetectedTrigger[],
  customTriggerNames: string[] = [],
  registeredTriggerNames: string[] = []
): DetectedTrigger[] => {
  return detectedTriggers.filter(trigger => {
    const triggerNameLower = trigger.name.toLowerCase();
    
    // Show if it's a custom trigger
    if (customTriggerNames.some(name => name.toLowerCase() === triggerNameLower)) {
      return true;
    }
    
    // Show if it's registered
    if (registeredTriggerNames.some(name => name.toLowerCase() === triggerNameLower)) {
      return true;
    }
    
    // Hide built-in triggers by default
    return false;
  });
};

/**
 * Get detailed visibility information for each detected trigger
 */
export const getDetailedTriggerVisibility = (
  detectedTriggers: DetectedTrigger[],
  customTriggerNames: string[] = [],
  registeredTriggerNames: string[] = []
): VisibleTrigger[] => {
  return detectedTriggers.map(trigger => {
    const triggerNameLower = trigger.name.toLowerCase();
    
    // Check if custom
    const isCustom = customTriggerNames.some(name => name.toLowerCase() === triggerNameLower);
    if (isCustom) {
      return {
        trigger,
        isVisible: true,
        reason: 'custom',
      };
    }
    
    // Check if registered
    const isRegistered = registeredTriggerNames.some(name => name.toLowerCase() === triggerNameLower);
    if (isRegistered) {
      return {
        trigger,
        isVisible: true,
        reason: 'registered',
      };
    }
    
    // Built-in trigger - hidden
    return {
      trigger,
      isVisible: false,
      reason: 'hidden_builtin',
    };
  });
};

/**
 * Format trigger for display in trigger bar
 */
export const formatTriggerForDisplay = (trigger: DetectedTrigger): {
  displayName: string;
  displayCategory: string;
  displayIcon: string;
  displayColor: string;
} => {
  const colorMap: Record<string, string> = {
    'Reasoning & Analysis': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Research & Information': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Planning & Organization': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Communication & Style': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    'Coding & Development': 'bg-green-500/20 text-green-400 border-green-500/30',
    'Creative & Writing': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'Data & Analytics': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    'Business & Strategy': 'bg-red-500/20 text-red-400 border-red-500/30',
    'Education & Learning': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  };

  const iconMap: Record<string, string> = {
    'Reasoning & Analysis': '🧠',
    'Research & Information': '🔍',
    'Planning & Organization': '📋',
    'Communication & Style': '💬',
    'Coding & Development': '⚙️',
    'Creative & Writing': '✨',
    'Data & Analytics': '📊',
    'Business & Strategy': '💼',
    'Education & Learning': '📚',
  };

  return {
    displayName: trigger.name,
    displayCategory: trigger.category,
    displayIcon: iconMap[trigger.category] || '🎯',
    displayColor: colorMap[trigger.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };
};

/**
 * Check if a trigger should show in the UI trigger bar
 */
export const shouldShowTriggerBar = (
  triggerName: string,
  customTriggerNames: string[],
  registeredTriggerNames: string[]
): boolean => {
  const triggerNameLower = triggerName.toLowerCase();
  
  const isCustom = customTriggerNames.some(name => name.toLowerCase() === triggerNameLower);
  const isRegistered = registeredTriggerNames.some(name => name.toLowerCase() === triggerNameLower);
  
  return isCustom || isRegistered;
};

/**
 * Get usage statistics for visible triggers only
 */
export const getVisibleTriggerStats = (
  usageHistory: Array<{ triggerName: string; isCustom: boolean; timestamp: number }>,
  customTriggerNames: string[],
  registeredTriggerNames: string[]
) => {
  const visibleUsage = usageHistory.filter(usage => {
    return shouldShowTriggerBar(usage.triggerName, customTriggerNames, registeredTriggerNames);
  });

  return {
    totalVisible: visibleUsage.length,
    byTrigger: visibleUsage.reduce((acc, usage) => {
      const key = usage.triggerName.toLowerCase();
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };
};

/**
 * Mark a built-in trigger as "registered" to make it visible
 * This is for promoting built-in triggers to registered status
 */
export const promoteBuiltinToRegistered = (
  triggerName: string,
  registeredTriggers: string[]
): string[] => {
  const triggerNameLower = triggerName.toLowerCase();
  
  if (!registeredTriggers.some(t => t.toLowerCase() === triggerNameLower)) {
    return [...registeredTriggers, triggerName];
  }
  
  return registeredTriggers;
};

/**
 * Demote a registered trigger back to hidden
 */
export const demoteRegisteredToHidden = (
  triggerName: string,
  registeredTriggers: string[]
): string[] => {
  return registeredTriggers.filter(
    t => t.toLowerCase() !== triggerName.toLowerCase()
  );
};
