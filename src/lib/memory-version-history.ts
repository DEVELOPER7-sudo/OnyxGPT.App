// Memory Versioning & History System
// Track changes to memories over time with version control

import { Memory } from '@/types/chat';

export interface MemoryVersion {
  versionId: string;
  memoryId: string;
  version: number;
  timestamp: number;
  value: string;
  category?: string;
  importance?: 'low' | 'medium' | 'high';
  changeType: 'create' | 'update' | 'restore' | 'archive';
  changedBy?: string;
  changeDescription?: string;
  previousVersion?: number;
  diffStats?: {
    added: number;
    removed: number;
    modified: number;
  };
}

export interface MemoryHistory {
  memoryId: string;
  key: string;
  versions: MemoryVersion[];
  currentVersion: number;
  createdAt: number;
  lastModifiedAt: number;
  totalVersions: number;
  archivedVersions: number;
}

// Store version history in localStorage
const HISTORY_KEY = 'ai_studio_memory_history';
const MAX_VERSIONS_PER_MEMORY = 20;

/**
 * Get all version histories
 */
export const getAllMemoryHistories = (): MemoryHistory[] => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/**
 * Save version histories
 */
const saveMemoryHistories = (histories: MemoryHistory[]): void => {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(histories));
};

/**
 * Get history for a specific memory
 */
export const getMemoryHistory = (memoryId: string): MemoryHistory | null => {
  const histories = getAllMemoryHistories();
  return histories.find(h => h.memoryId === memoryId) || null;
};

/**
 * Create a new version when memory is created
 */
export const createMemoryVersion = (
  memory: Memory,
  changeDescription?: string
): MemoryVersion => {
  return {
    versionId: `v_${memory.id}_1_${Date.now()}`,
    memoryId: memory.id,
    version: 1,
    timestamp: memory.timestamp,
    value: memory.value,
    category: memory.category,
    importance: memory.importance,
    changeType: 'create',
    changeDescription: changeDescription || `Created memory: ${memory.key}`,
    diffStats: {
      added: memory.value.length,
      removed: 0,
      modified: 0,
    },
  };
};

/**
 * Record a memory update
 */
export const recordMemoryUpdate = (
  memory: Memory,
  previousValue: string,
  changeDescription?: string
): MemoryVersion => {
  const histories = getAllMemoryHistories();
  const existingHistory = histories.find(h => h.memoryId === memory.id);
  const currentVersion = existingHistory ? existingHistory.currentVersion : 0;
  const newVersion = currentVersion + 1;

  // Calculate diff stats
  const oldLength = previousValue.length;
  const newLength = memory.value.length;
  const changed = Math.min(oldLength, newLength);

  const version: MemoryVersion = {
    versionId: `v_${memory.id}_${newVersion}_${Date.now()}`,
    memoryId: memory.id,
    version: newVersion,
    timestamp: Date.now(),
    value: memory.value,
    category: memory.category,
    importance: memory.importance,
    changeType: 'update',
    previousVersion: currentVersion,
    changeDescription: changeDescription || `Updated memory: ${memory.key}`,
    diffStats: {
      added: Math.max(0, newLength - changed),
      removed: Math.max(0, oldLength - changed),
      modified: changed,
    },
  };

  // Update or create history
  if (!existingHistory) {
    const history: MemoryHistory = {
      memoryId: memory.id,
      key: memory.key,
      versions: [version],
      currentVersion: newVersion,
      createdAt: memory.timestamp,
      lastModifiedAt: Date.now(),
      totalVersions: 1,
      archivedVersions: 0,
    };
    histories.push(history);
  } else {
    existingHistory.versions.push(version);
    existingHistory.currentVersion = newVersion;
    existingHistory.lastModifiedAt = Date.now();
    existingHistory.totalVersions++;

    // Keep only last N versions, archive older ones
    if (existingHistory.versions.length > MAX_VERSIONS_PER_MEMORY) {
      const toArchive = existingHistory.versions.splice(0, 1)[0];
      toArchive.changeType = 'archive';
      existingHistory.archivedVersions++;
    }
  }

  saveMemoryHistories(histories);
  return version;
};

/**
 * Restore a memory to a previous version
 */
export const restoreMemoryVersion = (
  memory: Memory,
  versionNumber: number,
  reason?: string
): Memory | null => {
  const history = getMemoryHistory(memory.id);
  if (!history) return null;

  const targetVersion = history.versions.find(v => v.version === versionNumber);
  if (!targetVersion) return null;

  // Create restored memory
  const restoredMemory: Memory = {
    ...memory,
    value: targetVersion.value,
    category: targetVersion.category,
    importance: targetVersion.importance,
  };

  // Record the restore as a new version
  const histories = getAllMemoryHistories();
  const historyIndex = histories.findIndex(h => h.memoryId === memory.id);

  if (historyIndex !== -1) {
    const restoreVersion: MemoryVersion = {
      versionId: `v_${memory.id}_restore_${Date.now()}`,
      memoryId: memory.id,
      version: history.currentVersion + 1,
      timestamp: Date.now(),
      value: targetVersion.value,
      category: targetVersion.category,
      importance: targetVersion.importance,
      changeType: 'restore',
      previousVersion: versionNumber,
      changeDescription: reason || `Restored to version ${versionNumber}`,
    };

    histories[historyIndex].versions.push(restoreVersion);
    histories[historyIndex].currentVersion = restoreVersion.version;
    histories[historyIndex].lastModifiedAt = Date.now();
    saveMemoryHistories(histories);
  }

  return restoredMemory;
};

