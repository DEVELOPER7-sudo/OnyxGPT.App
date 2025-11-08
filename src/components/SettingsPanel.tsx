import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { AppSettings } from '@/types/chat';
import { toast } from 'sonner';
import { Download, Upload, Trash2, Palette, Film } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  onExportChats: () => void;
  onImportChats: (file: File) => void;
  onClearAllData: () => void;
}

const SettingsPanel = ({
  settings,
  onUpdateSettings,
  onExportChats,
  onImportChats,
  onClearAllData,
}: SettingsPanelProps) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdateSettings(localSettings);
    toast.success('Settings saved');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onImportChats(file);
  };

  return (
    <div className="h-full w-full overflow-y-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Palette /> Appearance</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sidebar-color">Sidebar Color</Label>
            <Input id="sidebar-color" type="color" value={localSettings.sidebarColor} onChange={(e) => setLocalSettings({ ...localSettings, sidebarColor: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="background-color">Background Color</Label>
            <Input id="background-color" type="color" value={localSettings.backgroundColor} onChange={(e) => setLocalSettings({ ...localSettings, backgroundColor: e.target.value })} />
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Film /> Response</h2>
        <div className="flex items-center justify-between">
            <Label htmlFor="streaming-toggle">Stream Response</Label>
            <Switch id="streaming-toggle" checked={localSettings.enableStreaming} onCheckedChange={(checked) => setLocalSettings({ ...localSettings, enableStreaming: checked })} />
        </div>
      </Card>
      
      {/* Data Management, Model Selection etc. can be added here as separate cards */}

      <div className="flex justify-end pt-4">
        <Button onClick={handleSave} size="lg">Save Settings</Button>
      </div>
    </div>
  );
};

export default SettingsPanel;
