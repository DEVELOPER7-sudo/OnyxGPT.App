import { NotificationPreferences, Reminder } from '../../types/features';

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  PREFS: 'onyx_notification_prefs',
  REMINDERS: 'onyx_reminders',
};

// ============================================================
// NOTIFICATION PREFERENCES
// ============================================================

export const getNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences | null> => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.PREFS}_${userId}`);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export const createNotificationPreferences = async (
  userId: string
): Promise<NotificationPreferences> => {
  const prefs: NotificationPreferences = {
    id: `prefs-${Date.now()}`,
    user_id: userId,
    email_new_comments: true,
    email_chat_shared: true,
    email_team_update: true,
    email_mentions: true,
    email_weekly_digest: true,
    browser_notifications: true,
    digest_time: '08:00:00',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  localStorage.setItem(`${STORAGE_KEYS.PREFS}_${userId}`, JSON.stringify(prefs));
  return prefs;
};

export const updateNotificationPreferences = async (
  userId: string,
  updates: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  const existing = await getNotificationPreferences(userId) || await createNotificationPreferences(userId);
  const updated = { ...existing, ...updates, updated_at: new Date().toISOString() };
  localStorage.setItem(`${STORAGE_KEYS.PREFS}_${userId}`, JSON.stringify(updated));
  return updated;
};

// ============================================================
// REMINDER OPERATIONS
// ============================================================

const getLocalReminders = (userId: string): Reminder[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.REMINDERS}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalReminders = (userId: string, reminders: Reminder[]): void => {
  localStorage.setItem(`${STORAGE_KEYS.REMINDERS}_${userId}`, JSON.stringify(reminders));
};

export const createReminder = async (
  userId: string,
  title: string,
  scheduledFor: string,
  options?: {
    description?: string;
    recurrence?: 'once' | 'daily' | 'weekly' | 'monthly';
  }
): Promise<Reminder> => {
  const reminders = getLocalReminders(userId);
  const reminder: Reminder = {
    id: `reminder-${Date.now()}`,
    user_id: userId,
    title,
    description: options?.description,
    scheduled_for: scheduledFor,
    recurrence: options?.recurrence || 'once',
    is_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  reminders.unshift(reminder);
  saveLocalReminders(userId, reminders);
  return reminder;
};

export const getReminders = async (userId: string): Promise<Reminder[]> => {
  return getLocalReminders(userId).filter(r => !r.is_completed);
};

export const getUpcomingReminders = async (
  userId: string,
  hoursAhead: number = 24
): Promise<Reminder[]> => {
  const now = new Date();
  const future = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);
  
  return getLocalReminders(userId).filter(r => {
    if (r.is_completed) return false;
    const scheduled = new Date(r.scheduled_for);
    return scheduled >= now && scheduled <= future;
  });
};

export const completeReminder = async (reminderId: string): Promise<Reminder> => {
  // Would need userId to work properly with localStorage
  return { id: reminderId, is_completed: true } as Reminder;
};

export const updateReminder = async (
  reminderId: string,
  updates: Partial<Reminder>
): Promise<Reminder> => {
  return { ...updates, id: reminderId, updated_at: new Date().toISOString() } as Reminder;
};

export const deleteReminder = async (reminderId: string): Promise<void> => {
  console.log('Delete reminder:', reminderId);
};

export const snoozeReminder = async (
  reminderId: string,
  minutesFromNow: number
): Promise<Reminder> => {
  const newTime = new Date(Date.now() + minutesFromNow * 60 * 1000);
  return updateReminder(reminderId, { scheduled_for: newTime.toISOString() });
};

// ============================================================
// BROWSER NOTIFICATIONS
// ============================================================

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    throw new Error('Browser does not support notifications');
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    return await Notification.requestPermission();
  }

  return 'denied';
};

export const sendBrowserNotification = (
  title: string,
  options?: NotificationOptions
): Notification | null => {
  if (Notification.permission !== 'granted') {
    return null;
  }

  return new Notification(title, options);
};

export const registerNotificationCallback = (callback: (data: any) => void) => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'notification') {
          callback(event.data.notification);
        }
      });
    });
  }
};

// ============================================================
// EMAIL DIGEST HELPERS
// ============================================================

export const shouldSendDigest = (preferences: NotificationPreferences): boolean => {
  return preferences.email_weekly_digest;
};

export const getDigestSendTime = (preferences: NotificationPreferences): string => {
  return preferences.digest_time || '08:00:00';
};

export const isInQuietHours = (preferences: NotificationPreferences): boolean => {
  if (!preferences.quiet_hours_start || !preferences.quiet_hours_end) {
    return false;
  }

  const now = new Date();
  const currentTime = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');

  const start = preferences.quiet_hours_start;
  const end = preferences.quiet_hours_end;

  if (start < end) {
    return currentTime >= start && currentTime < end;
  } else {
    return currentTime >= start || currentTime < end;
  }
};

// ============================================================
// NOTIFICATION STATE MANAGEMENT
// ============================================================

export class NotificationManager {
  private userId: string;
  private preferences: NotificationPreferences | null = null;

  constructor(userId: string) {
    this.userId = userId;
  }

  async initialize(): Promise<void> {
    this.preferences = await getNotificationPreferences(this.userId);

    if (!this.preferences) {
      this.preferences = await createNotificationPreferences(this.userId);
    }
  }

  canSendEmail(type: keyof Omit<NotificationPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'quiet_hours_start' | 'quiet_hours_end' | 'digest_time'>): boolean {
    if (!this.preferences) return false;
    if (isInQuietHours(this.preferences)) return false;
    return this.preferences[type] === true;
  }

  canSendBrowserNotification(): boolean {
    if (!this.preferences) return false;
    return this.preferences.browser_notifications === true && Notification.permission === 'granted';
  }

  async sendNotification(
    title: string,
    type: 'comment' | 'mention' | 'share' | 'update',
    options?: NotificationOptions
  ): Promise<void> {
    if (this.canSendBrowserNotification()) {
      sendBrowserNotification(title, options);
    }
  }
}
