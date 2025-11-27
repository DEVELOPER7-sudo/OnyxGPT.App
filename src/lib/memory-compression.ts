// Memory Compression & Summarization System
// Intelligently compresses and summarizes memories for efficient storage and retrieval

import { Memory } from '@/types/chat';

export interface CompressedMemory {
  original: Memory;
  compressed: Memory;
  compressionRatio: number; // 0-1, where 1 is fully compressed
  summary: string;
  keywords: string[];
}

/**
 * Extract key phrases and keywords from text
 */
export const extractKeywords = (text: string, limit: number = 5): string[] => {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.length > 4);

  const wordFreq: Record<string, number> = {};
  words.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
};

/**
 * Summarize text using simple extractive summarization
 */
export const summarizeText = (text: string, maxLength: number = 150): string => {
  if (text.length <= maxLength) {
    return text;
  }

  // Split into sentences
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];

  let summary = '';
  for (const sentence of sentences) {
    if ((summary + sentence).length <= maxLength) {
      summary += sentence;
    } else {
      break;
    }
  }

  // Add ellipsis if truncated
  if (summary.length < text.length) {
    summary = summary.trim() + '...';
  }

  return summary.trim();
};

/**
 * Compress a single memory
 */
export const compressMemory = (memory: Memory): CompressedMemory => {
  const originalLength = memory.value.length;

  // Extract keywords
  const keywords = extractKeywords(memory.value);

  // Create summary
  const summary = summarizeText(memory.value);

  // Create compressed version
  const compressed: Memory = {
    ...memory,
    value: summary,
  };

  const compressedLength = compressed.value.length;
  const compressionRatio = 1 - compressedLength / originalLength;

  return {
    original: memory,
    compressed,
    compressionRatio: Math.max(0, Math.min(1, compressionRatio)),
    summary,
    keywords,
  };
};

/**
 * Compress multiple memories
 */
export const compressMemories = (memories: Memory[]): CompressedMemory[] => {
  return memories.map(compressMemory);
};

/**
 * Calculate compression statistics
 */
export const getCompressionStats = (
  memories: Memory[]
): {
  totalOriginalSize: number;
  totalCompressedSize: number;
  averageCompressionRatio: number;
  savings: string;
} => {
  const compressed = compressMemories(memories);

  const totalOriginal = memories.reduce((sum, m) => sum + m.value.length, 0);
  const totalCompressed = compressed.reduce(
    (sum, c) => sum + c.compressed.value.length,
    0
  );
  const avgRatio = compressed.reduce((sum, c) => sum + c.compressionRatio, 0) / compressed.length;

  return {
    totalOriginalSize: totalOriginal,
    totalCompressedSize: totalCompressed,
    averageCompressionRatio: avgRatio,
    savings: `${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%`,
  };
};

/**
 * Intelligently batch similar memories
 * Groups related memories together for summary
 */
export const batchSimilarMemories = (
  memories: Memory[]
): { batch: Memory[]; batchSummary: string; batchKeywords: string[] }[] => {
  if (memories.length <= 1) {
    return memories.map(m => ({
      batch: [m],
      batchSummary: m.value,
      batchKeywords: extractKeywords(m.value),
    }));
  }

  const batches: Map<string, Memory[]> = new Map();

  memories.forEach(memory => {
    const category = memory.category || 'uncategorized';
    if (!batches.has(category)) {
      batches.set(category, []);
    }
    batches.get(category)!.push(memory);
  });

  return Array.from(batches.entries()).map(([, batch]) => {
    const allText = batch.map(m => m.value).join(' ');
    const summary = summarizeText(allText, 200);
    const keywords = extractKeywords(allText);

    return {
      batch,
      batchSummary: summary,
      batchKeywords: keywords,
    };
  });
};

/**
 * Create a consolidated memory from multiple related memories
 */
