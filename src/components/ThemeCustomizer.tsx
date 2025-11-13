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
  // === Dark Mode Themes ===
  { name: 'Blue', primary: '217 91% 60%', accent: '217 91% 60%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Purple', primary: '270 75% 60%', accent: '270 75% 60%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Green', primary: '142 76% 36%', accent: '142 76% 36%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Red', primary: '0 72% 51%', accent: '0 72% 51%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Orange', primary: '25 95% 53%', accent: '25 95% 53%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Pink', primary: '330 81% 60%', accent: '330 81% 60%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Teal', primary: '180 65% 50%', accent: '180 65% 50%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Cyan', primary: '195 75% 60%', accent: '195 75% 60%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Indigo', primary: '231 70% 60%', accent: '231 70% 60%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Lime', primary: '75 80% 50%', accent: '75 80% 50%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Amber', primary: '45 95% 55%', accent: '45 95% 55%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Rose', primary: '345 85% 60%', accent: '345 85% 60%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Violet', primary: '255 80% 65%', accent: '255 80% 65%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Gold', primary: '50 95% 50%', accent: '50 95% 50%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Mint', primary: '160 60% 55%', accent: '160 60% 55%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Sky', primary: '200 90% 65%', accent: '200 90% 65%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Magenta', primary: '305 85% 60%', accent: '305 85% 60%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Crimson', primary: '348 83% 47%', accent: '348 83% 47%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Emerald', primary: '150 80% 35%', accent: '150 80% 35%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Navy', primary: '220 50% 25%', accent: '220 50% 25%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Bronze', primary: '30 60% 40%', accent: '30 60% 40%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Lavender', primary: '260 60% 75%', accent: '260 60% 75%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Coral', primary: '16 90% 65%', accent: '16 90% 65%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Turquoise', primary: '175 70% 55%', accent: '175 70% 55%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Slate', primary: '210 10% 40%', accent: '210 10% 40%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Silver', primary: '0 0% 70%', accent: '0 0% 70%', bg: '0 0% 10%', mode: 'dark' },
  { name: 'Charcoal', primary: '210 10% 20%', accent: '210 10% 20%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Pastel Blue', primary: '210 100% 80%', accent: '210 100% 80%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Pastel Pink', primary: '340 80% 85%', accent: '340 80% 85%', bg: '0 0% 0%', mode: 'dark' },
  { name: 'Pastel Green', primary: '130 60% 75%', accent: '130 60% 75%', bg: '0 0% 0%', mode: 'dark' },

  // === Light Mode Variants ===
  { name: 'Blue', primary: '217 91% 55%', accent: '217 91% 60%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Purple', primary: '270 75% 55%', accent: '270 75% 60%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Green', primary: '142 70% 35%', accent: '142 70% 40%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Red', primary: '0 72% 50%', accent: '0 72% 55%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Orange', primary: '25 95% 50%', accent: '25 95% 55%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Pink', primary: '330 81% 65%', accent: '330 81% 60%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Teal', primary: '180 65% 45%', accent: '180 65% 50%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Cyan', primary: '195 75% 55%', accent: '195 75% 60%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Indigo', primary: '231 70% 55%', accent: '231 70% 60%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Lime', primary: '75 80% 45%', accent: '75 80% 50%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Amber', primary: '45 95% 50%', accent: '45 95% 55%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Rose', primary: '345 85% 55%', accent: '345 85% 60%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Violet', primary: '255 80% 60%', accent: '255 80% 65%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Gold', primary: '50 95% 45%', accent: '50 95% 50%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Mint', primary: '160 60% 50%', accent: '160 60% 55%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Sky', primary: '200 90% 60%', accent: '200 90% 65%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Magenta', primary: '305 85% 55%', accent: '305 85% 60%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Crimson', primary: '348 83% 45%', accent: '348 83% 50%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Emerald', primary: '150 80% 30%', accent: '150 80% 35%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Navy', primary: '220 50% 30%', accent: '220 50% 35%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Bronze', primary: '30 60% 35%', accent: '30 60% 40%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Lavender', primary: '260 60% 70%', accent: '260 60% 75%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Coral', primary: '16 90% 60%', accent: '16 90% 65%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Turquoise', primary: '175 70% 50%', accent: '175 70% 55%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Slate', primary: '210 10% 45%', accent: '210 10% 40%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Silver', primary: '0 0% 65%', accent: '0 0% 70%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Charcoal', primary: '210 10% 25%', accent: '210 10% 30%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Pastel Blue', primary: '210 100% 75%', accent: '210 100% 80%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Pastel Pink', primary: '340 80% 80%', accent: '340 80% 85%', bg: '0 0% 100%', mode: 'light' },
  { name: 'Pastel Green', primary: '130 60% 70%', accent: '130 60% 75%', bg: '0 0% 100%', mode: 'light' },
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
