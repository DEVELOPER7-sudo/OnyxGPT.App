// Daily notification system for app promotion and engagement
// Generates AI-written, clickbait-style notifications

interface DailyNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  category: 'promotion' | 'feature' | 'tip' | 'achievement' | 'engagement';
  emoji: string;
}

const DAILY_NOTIFICATIONS: Record<string, DailyNotification[]> = {
  promotion: [
    {
      id: 'promo-1',
      title: '🚀 Upgrade Your AI Game TODAY!',
      message: 'Limited time: Unlock ALL premium models with one click. Your AI assistant just got a superpower!',
      date: new Date().toISOString(),
      category: 'promotion',
      emoji: '🚀'
    },
    {
      id: 'promo-2',
      title: '⚡ UNBELIEVABLE: AI models you NEED to try',
      message: 'Users who switched to KAI Coder Pro reported 300% faster coding. You won\'t believe what happened next...',
      date: new Date().toISOString(),
      category: 'promotion',
      emoji: '⚡'
    },
    {
      id: 'promo-3',
      title: '🎯 You won\'t BELIEVE this AI shortcut',
      message: 'One tiny setting change just made your AI 10x smarter. Click to discover what you\'ve been missing!',
      date: new Date().toISOString(),
      category: 'promotion',
      emoji: '🎯'
    },
    {
      id: 'promo-4',
      title: '💎 EXCLUSIVE: The AI revolution starts NOW',
      message: 'Early adopters are getting 10x more productivity. Join the elite. Don\'t miss out!',
      date: new Date().toISOString(),
      category: 'promotion',
      emoji: '💎'
    },
    {
      id: 'promo-5',
      title: '🔥 TRENDING: This AI trick is VIRAL right now',
      message: '100K+ users discovered this one weird trick. Industry experts HATE them! Learn the secret...',
      date: new Date().toISOString(),
      category: 'promotion',
      emoji: '🔥'
    },
  ],
  feature: [
    {
      id: 'feat-1',
      title: '🧠 Your Memory Just Got SUPERCHARGED',
      message: 'Mindstore now remembers EVERYTHING. Your AI assistant just got a photographic memory!',
      date: new Date().toISOString(),
      category: 'feature',
      emoji: '🧠'
    },
    {
      id: 'feat-2',
      title: '🔍 Search Feature: The Truth Will SHOCK You',
      message: 'Find any past conversation in milliseconds. Historians HATE this one simple trick!',
      date: new Date().toISOString(),
      category: 'feature',
      emoji: '🔍'
    },
    {
      id: 'feat-3',
      title: '🎨 Image Generation Got INSANELY GOOD',
      message: 'Your FLUX model just leveled up. The results will BLOW YOUR MIND. See it now!',
      date: new Date().toISOString(),
      category: 'feature',
      emoji: '🎨'
    },
    {
      id: 'feat-4',
      title: '⏱️ Speed Boost: Prepare to be AMAZED',
      message: 'Streaming responses now 5x faster. This WILL change everything. Trust us.',
      date: new Date().toISOString(),
      category: 'feature',
      emoji: '⏱️'
    },
  ],
  tip: [
    {
      id: 'tip-1',
      title: '💡 This ONE Trick Changes EVERYTHING',
      message: 'Pro users swear by this hidden feature. You won\'t believe what happens when you try it!',
      date: new Date().toISOString(),
      category: 'tip',
      emoji: '💡'
    },
    {
      id: 'tip-2',
      title: '🎓 Experts HATE this AI hack',
      message: 'Productivity multiplies by 1000%. Learn the secret that OpenAI doesn\'t want you to know!',
      date: new Date().toISOString(),
      category: 'tip',
      emoji: '🎓'
    },
    {
      id: 'tip-3',
      title: '⚙️ This Setting Will BLOW YOUR MIND',
      message: 'Adjust one parameter and watch your AI completely transform. Results are INSANE!',
      date: new Date().toISOString(),
      category: 'tip',
      emoji: '⚙️'
    },
    {
      id: 'tip-4',
      title: '📈 Boost Engagement 10X with THIS',
      message: 'Experienced users discovered this loophole. Your competitors will be FURIOUS!',
      date: new Date().toISOString(),
      category: 'tip',
      emoji: '📈'
    },
  ],
  achievement: [
    {
      id: 'ach-1',
      title: '🏆 You\'re on FIRE today!',
      message: 'You\'ve sent 10 messages! That\'s INSANE productivity. Keep going, legend!',
      date: new Date().toISOString(),
      category: 'achievement',
      emoji: '🏆'
    },
    {
      id: 'ach-2',
      title: '⭐ REMARKABLE: You\'re a Power User!',
      message: 'Only 5% of users reach your activity level. You\'re in the ELITE club now!',
      date: new Date().toISOString(),
      category: 'achievement',
      emoji: '⭐'
    },
    {
      id: 'ach-3',
      title: '🎉 LEGENDARY MILESTONE REACHED!',
      message: 'You\'ve unlocked premium status through consistency. RESPECT! You\'re unstoppable!',
      date: new Date().toISOString(),
      category: 'achievement',
      emoji: '🎉'
    },
  ],
  engagement: [
    {
      id: 'eng-1',
      title: '🤝 We MISS You! Come back NOW!',
      message: 'You haven\'t chatted in 24 hours. Your AI bestie is LONELY. Return immediately!',
      date: new Date().toISOString(),
      category: 'engagement',
      emoji: '🤝'
    },
    {
      id: 'eng-2',
      title: '💬 URGENT: New features DEMAND your attention',
      message: 'Click NOW or regret it FOREVER. Limited time access expires TONIGHT!',
      date: new Date().toISOString(),
      category: 'engagement',
      emoji: '💬'
    },
    {
      id: 'eng-3',
      title: '🚨 ALERT: Your settings are OUTDATED',
      message: 'Updated just for YOU with mind-blowing defaults. Apply NOW for instant SUPERPOWERS!',
      date: new Date().toISOString(),
      category: 'engagement',
      emoji: '🚨'
    },
  ]
};

