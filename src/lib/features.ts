/**
 * Features Library
 * Provides functions for bookmarks, collections, and analytics
 */

import { supabase } from '@/integrations/supabase/client';
import { Bookmark, ChatCollection, BookmarkFolder } from '@/types/features';

/**
 * BOOKMARKS OPERATIONS
 */

export const getBookmarks = async (userId: string): Promise<Bookmark[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return [];
  }
};

export const addBookmark = async (
  userId: string,
  messageId: string,
  folderId?: string,
  note?: string
): Promise<Bookmark> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([
        {
          user_id: userId,
          message_id: messageId,
          content: '', // Content would be populated from message
          folder_id: folderId,
          note: note,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw new Error('Failed to add bookmark');
  }
};

export const removeBookmark = async (messageId: string, userId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('message_id', messageId)
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw new Error('Failed to remove bookmark');
  }
};

export const isMessageBookmarked = async (messageId: string, userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('message_id', messageId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  } catch (error) {
    console.error('Error checking bookmark:', error);
    return false;
  }
};

export const getBookmarkFolders = async (userId: string): Promise<BookmarkFolder[]> => {
  try {
    const { data, error } = await supabase
      .from('bookmark_folders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching bookmark folders:', error);
    return [];
  }
};

export const createBookmarkFolder = async (
  userId: string,
  name: string,
  color?: string,
  parentFolderId?: string
): Promise<BookmarkFolder> => {
  try {
    const { data, error } = await supabase
      .from('bookmark_folders')
      .insert([
        {
          user_id: userId,
          name: name,
          color: color || '#f59e0b',
          parent_folder_id: parentFolderId,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating bookmark folder:', error);
    throw new Error('Failed to create folder');
  }
};

export const updateBookmarkFolder = async (
  folderId: string,
  updates: Partial<BookmarkFolder>
): Promise<BookmarkFolder> => {
  try {
    const { data, error } = await supabase
      .from('bookmark_folders')
      .update(updates)
      .eq('id', folderId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating bookmark folder:', error);
    throw new Error('Failed to update folder');
  }
};

export const deleteBookmarkFolder = async (folderId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('bookmark_folders')
      .delete()
      .eq('id', folderId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting bookmark folder:', error);
    throw new Error('Failed to delete folder');
  }
};

/**
 * COLLECTIONS OPERATIONS
 */

export const getCollections = async (workspaceId: string): Promise<ChatCollection[]> => {
  try {
    const { data, error } = await supabase
      .from('chat_collections')
      .select('*')
      .eq('id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching collections:', error);
    return [];
  }
};

export const createCollection = async (
  workspaceId: string,
  userId: string,
  name: string,
  color?: string,
  parentId?: string
): Promise<ChatCollection> => {
  try {
    const { data, error } = await supabase
      .from('chat_collections')
      .insert([
        {
          user_id: userId,
          name: name,
          color: color || '#6366f1',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating collection:', error);
    throw new Error('Failed to create collection');
  }
};

export const deleteCollection = async (collectionId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('chat_collections')
      .delete()
      .eq('id', collectionId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting collection:', error);
    throw new Error('Failed to delete collection');
  }
};

/**
 * ANALYTICS OPERATIONS
 */

export const getAggregatedAnalytics = async (userId: string) => {
  try {
    const { data: analytics, error } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true });

    if (error) throw error;

    // Process analytics data
    const dailyMessages = analytics?.map((a: any) => ({
      date: a.date,
      count: a.messages_count || 0,
    })) || [];

    const dailyTokens = analytics?.map((a: any) => ({
      date: a.date,
      tokens: a.total_tokens_used || 0,
    })) || [];

    const totalTokens = analytics?.reduce((sum: number, a: any) => sum + (a.total_tokens_used || 0), 0) || 0;
    const totalMessages = analytics?.reduce((sum: number, a: any) => sum + (a.messages_count || 0), 0) || 0;

    return {
      dailyMessages,
      dailyTokens,
      totalTokens,
      totalMessages,
      analytics: analytics || [],
    };
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      dailyMessages: [],
      dailyTokens: [],
      totalTokens: 0,
      totalMessages: 0,
      analytics: [],
    };
  }
};

export const incrementDailyStats = async (
  userId: string,
  model: string,
  tokens: number,
  responseTime?: number
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Get existing stats
    const { data: existing } = await supabase
      .from('user_analytics')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .single();

    if (existing) {
      // Update existing
      await supabase
        .from('user_analytics')
        .update({
          messages_count: (existing.messages_count || 0) + 1,
          total_tokens_used: (existing.total_tokens_used || 0) + tokens,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id);
    } else {
      // Insert new
      await supabase
        .from('user_analytics')
        .insert([
          {
            user_id: userId,
            date: today,
            messages_count: 1,
            total_tokens_used: tokens,
            total_tokens_generated: 0,
            avg_response_time_ms: responseTime || 0,
            model_used: model,
          },
        ]);
    }
  } catch (error) {
    console.error('Error incrementing daily stats:', error);
    // Don't throw - analytics should not break chat functionality
  }
};

/**
 * WORKSPACES OPERATIONS
 */

export const getWorkspaces = async (userId: string) => {
  try {
    // For now, return empty array as workspaces are not fully implemented
    return [];
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }
};

export const createWorkspace = async (userId: string, name: string, description?: string) => {
  try {
    // For now, return a mock workspace
    return {
      id: `workspace-${Date.now()}`,
      user_id: userId,
      name: name,
      description: description,
    };
  } catch (error) {
    console.error('Error creating workspace:', error);
    throw new Error('Failed to create workspace');
  }
};
