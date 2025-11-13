import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { AppSettings } from '@/types/chat';
import { toast } from 'sonner';

interface ThemeCustomizerProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

const PRESET_THEMES = [
  { name: 'Blue', primary: '217 91% 60%', accent: '217 91% 60%', bg: '0 0% 0%' },
  { name: 'Purple', primary: '270 75% 60%', accent: '270 75% 60%', bg: '0 0% 0%' },
  { name: 'Green', primary: '142 76% 36%', accent: '142 76% 36%', bg: '0 0% 0%' },
  { name: 'Red', primary: '0 72% 51%', accent: '0 72% 51%', bg: '0 0% 0%' },
  { name: 'Orange', primary: '25 95% 53%', accent: '25 95% 53%', bg: '0 0% 0%' },
  { name: 'Pink', primary: '330 81% 60%', accent: '330 81% 60%', bg: '0 0% 0%' },
  { name: 'Teal', primary: '180 65% 50%', accent: '180 65% 50%', bg: '0 0% 0%' },
  { name: 'Cyan', primary: '195 75% 60%', accent: '195 75% 60%', bg: '0 0% 0%' },

  // Dark-mode optimized new ones
  { name: 'Midnight Blue', primary: '230 80% 55%', accent: '230 80% 55%', bg: '220 20% 6%' },
  { name: 'Electric Violet', primary: '275 100% 65%', accent: '275 100% 65%', bg: '260 30% 8%' },
  { name: 'Forest Green', primary: '145 80% 35%', accent: '145 80% 35%', bg: '140 20% 5%' },
  { name: 'Crimson Night', primary: '350 80% 55%', accent: '350 80% 55%', bg: '345 25% 8%' },
  { name: 'Amber Glow', primary: '40 100% 60%', accent: '40 100% 60%', bg: '35 25% 7%' },
  { name: 'Deep Rose', primary: '330 85% 58%', accent: '330 85% 58%', bg: '325 25% 8%' },
  { name: 'Ocean Deep', primary: '195 90% 55%', accent: '195 90% 55%', bg: '190 25% 8%' },
  { name: 'Emerald Shadow', primary: '155 70% 40%', accent: '155 70% 40%', bg: '150 20% 6%' },
  { name: 'Neon Lime', primary: '85 100% 60%', accent: '85 100% 60%', bg: '80 30% 7%' },
  { name: 'Hot Magenta', primary: '305 90% 60%', accent: '305 90% 60%', bg: '300 25% 8%' },
  { name: 'Copper', primary: '25 75% 45%', accent: '25 75% 45%', bg: '20 20% 6%' },
  { name: 'Ruby', primary: '355 80% 50%', accent: '355 80% 50%', bg: '350 25% 8%' },
  { name: 'Azure', primary: '210 100% 55%', accent: '210 100% 55%', bg: '215 25% 7%' },
  { name: 'Chartreuse', primary: '95 85% 55%', accent: '95 85% 55%', bg: '90 25% 6%' },
  { name: 'Deep Gold', primary: '48 90% 55%', accent: '48 90% 55%', bg: '42 25% 8%' },
  { name: 'Indigo Twilight', primary: '235 70% 50%', accent: '235 70% 50%', bg: '230 25% 6%' },
  { name: 'Velvet', primary: '280 60% 55%', accent: '280 60% 55%', bg: '275 20% 7%' },
  { name: 'Steel', primary: '210 10% 60%', accent: '210 10% 60%', bg: '210 10% 10%' },
  { name: 'Obsidian', primary: '0 0% 80%', accent: '0 0% 80%', bg: '0 0% 0%' },
  { name: 'Cyberpunk', primary: '300 100% 60%', accent: '180 100% 60%', bg: '260 20% 5%' },
  { name: 'Infrared', primary: '5 100% 65%', accent: '340 100% 60%', bg: '350 20% 7%' },
  { name: 'Ultramarine', primary: '245 100% 60%', accent: '245 100% 60%', bg: '240 25% 7%' },
  { name: 'Tangerine', primary: '30 100% 60%', accent: '30 100% 60%', bg: '25 25% 8%' },
  { name: 'Arctic', primary: '190 75% 65%', accent: '190 75% 65%', bg: '185 20% 6%' },
  { name: 'Rose Quartz', primary: '340 70% 65%', accent: '340 70% 65%', bg: '335 25% 8%' },
  { name: 'Moss', primary: '110 40% 45%', accent: '110 40% 45%', bg: '100 15% 6%' },
];

export const ThemeCustomizer = ({ settings, onUpdateSettings }: ThemeCustomizerProps) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const applyTheme = (theme: typeof PRESET_THEMES[0]) => {
    const newSettings = {
      ...localSettings,
      themeColor: theme.primary,
      accentColor: theme.accent,
      backgroundColor: theme.bg,
    };
    setLocalSettings(newSettings);
    onUpdateSettings(newSettings);
    toast.success(`${theme.name} theme applied`);
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Theme Customization</h2>
      <p className="text-sm text-muted-foreground">
        Choose a color theme for your OnyxGPT
      </p>

      <div className="space-y-3">
        <Label>Preset Themes</Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {PRESET_THEMES.map((theme) => (
            <Button
              key={theme.name}
              variant="outline"
              className="h-20 flex flex-col items-center justify-center gap-2 hover:scale-105 transition-transform"
              onClick={() => applyTheme(theme)}
            >
              <div
                className="w-8 h-8 rounded-full border-2 border-border"
                style={{
                  backgroundColor: `hsl(${theme.primary})`,
                  boxShadow: `0 0 15px hsl(${theme.primary} / 0.5)`,
                }}
              />
              <span className="text-sm">{theme.name}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm">
        <strong>Note:</strong> Theme changes apply instantly. Your preference is saved automatically.
      </div>
    </Card>
  );
};
