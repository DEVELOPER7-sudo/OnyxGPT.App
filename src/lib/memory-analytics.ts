// Memory Analytics & Insights System
// Provides deep insights into memory usage patterns and recommendations

import { Memory } from '@/types/chat';
import { storage } from '@/lib/storage';

export interface MemoryInsight {
  title: string;
  description: string;
  type: 'recommendation' | 'insight' | 'warning' | 'opportunity';
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  suggestion?: string;
}

export interface MemoryAnalytics {
  totalMemories: number;
  totalCharacters: number;
  averageMemorySize: number;
  oldestMemory: Memory | null;
  newestMemory: Memory | null;
  mostActiveDay: string | null;
  memoryGrowthTrend: 'increasing' | 'stable' | 'decreasing';
  categoryBreakdown: Record<string, number>;
  importanceBreakdown: Record<string, number>;
  topMemories: Memory[];
  dormantMemories: Memory[];
  insights: MemoryInsight[];
}

/**
 * Calculate comprehensive analytics
 */
export const calculateMemoryAnalytics = (): MemoryAnalytics => {
  const memories = storage.getMemories();

  if (memories.length === 0) {
    return {
      totalMemories: 0,
      totalCharacters: 0,
      averageMemorySize: 0,
      oldestMemory: null,
      newestMemory: null,
      mostActiveDay: null,
      memoryGrowthTrend: 'stable',
      categoryBreakdown: {},
      importanceBreakdown: {},
      topMemories: [],
      dormantMemories: [],
      insights: [],
    };
  }

  // Basic statistics
  const totalCharacters = memories.reduce((sum, m) => sum + m.title.length, 0);
  const averageMemorySize = totalCharacters / memories.length;

  // Sort by timestamp
  const sorted = [...memories].sort((a, b) => a.timestamp - b.timestamp);
  const oldestMemory = sorted[0];
  const newestMemory = sorted[sorted.length - 1];

  // Category breakdown
  const categoryBreakdown: Record<string, number> = {};
  memories.forEach(m => {
    const cat = m.category || 'Other';
    categoryBreakdown[cat] = (categoryBreakdown[cat] || 0) + 1;
  });

  // Importance breakdown
  const importanceBreakdown: Record<string, number> = {
    high: 0,
    medium: 0,
    low: 0,
  };
  memories.forEach(m => {
    const imp = m.importance || 'low';
    importanceBreakdown[imp]++;
  });

  // Top memories (by size)
  const topMemories = [...memories]
    .sort((a, b) => b.title.length - a.title.length)
    .slice(0, 5);

  // Dormant memories (not accessed recently)
  const nowMs = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const dormantMemories = memories.filter(
    m => nowMs - m.timestamp > thirtyDaysMs
  ).slice(0, 5);

  // Memory growth trend
  const memoryGrowthTrend = calculateGrowthTrend(memories);

  // Most active day
  const mostActiveDay = findMostActiveDay(memories);

  // Generate insights
  const insights = generateMemoryInsights(
    memories,
    categoryBreakdown,
    importanceBreakdown,
    dormantMemories
  );

  return {
    totalMemories: memories.length,
    totalCharacters,
    averageMemorySize,
    oldestMemory,
    newestMemory,
    mostActiveDay,
    memoryGrowthTrend,
    categoryBreakdown,
    importanceBreakdown,
    topMemories,
    dormantMemories,
    insights,
  };
};

/**
 * Calculate memory growth trend
 */
const calculateGrowthTrend = (
  memories: Memory[]
): 'increasing' | 'stable' | 'decreasing' => {
  if (memories.length < 2) return 'stable';

  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;

  const thisMonth = memories.filter(m => now - m.timestamp <= thirtyDaysMs).length;
  const lastMonth = memories.filter(
    m =>
      now - m.timestamp > thirtyDaysMs &&
      now - m.timestamp <= thirtyDaysMs * 2
  ).length;

  const growth = thisMonth - lastMonth;
  if (growth > lastMonth * 0.2) return 'increasing';
  if (growth < -lastMonth * 0.2) return 'decreasing';
  return 'stable';
};

