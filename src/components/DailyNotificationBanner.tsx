import { useState, useEffect } from 'react';
import { getDailyNotification } from '@/lib/daily-notifications';
import { X, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DailyNotificationBannerProps {
  onClose?: () => void;
}

const DailyNotificationBanner = ({ onClose }: DailyNotificationBannerProps) => {
  const [notification, setNotification] = useState<any | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dailyNotif = getDailyNotification();
    if (dailyNotif) {
      setNotification(dailyNotif);
      // Show notification after a brief delay for better UX
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!notification || !isVisible) return null;

  return (
    <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
      <Card className={`pointer-events-auto bg-gradient-to-r from-primary/90 to-primary/70 border-primary/50 text-white shadow-lg animate-slideUp relative overflow-hidden`}>
        {/* Animated background effect */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,.2)_25%,rgba(255,255,255,.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,.2)_75%,rgba(255,255,255,.2))] bg-[length:40px_40px] animate-pulse"></div>
        </div>
        
        <div className="relative p-4 flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 text-2xl pt-1">
            <span>{notification.emoji}</span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base mb-1 line-clamp-2">
              {notification.title}
            </h3>
            <p className="text-sm text-white/90 line-clamp-2">
              {notification.message}
            </p>
          </div>

          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="flex-shrink-0 h-8 w-8 hover:bg-white/20 text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/20 relative overflow-hidden">
          <div 
            className="h-full bg-white animate-pulse"
            style={{
              animation: 'shrink 5s linear forwards',
            }}
          />
        </div>
      </Card>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default DailyNotificationBanner;
