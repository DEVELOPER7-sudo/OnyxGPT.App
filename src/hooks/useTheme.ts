import { useEffect } from 'react';
import { AppSettings } from '@/types/chat';
import { storage } from '@/lib/storage';

export const useTheme = (settings?: AppSettings) => {
  useEffect(() => {
    // Use provided settings or read from localStorage
    const actualSettings = settings || storage.getSettings();
    const root = document.documentElement;
    
    if (actualSettings.themeColor) {
      root.style.setProperty('--primary', actualSettings.themeColor);
      root.style.setProperty('--ring', actualSettings.themeColor);
      root.style.setProperty('--sidebar-primary', actualSettings.themeColor);
      root.style.setProperty('--sidebar-ring', actualSettings.themeColor);
      
      // Update glow effects
      const [h, s, l] = actualSettings.themeColor.split(' ');
      root.style.setProperty('--glow-blue', `0 0 20px hsl(${h} ${s} ${l} / 0.5)`);
      root.style.setProperty('--glow-blue-strong', `0 0 30px hsl(${h} ${s} ${l} / 0.8)`);
    }
    
    if (actualSettings.accentColor) {
      root.style.setProperty('--accent', actualSettings.accentColor);
    }
    
    if (actualSettings.backgroundColor) {
      root.style.setProperty('--background', actualSettings.backgroundColor);
    }
  }, [settings]);
};