/**
 * Find the most active day of the week
 */
const findMostActiveDay = (memories: Memory[]): string | null => {
  if (memories.length === 0) return null;

  const dayMap: Record<number, number> = {};
  memories.forEach(m => {
    const day = new Date(m.timestamp).getDay();
    dayMap[day] = (dayMap[day] || 0) + 1;
  });

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const mostActive = Object.entries(dayMap).sort((a, b) => b[1] - a[1])[0];

  return mostActive ? days[parseInt(mostActive[0])] : null;
};

/**
 * Generate insights from analytics
 */
const generateMemoryInsights = (
  memories: Memory[],
  categoryBreakdown: Record<string, number>,
  importanceBreakdown: Record<string, number>,
  dormantMemories: Memory[]
): MemoryInsight[] => {
  const insights: MemoryInsight[] = [];

  // Storage size insight
  const totalSize = memories.reduce((sum, m) => sum + m.title.length, 0);
  if (totalSize > 1000000) { // > 1MB
    insights.push({
      title: 'Large Memory Store',
      description: `Your memories use ${(totalSize / 1024).toFixed(0)}KB of storage`,
      type: 'insight',
      priority: 'medium',
      actionable: true,
      suggestion: 'Consider compressing or archiving old memories',
    });
  }

  // No high-priority memories
  if (importanceBreakdown.high === 0) {
    insights.push({
      title: 'No High-Priority Memories',
      description: 'You have no memories marked as high priority',
      type: 'opportunity',
      priority: 'low',
      actionable: true,
      suggestion: 'Consider marking your most important memories as high priority',
    });
  }

  // Category diversity
  const categoryCount = Object.keys(categoryBreakdown).length;
  if (categoryCount === 1) {
    insights.push({
      title: 'Low Category Diversity',
      description: `All memories are in the "${Object.keys(categoryBreakdown)[0]}" category`,
      type: 'insight',
      priority: 'low',
      actionable: true,
      suggestion: 'Consider organizing memories into multiple categories',
    });
  }

  // Dormant memories
  if (dormantMemories.length > 0) {
    insights.push({
      title: 'Dormant Memories Found',
      description: `${dormantMemories.length} memories haven't been accessed in 30+ days`,
      type: 'recommendation',
      priority: 'medium',
      actionable: true,
      suggestion: 'Review dormant memories to ensure they\'re still relevant',
    });
  }

  // Memory growth
  const avgSize = memories.reduce((sum, m) => sum + m.title.length, 0) / memories.length;
  if (avgSize < 50) {
    insights.push({
      title: 'Short Memory Entries',
      description: `Average memory size is only ${avgSize.toFixed(0)} characters`,
      type: 'recommendation',
      priority: 'low',
      actionable: true,
      suggestion: 'Consider expanding memories with more context and details',
    });
  }

  // Too many memories
  if (memories.length > 100) {
    insights.push({
      title: 'Large Memory Collection',
      description: `You have ${memories.length} memories stored`,
      type: 'insight',
      priority: 'medium',
      actionable: true,
      suggestion: 'Consider organizing into subcategories for better retrieval',
    });
  }

  return insights;
};

/**
 * Get memory usage timeline
 */
export const getMemoryTimeline = (
  memories: Memory[]
): Array<{ date: string; count: number; totalChars: number }> => {
  const timelineMap: Record<string, { count: number; totalChars: number }> = {};

  memories.forEach(m => {
    const date = new Date(m.timestamp).toISOString().split('T')[0];
    if (!timelineMap[date]) {
      timelineMap[date] = { count: 0, totalChars: 0 };
    }
    timelineMap[date].count++;
    timelineMap[date].totalChars += m.title.length;
  });

  return Object.entries(timelineMap)
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
};

/**
 * Calculate memory retention rate
 */
