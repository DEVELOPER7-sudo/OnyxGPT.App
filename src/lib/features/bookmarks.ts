import { Bookmark, BookmarkFolder } from '../../types/features';

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  BOOKMARK_FOLDERS: 'onyx_bookmark_folders',
  BOOKMARKS: 'onyx_bookmarks',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

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

// ============================================================
// BOOKMARK FOLDER OPERATIONS
// ============================================================

export const createBookmarkFolder = async (
  userId: string,
  workspaceId: string,
  name: string,
  color: string = '#808080'
): Promise<BookmarkFolder> => {
  const folders = getLocalFolders(userId);
  const newFolder: BookmarkFolder = {
    id: `folder-${Date.now()}`,
    user_id: userId,
    workspace_id: workspaceId,
    name,
    color,
    created_at: new Date().toISOString(),
  };
  folders.unshift(newFolder);
  saveLocalFolders(userId, folders);
  return newFolder;
};

export const getBookmarkFolders = async (
  userId: string,
  workspaceId?: string
): Promise<BookmarkFolder[]> => {
  const folders = getLocalFolders(userId);
  if (workspaceId) {
    return folders.filter(f => f.workspace_id === workspaceId);
  }
  return folders;
};

export const updateBookmarkFolder = async (
  folderId: string,
  updates: Partial<BookmarkFolder>
): Promise<BookmarkFolder> => {
  // Would need userId to work properly
  return { ...updates, id: folderId } as BookmarkFolder;
};

export const deleteBookmarkFolder = async (folderId: string): Promise<void> => {
  console.log('Delete folder:', folderId);
};

// ============================================================
// BOOKMARK OPERATIONS
// ============================================================

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

export const getBookmarks = async (userId: string): Promise<Bookmark[]> => {
  return getLocalBookmarks(userId);
};

export const getBookmarksByFolder = async (
  folderId: string,
  userId: string
): Promise<Bookmark[]> => {
  const bookmarks = getLocalBookmarks(userId);
  return bookmarks.filter(b => b.folder_id === folderId);
};

export const updateBookmark = async (
  bookmarkId: string,
  updates: Partial<Bookmark>
): Promise<Bookmark> => {
  return { ...updates, id: bookmarkId } as Bookmark;
};

export const isMessageBookmarked = async (
  messageId: string,
  userId: string
): Promise<boolean> => {
  const bookmarks = getLocalBookmarks(userId);
  return bookmarks.some(b => b.message_id === messageId);
};