export const consolidateMemories = (
  memories: Memory[],
  newKey: string
): Memory => {
  const values = memories.map(m => `${m.key}: ${m.value}`).join('\n\n');
  const summary = summarizeText(values, 500);
  const keywords = extractKeywords(values, 10);

  return {
    id: `consolidated_${Date.now()}`,
    key: newKey,
    value: summary,
    category: memories[0]?.category || 'consolidated',
    importance: 'medium',
    timestamp: Date.now(),
    tags: keywords,
  };
};

/**
 * Get memory size analytics
 */
export const getMemorySizeAnalytics = (memories: Memory[]): {
  small: Memory[]; // < 100 chars
  medium: Memory[]; // 100-500 chars
  large: Memory[]; // 500-1000 chars
  veryLarge: Memory[]; // > 1000 chars
  totalSize: number;
  averageSize: number;
} => {
  const small: Memory[] = [];
  const medium: Memory[] = [];
  const large: Memory[] = [];
  const veryLarge: Memory[] = [];

  let totalSize = 0;

  memories.forEach(m => {
    const size = m.value.length;
    totalSize += size;

    if (size < 100) small.push(m);
    else if (size < 500) medium.push(m);
    else if (size < 1000) large.push(m);
    else veryLarge.push(m);
  });

  return {
    small,
    medium,
    large,
    veryLarge,
    totalSize,
    averageSize: totalSize / Math.max(memories.length, 1),
  };
};

/**
 * Suggest memories for compression based on size and age
 */
export const suggestCompressionCandidates = (
  memories: Memory[]
): Memory[] => {
  const now = Date.now();
  const oneMonthMs = 30 * 24 * 60 * 60 * 1000;

  return memories.filter(m => {
    // Old and large memories are good candidates
    const isOld = now - m.timestamp > oneMonthMs;
    const isLarge = m.value.length > 500;
    const isLowImportance = m.importance === 'low';

    return isLarge && (isOld || isLowImportance);
  });
};

/**
 * Create a snapshot-style summary of memory collection
 */
export const createMemorySnapshot = (memories: Memory[]): string => {
  const byCategory: Record<string, number> = {};
  const byImportance: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0,
  };

  let totalChars = 0;

  memories.forEach(m => {
    byCategory[m.category || 'other'] = (byCategory[m.category || 'other'] || 0) + 1;
    byImportance[m.importance || 'low']++;
    totalChars += m.value.length;
  });

  const snapshot = [
    `Memory Snapshot: ${memories.length} items, ${totalChars.toLocaleString()} characters`,
    `Distribution: ${Object.entries(byCategory)
      .map(([cat, count]) => `${count} ${cat}`)
      .join(', ')}`,
    `Importance: ${Object.entries(byImportance)
      .map(([imp, count]) => `${count} ${imp}`)
      .join(', ')}`,
  ];

  return snapshot.join(' | ');
};

/**
 * Deduplicate similar memories based on content similarity
 */
export const deduplicateMemories = (
  memories: Memory[],
  similarityThreshold: number = 0.8
): {
  unique: Memory[];
  duplicates: Array<{ primary: Memory; similar: Memory[] }>;
} => {
  const unique: Memory[] = [];
  const duplicates: Array<{ primary: Memory; similar: Memory[] }> = [];

  const processed = new Set<string>();

  memories.forEach(memory => {
    if (processed.has(memory.id)) return;

    const similar: Memory[] = [];

    memories.forEach(other => {
      if (processed.has(other.id) || other.id === memory.id) return;

      // Simple similarity check
      const memoryWords = new Set(memory.value.toLowerCase().split(/\s+/));
      const otherWords = new Set(other.value.toLowerCase().split(/\s+/));

      const intersection = [...memoryWords].filter(w => otherWords.has(w)).length;
      const union = new Set([...memoryWords, ...otherWords]).size;
      const similarity = union > 0 ? intersection / union : 0;

      if (similarity >= similarityThreshold) {
        similar.push(other);
        processed.add(other.id);
      }
    });

    unique.push(memory);
    processed.add(memory.id);

    if (similar.length > 0) {
      duplicates.push({ primary: memory, similar });
    }
  });

  return { unique, duplicates };
};