export const calculateRetentionRate = (): {
  one_week: number;
  one_month: number;
  three_months: number;
  all_time: number;
} => {
  const memories = storage.getMemories();
  const now = Date.now();

  const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
  const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
  const threeMonthsMs = 90 * 24 * 60 * 60 * 1000;

  const oneWeek = memories.filter(m => now - m.timestamp <= oneWeekMs).length;
  const oneMonth = memories.filter(m => now - m.timestamp <= oneMonthMs).length;
  const threeMonths = memories.filter(m => now - m.timestamp <= threeMonthsMs).length;

  return {
    one_week: oneWeek,
    one_month: oneMonth,
    three_months: threeMonths,
    all_time: memories.length,
  };
};

/**
 * Get memory quality score
 */
export const getMemoryQualityScore = (): {
  score: number; // 0-100
  breakdown: Record<string, number>;
  recommendations: string[];
} => {
  const memories = storage.getMemories();
  const recommendations: string[] = [];

  let score = 50; // Base score

  // Completeness (20 points)
  const avgLength = memories.length > 0
    ? memories.reduce((sum, m) => sum + m.title.length, 0) / memories.length
    : 0;
  if (avgLength > 200) score += 20;
  else if (avgLength > 100) score += 15;
  else if (avgLength > 50) score += 10;
  else recommendations.push('Expand memory entries with more detail');

  // Category usage (15 points)
  const categories = new Set(memories.map(m => m.category)).size;
  if (categories >= 3) score += 15;
  else if (categories >= 2) score += 10;
  else recommendations.push('Use more categories to organize memories');

  // Importance marking (15 points)
  const withImportance = memories.filter(m => m.importance).length;
  const importanceRate = memories.length > 0 ? withImportance / memories.length : 0;
  if (importanceRate > 0.7) score += 15;
  else if (importanceRate > 0.4) score += 10;
  else recommendations.push('Mark important memories with priority levels');

  // Tags usage (15 points)
  const withTags = memories.filter(m => m.tags && m.tags.length > 0).length;
  const tagRate = memories.length > 0 ? withTags / memories.length : 0;
  if (tagRate > 0.7) score += 15;
  else if (tagRate > 0.4) score += 10;
  else recommendations.push('Add tags to memories for better search');

  // Activity (20 points)
  const growth = calculateGrowthTrend(memories);
  if (growth === 'increasing') score += 20;
  else if (growth === 'stable') score += 15;
  else recommendations.push('Add more memories regularly');

  return {
    score: Math.min(100, score),
    breakdown: {
      completeness: avgLength > 200 ? 20 : avgLength > 100 ? 15 : avgLength > 50 ? 10 : 0,
      categorization: categories >= 3 ? 15 : categories >= 2 ? 10 : 0,
      importance_marking: importanceRate > 0.7 ? 15 : importanceRate > 0.4 ? 10 : 0,
      tagging: tagRate > 0.7 ? 15 : tagRate > 0.4 ? 10 : 0,
      activity: growth === 'increasing' ? 20 : growth === 'stable' ? 15 : 0,
    },
    recommendations,
  };
};

/**
 * Get memory recommendations
 */
export const getMemoryRecommendations = (): string[] => {
  const memories = storage.getMemories();
  const recommendations: string[] = [];

  if (memories.length === 0) {
    recommendations.push('Start by adding your first memory!');
    return recommendations;
  }

  if (memories.length < 5) {
    recommendations.push('Continue adding more memories to build context');
  }

  const stats = calculateMemoryAnalytics();

  stats.insights.forEach(insight => {
    if (insight.suggestion) {
      recommendations.push(insight.suggestion);
    }
  });

  const orphanedMemories = memories.filter(
    m =>
      !m.tags ||
      m.tags.length === 0
  );
  if (orphanedMemories.length > 0) {
    recommendations.push(
      `${orphanedMemories.length} memories could benefit from tags`
    );
  }

  return recommendations;
};

/**
 * Export analytics as JSON
 */
export const exportAnalytics = (): string => {
  const analytics = calculateMemoryAnalytics();
  const timeline = getMemoryTimeline(storage.getMemories());
  const retention = calculateRetentionRate();
  const quality = getMemoryQualityScore();

  return JSON.stringify(
    {
      analytics,
      timeline,
      retention,
      quality,
      exportedAt: new Date().toISOString(),
    },
    null,
    2
  );
};
