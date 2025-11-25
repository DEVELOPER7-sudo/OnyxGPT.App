// Enhanced Trigger Bar Renderer
// Controls visibility of trigger bars based on custom/registered status
// Only shows bars for custom and registered triggers, hides built-in trigger bars

import React from 'react';
import { Message } from '@/types/chat';
import CollapsibleTriggerTag from '@/components/CollapsibleTriggerTag';
import { shouldShowTriggerBar, formatTriggerForDisplay } from '@/lib/trigger-visibility';
import { toast } from 'sonner';

interface TriggerBarRendererProps {
  message: Message;
  customTriggerNames?: string[];
  registeredTriggerNames?: string[];
}

/**
 * Smart trigger bar renderer that:
 * 1. Only shows bars for custom/registered triggers
 * 2. Hides bars for built-in triggers
 * 3. Provides full compatibility with existing CollapsibleTriggerTag
 */
export const TriggerBarRenderer: React.FC<TriggerBarRendererProps> = ({
  message,
  customTriggerNames = [],
  registeredTriggerNames = [],
}) => {
  // Don't render if no tagged segments
  if (!message.taggedSegments || message.taggedSegments.length === 0) {
    return null;
  }

  // Filter segments to only show bars for visible triggers
  const visibleSegments = message.taggedSegments.filter(segment => {
    return shouldShowTriggerBar(segment.tag, customTriggerNames, registeredTriggerNames);
  });

  // If no visible triggers, return null (don't render anything)
  if (visibleSegments.length === 0) {
    return null;
  }

  return (
    <>
      {visibleSegments.map((segment, idx) => {
        const trigger = message.triggers?.find(t => t.tag === segment.tag);
        
        return (
          <CollapsibleTriggerTag
            key={`${message.id}-${segment.tag}-${idx}`}
            tagName={segment.tag}
            content={segment.content}
            category={trigger?.category}
            autoExpand={false}
            onCopy={() => {
              const textToCopy = `<${segment.tag}>\n${segment.content}\n</${segment.tag}>`;
              navigator.clipboard.writeText(textToCopy);
              toast.success(`Copied ${segment.tag} content to clipboard`);
            }}
          />
        );
      })}
    </>
  );
};

/**
 * Utility to get the count of visible triggers in a message
 */
export const getVisibleTriggerCount = (
  message: Message,
  customTriggerNames: string[] = [],
  registeredTriggerNames: string[] = []
): number => {
  if (!message.taggedSegments) return 0;

  return message.taggedSegments.filter(segment => 
    shouldShowTriggerBar(segment.tag, customTriggerNames, registeredTriggerNames)
  ).length;
};

/**
 * Utility to get the count of hidden triggers in a message
 */
export const getHiddenTriggerCount = (
  message: Message,
  customTriggerNames: string[] = [],
  registeredTriggerNames: string[] = []
): number => {
  if (!message.taggedSegments) return 0;

  return message.taggedSegments.filter(segment => 
    !shouldShowTriggerBar(segment.tag, customTriggerNames, registeredTriggerNames)
  ).length;
};

/**
 * Get metadata about trigger visibility for a message
 */
export const getTriggerVisibilityMetadata = (
  message: Message,
  customTriggerNames: string[] = [],
  registeredTriggerNames: string[] = []
) => {
  const visible = getVisibleTriggerCount(message, customTriggerNames, registeredTriggerNames);
  const hidden = getHiddenTriggerCount(message, customTriggerNames, registeredTriggerNames);
  const total = (message.taggedSegments?.length || 0);

  return {
    visibleCount: visible,
    hiddenCount: hidden,
    totalCount: total,
    hasVisibleTriggers: visible > 0,
    hasHiddenTriggers: hidden > 0,
    allTriggersHidden: total > 0 && hidden === total,
    allTriggersVisible: total > 0 && visible === total,
  };
};
