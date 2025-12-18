import { useEffect } from 'react';
import { getDailyNotification } from '@/lib/daily-notifications';

/**
 * Hook to send daily push notifications on app load
 * Checks if notification was already sent today and sends if not
 */
export const useDailyPushNotifications = () => {
  useEffect(() => {
    const sendDailyNotification = async () => {
      try {
        // Send push notification (async function now)
        const notification = await getDailyNotification();
        
        if (notification) {
          // Log to console for debugging
          console.log('[Push Notification] Sent:', notification.title);
        }
      } catch (error) {
        console.error('[Push Notification] Error:', error);
      }
    };

    // Send notification on app load
    sendDailyNotification();
  }, []);
};
