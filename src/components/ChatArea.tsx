import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { toast } from 'sonner';

import LoadingDots from '@/components/LoadingDots';
import WelcomeMessage from '@/components/WelcomeMessage';
import TriggerBar from '@/components/TriggerBar';
import MessageContent from '@/components/MessageContent'; // Import MessageContent
import { allTriggers } from '@/lib/triggers';

import {
  Send, Mic, Paperclip, Copy, ThumbsUp, ThumbsDown, RotateCcw, Edit2, Trash2, Loader2, Square, X
} from 'lucide-react';
import { Chat, Message } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ChatAreaProps {
  chat: Chat | null;
  onSendMessage: (content: string, imageData?: { imageUrl: string | string[]; prompt: string }) => void;
  onUpdateTitle: (chatId: string, title: string) => void;
  onDeleteChat: (chatId: string) => Promise<void>;
  onRegenerateMessage: (messageId: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  isLoading: boolean;
  onStopGeneration: () => void;
}

const ChatArea = ({
  chat,
  onSendMessage,
  onUpdateTitle,
  onDeleteChat,
  onRegenerateMessage,
  onEditMessage,
  isLoading,
  onStopGeneration,
}: ChatAreaProps) => {
  const [input, setInput] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingMessageContent, setEditingMessageContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();
  const { playMessageSent } = useSoundEffects();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages, isLoading]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const urls = await Promise.all(files.map(file => uploadFile(file).then(f => f?.url || '')));
    setUploadedImages([...uploadedImages, ...urls.filter(Boolean)]);
  };

  const handleSend = async () => {
    if (!input.trim() && uploadedImages.length === 0) return;
    const prompt = input.trim();
    onSendMessage(prompt, uploadedImages.length > 0 ? { imageUrl: uploadedImages, prompt } : undefined);
    setInput('');
    setUploadedImages([]);
    playMessageSent();
  };

  const handleTriggerSelect = (trigger: string) => {
    setInput(prev => `${prev} ${trigger}`.trim());
  };

  if (!chat) {
    return <WelcomeMessage />;
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <div className="border-b border-border p-3 flex items-center justify-between bg-card/50 backdrop-blur-sm">
        {isEditingTitle ? (
          <input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} onBlur={() => onUpdateTitle(chat.id, editedTitle)} autoFocus />
        ) : (
          <h2 className="text-lg font-semibold cursor-pointer" onClick={() => setIsEditingTitle(true)}>{chat.title}</h2>
        )}
        <Button variant="ghost" size="icon" onClick={() => onDeleteChat(chat.id)}><Trash2 className="w-5 h-5" /></Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {chat.messages.map((message) => (
            <div key={message.id} className={cn('flex gap-3', message.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={cn('max-w-[85%] rounded-2xl p-4 shadow-lg', message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border')}>
                {message.triggers && message.metadata && message.rawContent && (
                  <TriggerBar triggers={message.triggers} metadata={message.metadata} rawContent={message.rawContent} />
                )}
                {message.imageUrl && Array.isArray(message.imageUrl) && message.imageUrl.map((url, i) => <img key={i} src={url} className="rounded-lg mb-2 max-h-60" />) }
                {message.imageUrl && !Array.isArray(message.imageUrl) && <img src={message.imageUrl as string} className="rounded-lg mb-2 max-h-60" />}
                <MessageContent content={message.content} />
                {message.role === 'assistant' && (
                  <div className="flex gap-2 mt-2 pt-2 border-t border-border/20">
                    <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(message.content)}><Copy className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon"><ThumbsUp className="w-4 h-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => onRegenerateMessage(message.id)}><RotateCcw className="w-4 h-4" /></Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && <LoadingDots />}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          {uploadedImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {uploadedImages.map((img, i) => <img key={i} src={img} className="w-16 h-16 object-cover rounded" />)}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask OnyxGPT..." className="min-h-[60px] max-h-[150px] resize-none" onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()} />
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" multiple accept="image/*" />
            <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}><Paperclip className="w-5 h-5" /></Button>
            <Button variant="ghost" size="icon"><Mic className="w-5 h-5" /></Button>
            <Button onClick={handleSend} disabled={isLoading || isUploading}>{isLoading ? <Loader2 className="animate-spin" /> : <Send />}</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
             <Select onValueChange={handleTriggerSelect}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Add a trigger..." />
                </SelectTrigger>
                <SelectContent>
                    {allTriggers.map(t => <SelectItem key={t.trigger} value={t.trigger}>{t.trigger}</SelectItem>)}
                </SelectContent>
             </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
