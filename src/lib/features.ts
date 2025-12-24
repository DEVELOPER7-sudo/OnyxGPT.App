/**
 * Features Library
 * Provides functions for bookmarks, collections, and analytics
 * Note: These functions require corresponding database tables to be created
 */

import { Bookmark, ChatCollection, BookmarkFolder } from '@/types/features';

// Storage keys for local fallback
const STORAGE_KEYS = {
  BOOKMARKS: 'onyx_bookmarks',
  BOOKMARK_FOLDERS: 'onyx_bookmark_folders',
  COLLECTIONS: 'onyx_collections',
  ANALYTICS: 'onyx_analytics',
};

/**
 * BOOKMARKS OPERATIONS
 * Using localStorage until database tables are created
 */

const getLocalBookmarks = (userId: string): Bookmark[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.BOOKMARKS}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalBookmarks = (userId: string, bookmarks: Bookmark[]): void => {
  localStorage.setItem(`${STORAGE_KEYS.BOOKMARKS}_${userId}`, JSON.stringify(bookmarks));
};

export const getBookmarks = async (userId: string): Promise<Bookmark[]> => {
  return getLocalBookmarks(userId);
};

export const addBookmark = async (
  userId: string,
  messageId: string,
  folderId?: string,
  note?: string
): Promise<Bookmark> => {
  const bookmarks = getLocalBookmarks(userId);
  const newBookmark: Bookmark = {
    id: `bookmark-${Date.now()}`,
    user_id: userId,
    message_id: messageId,
    folder_id: folderId,
    note,
    created_at: new Date().toISOString(),
  };
  bookmarks.unshift(newBookmark);
  saveLocalBookmarks(userId, bookmarks);
  return newBookmark;
};

export const removeBookmark = async (messageId: string, userId: string): Promise<void> => {
  const bookmarks = getLocalBookmarks(userId);
  const filtered = bookmarks.filter(b => b.message_id !== messageId);
  saveLocalBookmarks(userId, filtered);
};

export const isMessageBookmarked = async (messageId: string, userId: string): Promise<boolean> => {
  const bookmarks = getLocalBookmarks(userId);
  return bookmarks.some(b => b.message_id === messageId);
};

/**
 * BOOKMARK FOLDERS OPERATIONS
 */

const getLocalFolders = (userId: string): BookmarkFolder[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.BOOKMARK_FOLDERS}_${userId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalFolders = (userId: string, folders: BookmarkFolder[]): void => {
  localStorage.setItem(`${STORAGE_KEYS.BOOKMARK_FOLDERS}_${userId}`, JSON.stringify(folders));
};

export const getBookmarkFolders = async (userId: string): Promise<BookmarkFolder[]> => {
  return getLocalFolders(userId);
};

export const createBookmarkFolder = async (
  userId: string,
  name: string,
  color?: string,
  parentFolderId?: string
): Promise<BookmarkFolder> => {
  const folders = getLocalFolders(userId);
  const newFolder: BookmarkFolder = {
    id: `folder-${Date.now()}`,
    user_id: userId,
    workspace_id: 'default',
    name,
    color: color || '#f59e0b',
    created_at: new Date().toISOString(),
  };
  folders.unshift(newFolder);
  saveLocalFolders(userId, folders);
  return newFolder;
};

export const updateBookmarkFolder = async (
  folderId: string,
  updates: Partial<BookmarkFolder>
): Promise<BookmarkFolder> => {
  // This would need the userId to work with localStorage
  // For now, return a placeholder
  return { ...updates, id: folderId } as BookmarkFolder;
};

export const deleteBookmarkFolder = async (folderId: string): Promise<void> => {
  // Would need userId to delete from localStorage
  console.log('Delete folder:', folderId);
};

/**
 * COLLECTIONS OPERATIONS
 */

const getLocalCollections = (workspaceId: string): ChatCollection[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.COLLECTIONS}_${workspaceId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalCollections = (workspaceId: string, collections: ChatCollection[]): void => {
  localStorage.setItem(`${STORAGE_KEYS.COLLECTIONS}_${workspaceId}`, JSON.stringify(collections));
};

export const getCollections = async (workspaceId: string): Promise<ChatCollection[]> => {
  return getLocalCollections(workspaceId);
};

export const createCollection = async (
  workspaceId: string,
  userId: string,
  name: string,
  color?: string,
  parentId?: string
): Promise<ChatCollection> => {
  const collections = getLocalCollections(workspaceId);
  const newCollection: ChatCollection = {
    id: `collection-${Date.now()}`,
    workspace_id: workspaceId,
    name,
    color: color || '#6366f1',
    parent_id: parentId,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  collections.unshift(newCollection);
  saveLocalCollections(workspaceId, collections);
  return newCollection;
};

export const deleteCollection = async (collectionId: string): Promise<void> => {
  console.log('Delete collection:', collectionId);
};

/**
 * ANALYTICS OPERATIONS
 */

export const getAggregatedAnalytics = async (userId: string) => {
  // Return empty analytics for now
  return {
    dailyMessages: [] as { date: string; count: number }[],
    dailyTokens: [] as { date: string; tokens: number }[],
    totalTokens: 0,
    totalMessages: 0,
    analytics: [],
  };
};

export const incrementDailyStats = async (
  userId: string,
  model: string,
  tokens: number,
  responseTime?: number
): Promise<void> => {
  // Analytics would be tracked locally or in database
  console.log('Increment stats:', { userId, model, tokens, responseTime });
};

/**
 * WORKSPACES OPERATIONS
 */

export const getWorkspaces = async (userId: string) => {
  // Return empty array as workspaces are not fully implemented
  return [];
};

export const createWorkspace = async (userId: string, name: string, description?: string) => {
  // Return a mock workspace matching the Workspace type
  return {
    id: `workspace-${Date.now()}`,
    name,
    owner_id: userId,
    description,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};
