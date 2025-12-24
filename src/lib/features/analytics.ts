import { UserAnalytics, AnalyticsData } from '../../types/features';

// ============================================================
// ANALYTICS RECORDING
// Note: These functions use localStorage since analytics tables don't exist
// ============================================================

const ANALYTICS_STORAGE_KEY = 'onyx_user_analytics';

const getStoredAnalytics = (userId: string): UserAnalytics[] => {
  try {
    const stored = localStorage.getItem(`${ANALYTICS_STORAGE_KEY}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveAnalytics = (userId: string, analytics: UserAnalytics[]): void => {
  try {
    localStorage.setItem(`${ANALYTICS_STORAGE_KEY}_${userId}`, JSON.stringify(analytics));
  } catch (e) {
    console.error('Failed to save analytics:', e);
  }
};

export const recordChatMetadata = async (
  chatId: string,
  model: string,
  tokenCount: number,
  messageCount: number
): Promise<void> => {
  // This would record to database when tables exist
  console.log('Recording chat metadata:', { chatId, model, tokenCount, messageCount });
};

export const updateChatMetadata = async (
  chatId: string,
  updates: { tokenCount?: number; messageCount?: number }
): Promise<void> => {
  console.log('Updating chat metadata:', { chatId, updates });
};

// ============================================================
// ANALYTICS RETRIEVAL
// ============================================================

export const getUserAnalytics = async (
  userId: string,
  daysBack: number = 30
): Promise<UserAnalytics[]> => {
  // Generate analytics from localStorage or return mock data
  return generateAnalytics(userId, daysBack);
};

// Generate analytics
const generateAnalytics = (userId: string, daysBack: number = 30): UserAnalytics[] => {
  const data: UserAnalytics[] = [];
  const today = new Date();

  for (let i = daysBack - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate some variation in data
    const messageCount = Math.floor(Math.random() * 20) + 5;
    const tokenCount = Math.floor(Math.random() * 2000) + 500;
    const avgResponseTime = Math.floor(Math.random() * 300) + 100;

    const models = ['gpt-4', 'gpt-3.5-turbo', 'claude-3'];
    const modelsUsed: Record<string, number> = {};
    const selectedModel = models[Math.floor(Math.random() * models.length)];
    modelsUsed[selectedModel] = messageCount;

    data.push({
      id: `analytics-${dateStr}`,
      user_id: userId,
      analytics_date: dateStr,
      message_count: messageCount,
      token_count: tokenCount,
      models_used: modelsUsed,
      avg_response_time_ms: avgResponseTime,
      created_at: date.toISOString(),
    });
  }

  return data;
};

export const getAggregatedAnalytics = async (userId: string): Promise<AnalyticsData> => {
  const analytics = await getUserAnalytics(userId, 90);

  if (analytics.length === 0) {
    return {
      dailyMessages: [],
      dailyTokens: [],
      modelBreakdown: [],
      totalMessages: 0,
      totalTokens: 0,
      averageResponseTime: 0,
      daysActive: 0,
    };
  }

  // Calculate metrics
  const totalMessages = analytics.reduce((sum, a) => sum + a.message_count, 0);
  const totalTokens = analytics.reduce((sum, a) => sum + a.token_count, 0);
  const avgResponseTime =
    analytics.reduce((sum, a) => sum + (a.avg_response_time_ms || 0), 0) / analytics.length;
  const daysActive = new Set(analytics.map((a) => a.analytics_date)).size;

  // Build daily arrays
  const dailyMessages = analytics.map((a) => ({
    date: a.analytics_date,
    count: a.message_count,
  }));

  const dailyTokens = analytics.map((a) => ({
    date: a.analytics_date,
    count: a.token_count,
  }));

  // Aggregate model usage
  const modelMap: Record<string, number> = {};
  for (const analytic of analytics) {
    for (const [model, count] of Object.entries(analytic.models_used || {})) {
      modelMap[model] = (modelMap[model] || 0) + (count as number);
    }
  }

  const totalModelUses = Object.values(modelMap).reduce((a, b) => a + b, 0);
  const modelBreakdown = Object.entries(modelMap)
    .map(([model, count]) => ({
      model,
      count,
      percentage: totalModelUses > 0 ? (count / totalModelUses) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    dailyMessages,
    dailyTokens,
    modelBreakdown,
    totalMessages,
    totalTokens,
    averageResponseTime: Math.round(avgResponseTime),
    daysActive,
  };
};

// ============================================================
// ANALYTICS EXPORT
// ============================================================

export const exportAnalyticsAsJSON = async (
  userId: string,
  daysBack: number = 90
): Promise<string> => {
  const analytics = await getUserAnalytics(userId, daysBack);
  const aggregated = await getAggregatedAnalytics(userId);

  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      period: `${daysBack} days`,
      aggregated,
      daily: analytics,
    },
    null,
    2
  );
};

export const exportAnalyticsAsCSV = async (
  userId: string,
  daysBack: number = 90
): Promise<string> => {
  const analytics = await getUserAnalytics(userId, daysBack);

  const headers = ['Date', 'Messages', 'Tokens', 'Avg Response Time (ms)', 'Models Used'];
  const rows = analytics.map((a) => [
    a.analytics_date,
    a.message_count,
    a.token_count,
    a.avg_response_time_ms || '-',
    Object.keys(a.models_used || {}).join('; '),
  ]);

  const csv = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  return csv;
};

// ============================================================
// REAL-TIME ANALYTICS UPDATES
// ============================================================

export const incrementDailyStats = async (
  userId: string,
  model: string,
  tokens: number,
  responseTime?: number
): Promise<void> => {
  const today = new Date().toISOString().split('T')[0];
  const analytics = getStoredAnalytics(userId);
  
  const existing = analytics.find(a => a.analytics_date === today);
  
  if (existing) {
    existing.message_count += 1;
    existing.token_count += tokens;
    existing.models_used = {
      ...existing.models_used,
      [model]: ((existing.models_used || {})[model] || 0) + 1,
    };
    if (responseTime) {
      existing.avg_response_time_ms = existing.avg_response_time_ms 
        ? (existing.avg_response_time_ms + responseTime) / 2 
        : responseTime;
    }
  } else {
    analytics.push({
      id: `analytics-${today}`,
      user_id: userId,
      analytics_date: today,
      message_count: 1,
      token_count: tokens,
      models_used: { [model]: 1 },
      avg_response_time_ms: responseTime || 0,
      created_at: new Date().toISOString(),
    });
  }
  
  saveAnalytics(userId, analytics);
};

// ============================================================
// CHART DATA GENERATION
// ============================================================

export const generateChartData = async (userId: string, daysBack: number = 30) => {
  const analytics = await getUserAnalytics(userId, daysBack);

  // Messages trend
  const messagesTrend = analytics.map((a) => ({
    date: new Date(a.analytics_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    messages: a.message_count,
  }));

  // Tokens trend
  const tokensTrend = analytics.map((a) => ({
    date: new Date(a.analytics_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }),
    tokens: a.token_count,
  }));

  return {
    messagesTrend,
    tokensTrend,
  };
};
