import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MessageSquare, Image, Brain, Search, Settings, Plus, ChevronLeft, ChevronRight, Trash2, FileText, Zap, Bot
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Chat } from '@/types/chat';

interface ChatSidebarProps {
  chats: Chat[];
  currentChatId: string | null;
  onNewChat: () => void;
  onNewIncognitoChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onNavigate: (section: 'images' | 'memory' | 'search' | 'settings' | 'logs' | 'triggers' | 'bots') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const ChatSidebar = ({
  chats,
  currentChatId,
  onNewChat,
  onNewIncognitoChat,
  onSelectChat,
  onDeleteChat,
  onNavigate,
  collapsed,
  onToggleCollapse,
}: ChatSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const filteredChats = chats.filter(chat => !chat.isIncognito && chat.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className={cn('h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300', collapsed ? 'w-16' : 'w-72')}>
      <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
        {!collapsed && <h2 className="font-bold text-lg">OnyxGPT</h2>}
        <Button variant="ghost" size="icon" onClick={onToggleCollapse}><ChevronLeft className={cn('w-5 h-5 transition-transform', collapsed && 'rotate-180')} /></Button>
      </div>
      <div className="p-4 flex flex-col gap-2">
        <Button onClick={onNewChat} className="w-full" size={collapsed ? 'icon' : 'default'}><Plus className="w-5 h-5" />{!collapsed && <span className="ml-2">New Chat</span>}</Button>
        <Button onClick={onNewIncognitoChat} variant="outline" className="w-full" size={collapsed ? 'icon' : 'default'}><Bot className="w-5 h-5" />{!collapsed && <span className="ml-2">Incognito</span>}</Button>
      </div>
      {!collapsed && <div className="px-4 pb-4"><Input placeholder="Search chats..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-1">
          {filteredChats.map((chat) => (
            <div key={chat.id} className={cn('group flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-sidebar-accent', currentChatId === chat.id && 'bg-sidebar-accent')} onClick={() => onSelectChat(chat.id)}>
              <MessageSquare className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="flex-1 truncate text-sm">{chat.title}</span>}
              {!collapsed && <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-6 w-6" onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}><Trash2 className="w-4 h-4" /></Button>}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t border-sidebar-border p-2 space-y-1">
        <Button variant="ghost" className="w-full justify-start" size={collapsed ? 'icon' : 'default'} onClick={() => onNavigate('bots')}><Bot className="w-5 h-5" />{!collapsed && <span className="ml-2">More GPTs</span>}</Button>
        <Button variant="ghost" className="w-full justify-start" size={collapsed ? 'icon' : 'default'} onClick={() => onNavigate('images')}><Image className="w-5 h-5" />{!collapsed && <span className="ml-2">Images</span>}</Button>
        <Button variant="ghost" className="w-full justify-start" size={collapsed ? 'icon' : 'default'} onClick={() => onNavigate('triggers')}><Zap className="w-5 h-5" />{!collapsed && <span className="ml-2">Triggers</span>}</Button>
        <Button variant="ghost" className="w-full justify-start" size={collapsed ? 'icon' : 'default'} onClick={() => onNavigate('logs')}><FileText className="w-5 h-5" />{!collapsed && <span className="ml-2">Logs</span>}</Button>
        <Button variant="ghost" className="w-full justify-start" size={collapsed ? 'icon' : 'default'} onClick={() => onNavigate('settings')}><Settings className="w-5 h-5" />{!collapsed && <span className="ml-2">Settings</span>}</Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
