// Advanced Memory Search with Semantic Similarity
// Uses simple string similarity for fast search without external dependencies

import { Memory } from '@/types/chat';
import { storage } from '@/lib/storage';

export interface SearchResult {
  memory: Memory;
  relevanceScore: number; // 0-1
  matchType: 'keyword' | 'category' | 'tag' | 'semantic';
  explanation: string;
}

/**
 * Calculate semantic similarity between two strings using simple algorithm
 * Returns a score from 0 to 1
 */
export const calculateSemanticSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;

  // Tokenize
  const tokens1 = s1.split(/\s+/);
  const tokens2 = s2.split(/\s+/);

  // Count matching tokens (Jaccard similarity)
  const set1 = new Set(tokens1);
  const set2 = new Set(tokens2);
  const intersection = [...set1].filter(x => set2.has(x)).length;
  const union = new Set([...set1, ...set2]).size;

  return union > 0 ? intersection / union : 0;
};

/**
 * Calculate keyword match score
 * Counts how many query words appear in the memory
 */
export const calculateKeywordMatch = (query: string, memory: Memory): number => {
  const queryWords = query.toLowerCase().split(/\s+/);
  const memoryText = `${memory.key} ${memory.value} ${(memory.tags || []).join(' ')}`.toLowerCase();

  const matches = queryWords.filter(word => memoryText.includes(word)).length;
  return queryWords.length > 0 ? matches / queryWords.length : 0;
};

/**
 * Advanced semantic search with multiple ranking strategies
 */
export const semanticSearchMemories = (
  query: string,
  limit: number = 10,
  minScore: number = 0.3
): SearchResult[] => {
  const allMemories = storage.getMemories();

  if (!query.trim() || allMemories.length === 0) {
    return [];
  }

  const queryLower = query.toLowerCase();
  const results: SearchResult[] = [];

  allMemories.forEach(memory => {
    let score = 0;
    let matchType: SearchResult['matchType'] = 'semantic';
    let explanation = '';

    // 1. Keyword match (40% weight)
    const keywordScore = calculateKeywordMatch(query, memory);
    score += keywordScore * 0.4;

    // 2. Semantic similarity in key (30% weight)
    const keySemanticScore = calculateSemanticSimilarity(queryLower, memory.key.toLowerCase());
    score += keySemanticScore * 0.3;

    // 3. Semantic similarity in value (25% weight)
    const valueSemanticScore = calculateSemanticSimilarity(queryLower, memory.value.toLowerCase());
    score += valueSemanticScore * 0.25;

    // 4. Category match (5% weight)
    const categoryScore = memory.category?.toLowerCase().includes(queryLower) ? 0.5 : 0;
    score += categoryScore * 0.05;

    // 5. Tag match bonus (5% weight)
    const tagScore = (memory.tags || []).some(tag => tag.toLowerCase().includes(queryLower)) ? 0.5 : 0;
    score += tagScore * 0.05;

    // Boost score based on importance
    const importanceBoost = {
      high: 1.3,
      medium: 1.1,
      low: 0.9,
    };
    score *= importanceBoost[memory.importance || 'low'];

    // Boost recent memories
    const daysSinceCreation = (Date.now() - memory.timestamp) / (1000 * 60 * 60 * 24);
    const recencyBoost = Math.max(0.7, 1 - daysSinceCreation / 365);
    score *= recencyBoost;

    // Determine match type
    if (keywordScore > 0.6) {
      matchType = 'keyword';
      explanation = `Keyword match in title (${(keywordScore * 100).toFixed(0)}%)`;
    } else if (memory.category?.toLowerCase().includes(queryLower)) {
      matchType = 'category';
      explanation = `Found in ${memory.category} category`;
    } else if ((memory.tags || []).some(tag => tag.toLowerCase().includes(queryLower))) {
      matchType = 'tag';
      explanation = `Matched tag`;
    } else {
      matchType = 'semantic';
      explanation = `Semantically related`;
    }

    if (score >= minScore) {
      results.push({
        memory,
        relevanceScore: Math.min(1, score),
        matchType,
        explanation,
      });
    }
  });

  // Sort by relevance score (descending)
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results.slice(0, limit);
};

