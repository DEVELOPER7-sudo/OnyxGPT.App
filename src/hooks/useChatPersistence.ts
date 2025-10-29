import { useEffect, useRef } from 'react';
import { Chat } from '@/types/chat';
import { storage } from '@/lib/storage';

export const useChatPersistence = (chats: Chat[], currentChatId: string | null) => {
  const lastSavedRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Debounce saves to prevent excessive writes
    const currentState = JSON.stringify({ chats, currentChatId });
    
    if (currentState !== lastSavedRef.current) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        try {
          storage.saveChats(chats);
          if (currentChatId) {
            storage.setCurrentChatId(currentChatId);
          }
          lastSavedRef.current = currentState;
        } catch (error) {
          console.error('Error persisting chats:', error);
        }
      }, 500); // Save after 500ms of inactivity
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [chats, currentChatId]);

  // Save before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      try {
        storage.saveChats(chats);
        if (currentChatId) {
          storage.setCurrentChatId(currentChatId);
        }
      } catch (error) {
        console.error('Error saving before unload:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [chats, currentChatId]);
};
