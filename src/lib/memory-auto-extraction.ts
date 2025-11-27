// Auto Memory Extraction from AI Responses
// Intelligently extracts facts and suggestions from responses to save as memories

import { Memory } from '@/types/chat';

export interface ExtractedFact {
  text: string;
  confidence: number; // 0-1
  type: 'fact' | 'recommendation' | 'learning' | 'insight' | 'goal' | 'reference';
  category?: string;
  importance?: 'low' | 'medium' | 'high';
}

export interface ExtractionResult {
  totalFacts: number;
  suggestedMemories: ExtractedFact[];
  extractedAt: number;
  sourceLength: number;
}

/**
 * Patterns that indicate important statements
 */
const IMPORTANCE_PATTERNS = {
  high: [
    /(?:important|critical|must|essential|vital|crucial|remember|key)/i,
    /(?:best practice|standard|rule|principle|law)/i,
    /(?:warning|caution|attention|alert)/i,
  ],
  medium: [
    /(?:should|recommend|suggest|consider|note|point)/i,
    /(?:useful|helpful|effective|beneficial)/i,
  ],
  low: [
    /(?:might|could|may|possibly|perhaps)/i,
    /(?:optional|extra|additional)/i,
  ],
};

/**
 * Extract sentences that look like facts or recommendations
 */
export const extractSentencesAsFacts = (text: string): ExtractedFact[] => {
  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const facts: ExtractedFact[] = [];

  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length < 20) return; // Skip very short sentences

    // Skip common phrases
    if (/^(the|a|an|this|that|you|i|we|he|she|it|they)\s/i.test(trimmed)) {
      // Check if it's actually a fact
      if (!/(?:is|are|has|have|was|were|found|discovered|proven|shows|indicates|suggests)/i.test(trimmed)) {
        return;
      }
    }

    // Determine importance
    let importance: 'low' | 'medium' | 'high' = 'low';

    for (const pattern of IMPORTANCE_PATTERNS.high) {
      if (pattern.test(trimmed)) {
        importance = 'high';
        break;
      }
    }

    if (importance === 'low') {
      for (const pattern of IMPORTANCE_PATTERNS.medium) {
        if (pattern.test(trimmed)) {
          importance = 'medium';
          break;
        }
      }
    }

    // Determine type
    let type: ExtractedFact['type'] = 'fact';
    if (/(?:recommend|suggest|consider|should)/i.test(trimmed)) {
      type = 'recommendation';
    } else if (/(?:learned|discovered|realized|found)/i.test(trimmed)) {
      type = 'learning';
    } else if (/(?:insight|understand|key|important)/i.test(trimmed)) {
      type = 'insight';
    } else if (/(?:goal|aim|target|objective)/i.test(trimmed)) {
      type = 'goal';
    }

    // Calculate confidence based on sentence structure
    let confidence = 0.5;
    if (/(?:definite|certain|sure|clearly|obviously)/i.test(trimmed)) {
      confidence = 0.9;
    } else if (/(?:may|might|could|possibly)/i.test(trimmed)) {
      confidence = 0.4;
    } else if (/(?:should|recommend)/i.test(trimmed)) {
      confidence = 0.7;
    }

    facts.push({
      text: trimmed,
      confidence,
      type,
      importance,
    });
  });

  return facts;
};

/**
 * Extract code snippets from response
 */
export const extractCodeSnippets = (text: string): ExtractedFact[] => {
  const codeBlocks = text.match(/```[\s\S]*?```/g) || [];
  const facts: ExtractedFact[] = [];

  codeBlocks.forEach((block, index) => {
    const code = block.replace(/```/g, '').trim();
    if (code.length < 20) return;

    // Try to extract language
    const langMatch = block.match(/```(\w+)/);
    const language = langMatch ? langMatch[1] : 'code';

    facts.push({
      text: code,
      type: 'reference',
      confidence: 0.95,
      category: `Code (${language})`,
      importance: 'high',
    });
  });

  return facts;
};

/**
 * Extract lists from response
 */
export const extractLists = (text: string): ExtractedFact[] => {
  const listPatterns = [
    /^[-*•]\s+(.+)$/gm, // Unordered lists
    /^\d+\.\s+(.+)$/gm, // Ordered lists
  ];

  const facts: ExtractedFact[] = [];

  for (const pattern of listPatterns) {
    const matches = text.matchAll(pattern);
    for (const match of matches) {
      const item = match[1].trim();
      if (item.length > 10) {
        facts.push({
          text: item,
          type: 'fact',
          confidence: 0.7,
          importance: 'medium',
        });
      }
    }
  }

  return facts;
};

/**
 * Extract statistics and numbers
 */