/**
 * Get version comparison
 */
export const compareVersions = (
  memoryId: string,
  version1: number,
  version2: number
): {
  version1: MemoryVersion | null;
  version2: MemoryVersion | null;
  similarities: string[];
  differences: string[];
  similarity_percentage: number;
} => {
  const history = getMemoryHistory(memoryId);
  if (!history) {
    return {
      version1: null,
      version2: null,
      similarities: [],
      differences: [],
      similarity_percentage: 0,
    };
  }

  const v1 = history.versions.find(v => v.version === version1);
  const v2 = history.versions.find(v => v.version === version2);

  if (!v1 || !v2) {
    return {
      version1: v1 || null,
      version2: v2 || null,
      similarities: [],
      differences: [],
      similarity_percentage: 0,
    };
  }

  const v1Words = new Set(v1.value.toLowerCase().split(/\s+/));
  const v2Words = new Set(v2.value.toLowerCase().split(/\s+/));

  const similarities = [...v1Words].filter(w => v2Words.has(w));
  const onlyInV1 = [...v1Words].filter(w => !v2Words.has(w));
  const onlyInV2 = [...v2Words].filter(w => !v1Words.has(w));
  const differences = [...new Set([...onlyInV1, ...onlyInV2])];

  const totalWords = new Set([...v1Words, ...v2Words]).size;
  const similarityPercentage = totalWords > 0 ? (similarities.length / totalWords) * 100 : 0;

  return {
    version1: v1,
    version2: v2,
    similarities: similarities.slice(0, 10),
    differences: differences.slice(0, 10),
    similarity_percentage: parseFloat(similarityPercentage.toFixed(1)),
  };
};

/**
 * Get timeline of memory changes
 */
export const getMemoryTimeline = (memoryId: string): MemoryVersion[] => {
  const history = getMemoryHistory(memoryId);
  if (!history) return [];

  return history.versions.sort((a, b) => a.timestamp - b.timestamp);
};

/**
 * Get recent changes across all memories
 */
export const getRecentChanges = (limit: number = 20): MemoryVersion[] => {
  const histories = getAllMemoryHistories();
  const allVersions: MemoryVersion[] = [];

  histories.forEach(h => {
    allVersions.push(...h.versions);
  });

  return allVersions
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
};

/**
 * Get memory edit statistics
 */
export const getMemoryEditStats = (memoryId: string): {
  totalVersions: number;
  createdAt: number;
  lastModifiedAt: number;
  daysActive: number;
  editsPerDay: number;
  totalChanges: string;
  mostRecentChange: MemoryVersion | null;
} => {
  const history = getMemoryHistory(memoryId);
  if (!history) {
    return {
      totalVersions: 0,
      createdAt: 0,
      lastModifiedAt: 0,
      daysActive: 0,
      editsPerDay: 0,
      totalChanges: '0',
      mostRecentChange: null,
    };
  }

  const daysActive = Math.ceil(
    (history.lastModifiedAt - history.createdAt) / (1000 * 60 * 60 * 24)
  );
  const editsPerDay = daysActive > 0 ? history.totalVersions / daysActive : 0;

  const addedChars = history.versions.reduce((sum, v) => sum + (v.diffStats?.added || 0), 0);
  const removedChars = history.versions.reduce((sum, v) => sum + (v.diffStats?.removed || 0), 0);

  return {
    totalVersions: history.totalVersions,
    createdAt: history.createdAt,
    lastModifiedAt: history.lastModifiedAt,
    daysActive: Math.max(daysActive, 0),
    editsPerDay: parseFloat(editsPerDay.toFixed(2)),
    totalChanges: `+${addedChars} / -${removedChars}`,
    mostRecentChange: history.versions[history.versions.length - 1] || null,
  };
};

/**
 * Cleanup old versions to save storage space
 */
export const cleanupOldVersions = (
  memoryId?: string,
  maxVersionsToKeep: number = 10
): number => {
  const histories = getAllMemoryHistories();
  let deletedCount = 0;

  const targetHistories = memoryId
    ? histories.filter(h => h.memoryId === memoryId)
    : histories;

  targetHistories.forEach(history => {
    if (history.versions.length > maxVersionsToKeep) {
      const deleted = history.versions.length - maxVersionsToKeep;
      history.versions = history.versions.slice(-maxVersionsToKeep);
      deletedCount += deleted;
    }
  });

  saveMemoryHistories(histories);
  return deletedCount;
};

/**
 * Export version history as JSON
 */
export const exportMemoryHistory = (memoryId?: string): string => {
  const histories = memoryId
    ? getAllMemoryHistories().filter(h => h.memoryId === memoryId)
    : getAllMemoryHistories();

  return JSON.stringify(histories, null, 2);
};

/**
 * Import version history from JSON
 */
export const importMemoryHistory = (jsonString: string): boolean => {
  try {
    const imported = JSON.parse(jsonString);
    const existing = getAllMemoryHistories();

    // Merge without duplicates
    const existingIds = new Set(existing.map(h => h.memoryId));
    const newHistories = imported.filter((h: MemoryHistory) => !existingIds.has(h.memoryId));

    saveMemoryHistories([...existing, ...newHistories]);
    return true;
  } catch {
    return false;
  }
};
