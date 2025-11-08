import { useEffect } from 'react';
import { AppSettings } from '@/types/chat';

const applyTheme = (settings: AppSettings) => {
    const root = document.documentElement;

    // Set background color
    if(settings.backgroundColor) {
        root.style.setProperty('--background', settings.backgroundColor);
    } else {
        root.style.removeProperty('--background');
    }

    // Set sidebar background color
    if(settings.sidebarColor) {
        root.style.setProperty('--sidebar-background', settings.sidebarColor);
    } else {
        root.style.removeProperty('--sidebar-background');
    }

    // Set theme and accent colors
    if (settings.themeColor) {
      root.style.setProperty('--primary', settings.themeColor);
    }
    if (settings.accentColor) {
      root.style.setProperty('--accent', settings.accentColor);
    }
};

export const useTheme = (settings: AppSettings) => {
  useEffect(() => {
    applyTheme(settings);
  }, [settings.themeColor, settings.accentColor, settings.backgroundColor, settings.sidebarColor]);
};