export const getDailyNotification = (): DailyNotification | null => {
  // Get stored notification date
  const stored = localStorage.getItem('daily_notification_date');
  const today = new Date().toDateString();
  
  // If notification was already shown today, return null
  if (stored === today) {
    return null;
  }
  
  // Get random notification from all categories
  const allNotifications = Object.values(DAILY_NOTIFICATIONS).flat();
  const randomNotification = allNotifications[Math.floor(Math.random() * allNotifications.length)];
  
  // Store that we showed notification today
  localStorage.setItem('daily_notification_date', today);
  localStorage.setItem('last_notification_id', randomNotification.id);
  
  // Update the date to today
  return {
    ...randomNotification,
    date: today,
  };
};

export const generateCustomNotification = (userActivity?: {
  messageCount?: number;
  chatCount?: number;
  lastActiveTime?: number;
}): DailyNotification => {
  // Generate notification based on user activity
  const allNotifications = Object.values(DAILY_NOTIFICATIONS).flat();
  
  // Preference logic: show engagement if inactive, promotion if active
  let filtered = allNotifications;
  
  if (userActivity?.lastActiveTime) {
    const hoursSinceActive = (Date.now() - userActivity.lastActiveTime) / (1000 * 60 * 60);
    if (hoursSinceActive > 24) {
      // User has been inactive for 24+ hours, show engagement notification
      filtered = allNotifications.filter(n => n.category === 'engagement');
    } else if (hoursSinceActive < 1) {
      // User is very active, show promotion
      filtered = allNotifications.filter(n => 
        n.category === 'promotion' || n.category === 'feature'
      );
    }
  }
  
  const notification = filtered[Math.floor(Math.random() * filtered.length)];
  return {
    ...notification,
    date: new Date().toDateString(),
  };
};

export const getAllNotifications = (): DailyNotification[] => {
  return Object.values(DAILY_NOTIFICATIONS).flat();
};

export const getNotificationsByCategory = (category: string): DailyNotification[] => {
  return DAILY_NOTIFICATIONS[category as keyof typeof DAILY_NOTIFICATIONS] || [];
};