/**
 * Find memories similar to a given memory
 * Useful for finding related memories
 */
export const findSimilarMemories = (
  targetMemory: Memory,
  limit: number = 5,
  excludeId: boolean = true
): Memory[] => {
  const allMemories = storage.getMemories();

  const results = allMemories
    .map(memory => {
      if (excludeId && memory.id === targetMemory.id) {
        return { memory, score: 0 };
      }

      // Compare with target memory
      const keywordScore = calculateKeywordMatch(targetMemory.key, memory);
      const semanticScore = calculateSemanticSimilarity(
        targetMemory.value.toLowerCase(),
        memory.value.toLowerCase()
      );
      const categoryMatch = memory.category === targetMemory.category ? 0.2 : 0;

      const score = keywordScore * 0.4 + semanticScore * 0.4 + categoryMatch * 0.2;

      return { memory, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ memory }) => memory);

  return results;
};

/**
 * Search by multiple criteria
 */
export interface AdvancedSearchCriteria {
  query?: string;
  category?: string;
  importance?: 'high' | 'medium' | 'low';
  tags?: string[];
  dateRange?: { from: number; to: number };
}

export const advancedSearchMemories = (
  criteria: AdvancedSearchCriteria,
  limit: number = 10
): Memory[] => {
  let results = storage.getMemories();

  // Filter by query
  if (criteria.query?.trim()) {
    const queryResults = semanticSearchMemories(criteria.query, 1000, 0.1);
    const resultIds = new Set(queryResults.map(r => r.memory.id));
    results = results.filter(m => resultIds.has(m.id));
  }

  // Filter by category
  if (criteria.category) {
    results = results.filter(
      m => m.category?.toLowerCase() === criteria.category?.toLowerCase()
    );
  }

  // Filter by importance
  if (criteria.importance) {
    results = results.filter(m => m.importance === criteria.importance);
  }

  // Filter by tags
  if (criteria.tags && criteria.tags.length > 0) {
    results = results.filter(m =>
      criteria.tags!.some(tag =>
        (m.tags || []).some(t => t.toLowerCase() === tag.toLowerCase())
      )
    );
  }

  // Filter by date range
  if (criteria.dateRange) {
    results = results.filter(
      m =>
        m.timestamp >= criteria.dateRange!.from &&
        m.timestamp <= criteria.dateRange!.to
    );
  }

  return results.slice(0, limit);
};

/**
 * Get search suggestions based on partial input
 */
export const getSearchSuggestions = (query: string, limit: number = 5): string[] => {
  const allMemories = storage.getMemories();
  const queryLower = query.toLowerCase();

  const suggestions = new Set<string>();

  allMemories.forEach(memory => {
    // Add matching keys
    if (memory.key.toLowerCase().startsWith(queryLower)) {
      suggestions.add(memory.key);
    }

    // Add matching categories
    if (memory.category?.toLowerCase().startsWith(queryLower)) {
      suggestions.add(memory.category);
    }

    // Add matching tags
    (memory.tags || []).forEach(tag => {
      if (tag.toLowerCase().startsWith(queryLower)) {
        suggestions.add(tag);
      }
    });
  });

  return Array.from(suggestions).slice(0, limit);
};

/**
 * Find memories by time window (e.g., "this week", "last month")
 */
export const findMemoriesByTimeWindow = (
  window: 'today' | 'week' | 'month' | 'quarter' | 'year'
): Memory[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const windows = {
    today: dayMs,
    week: dayMs * 7,
    month: dayMs * 30,
    quarter: dayMs * 90,
    year: dayMs * 365,
  };

  const cutoffTime = now - windows[window];
  return storage.getMemories().filter(m => m.timestamp >= cutoffTime);
};
