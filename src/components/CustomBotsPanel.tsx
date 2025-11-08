import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Search } from 'lucide-react';
import { storage } from '@/lib/storage';

interface CustomBot {
  id: string;
  name: string;
  logo: string;
  systemPrompt: string;
}

const CustomBotsPanel = () => {
  const [bots, setBots] = useState<CustomBot[]>([]);
  const [filteredBots, setFilteredBots] = useState<CustomBot[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBot, setNewBot] = useState({ name: '', logo: '', systemPrompt: '' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const savedBots = storage.getCustomBots();
    setBots(savedBots);
    setFilteredBots(savedBots);
  }, []);

  useEffect(() => {
    const results = bots.filter(bot => bot.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredBots(results);
  }, [searchTerm, bots]);

  const handleCreateBot = () => {
    const newBotWithId = { ...newBot, id: Date.now().toString() };
    const updatedBots = [...bots, newBotWithId];
    setBots(updatedBots);
    storage.saveCustomBots(updatedBots);
    setNewBot({ name: '', logo: '', systemPrompt: '' });
    setShowCreateForm(false);
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">More GPTs</h2>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}><Plus className="mr-2 h-4 w-4" /> Create Bot</Button>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Create New Bot</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Bot Name" value={newBot.name} onChange={(e) => setNewBot({ ...newBot, name: e.target.value })} />
            <Input placeholder="Logo URL" value={newBot.logo} onChange={(e) => setNewBot({ ...newBot, logo: e.target.value })} />
            <Textarea placeholder="System Prompt" value={newBot.systemPrompt} onChange={(e) => setNewBot({ ...newBot, systemPrompt: e.target.value })} />
            <Button onClick={handleCreateBot}>Save Bot</Button>
          </CardContent>
        </Card>
      )}

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input placeholder="Search bots..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBots.map(bot => (
          <Card key={bot.id}>
            <CardHeader className="flex flex-row items-center gap-4">
              <img src={bot.logo} alt={bot.name} className="w-12 h-12 rounded-full" />
              <CardTitle>{bot.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground truncate">{bot.systemPrompt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CustomBotsPanel;