export const extractStatistics = (text: string): ExtractedFact[] => {
  const statPattern = /(\d+(?:\.\d+)?%?|\d+\s*(?:million|thousand|hundred|billion))\s+([^.!?]+)/gi;
  const facts: ExtractedFact[] = [];

  let match;
  while ((match = statPattern.exec(text)) !== null) {
    const stat = match[0].trim();
    if (stat.length < 100) { // Reasonable length
      facts.push({
        text: stat,
        type: 'fact',
        confidence: 0.85,
        importance: 'high',
      });
    }
  }

  return facts;
};

/**
 * Extract key definitions
 */
export const extractDefinitions = (text: string): ExtractedFact[] => {
  const defPattern = /(?:([^.!?]+?)\s+(?:is|are|means?|refers? to|defined as))\s+([^.!?]{20,})/gi;
  const facts: ExtractedFact[] = [];

  let match;
  while ((match = defPattern.exec(text)) !== null) {
    const definition = match[0].trim();
    if (definition.length < 300) {
      facts.push({
        text: definition,
        type: 'reference',
        confidence: 0.8,
        importance: 'high',
      });
    }
  }

  return facts;
};

/**
 * Main extraction function
 */
export const extractMemoriesFromResponse = (
  response: string,
  minConfidence: number = 0.6
): ExtractionResult => {
  if (!response || response.length < 50) {
    return {
      totalFacts: 0,
      suggestedMemories: [],
      extractedAt: Date.now(),
      sourceLength: response.length,
    };
  }

  // Extract all types of facts
  const facts: ExtractedFact[] = [];

  facts.push(...extractSentencesAsFacts(response));
  facts.push(...extractCodeSnippets(response));
  facts.push(...extractLists(response));
  facts.push(...extractStatistics(response));
  facts.push(...extractDefinitions(response));

  // Filter by confidence and remove duplicates
  const uniqueFacts = new Map<string, ExtractedFact>();
  facts
    .filter(f => f.confidence >= minConfidence)
    .forEach(fact => {
      const key = fact.text.substring(0, 50);
      if (!uniqueFacts.has(key) || uniqueFacts.get(key)!.confidence < fact.confidence) {
        uniqueFacts.set(key, fact);
      }
    });

  const suggestedMemories = Array.from(uniqueFacts.values())
    .sort((a, b) => {
      // Sort by importance and confidence
      const importanceOrder = { high: 3, medium: 2, low: 1 };
      const aScore = (importanceOrder[a.importance || 'low'] || 0) + a.confidence;
      const bScore = (importanceOrder[b.importance || 'low'] || 0) + b.confidence;
      return bScore - aScore;
    })
    .slice(0, 10); // Limit to top 10

  return {
    totalFacts: uniqueFacts.size,
    suggestedMemories,
    extractedAt: Date.now(),
    sourceLength: response.length,
  };
};

/**
 * Convert extracted facts to Memory objects
 */
export const factsToMemories = (
  facts: ExtractedFact[],
  triggerOrTopic?: string
): Memory[] => {
  return facts.map((fact, index) => ({
    id: `extracted_${Date.now()}_${index}`,
    key: truncateText(fact.text, 50),
    value: fact.text,
    category: fact.category || 'Auto-Extracted',
    importance: fact.importance,
    timestamp: Date.now(),
    tags: ['auto-extracted', triggerOrTopic || 'general'].filter(Boolean),
    autoExtracted: true,
  }));
};

/**
 * Truncate text to specified length
 */
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Suggest memories from response with context
 */
export const suggestMemoriesFromResponse = (
  response: string,
  triggerName?: string
): {
  suggestions: Memory[];
  summary: string;
  extractionStats: ExtractionResult;
} => {
  const extractionStats = extractMemoriesFromResponse(response);
  const suggestions = factsToMemories(
    extractionStats.suggestedMemories,
    triggerName
  );

  const summary = `Extracted ${suggestions.length} potential memories from response (${extractionStats.totalFacts} facts analyzed)`;

  return {
    suggestions,
    summary,
    extractionStats,
  };
};

/**
 * Filter extracted memories by importance
 */
export const filterMemoriesByImportance = (
  memories: Memory[],
  importance: 'low' | 'medium' | 'high'
): Memory[] => {
  return memories.filter(m => m.importance === importance);
};

/**
 * Get extraction statistics
 */
export const getExtractionStats = (
  extractions: ExtractionResult[]
): {
  totalExtracted: number;
  averagePerResponse: number;
  totalSourceLength: number;
} => {
  const totalExtracted = extractions.reduce((sum, e) => sum + e.totalFacts, 0);
  const totalSourceLength = extractions.reduce((sum, e) => sum + e.sourceLength, 0);

  return {
    totalExtracted,
    averagePerResponse: extractions.length > 0 ? totalExtracted / extractions.length : 0,
    totalSourceLength,
  };
};
