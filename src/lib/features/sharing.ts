import { SharedChat, MessageComment } from '../../types/features';

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  SHARED_CHATS: 'onyx_shared_chats',
  COMMENTS: 'onyx_message_comments',
};

// ============================================================
// CHAT SHARING
// ============================================================

export const createShareLink = async (
  chatId: string,
  creatorId: string,
  options?: {
    expiresInDays?: number;
    password?: string;
    accessLevel?: 'view' | 'comment' | 'edit';
  }
): Promise<SharedChat> => {
  const token = generateShareToken();

  const expiresAt = options?.expiresInDays
    ? new Date(Date.now() + options.expiresInDays * 24 * 60 * 60 * 1000)
    : null;

  const sharedChat: SharedChat = {
    id: `share-${Date.now()}`,
    chat_id: chatId,
    creator_id: creatorId,
    token,
    password_hash: options?.password ? btoa(options.password) : undefined,
    expires_at: expiresAt?.toISOString(),
    access_level: options?.accessLevel || 'view',
    access_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return sharedChat;
};

export const getShareLink = async (token: string, password?: string): Promise<SharedChat | null> => {
  // Would need full implementation with localStorage
  return null;
};

export const updateShareLink = async (
  shareId: string,
  updates: Partial<SharedChat>
): Promise<SharedChat> => {
  return { ...updates, id: shareId, updated_at: new Date().toISOString() } as SharedChat;
};

export const revokeShareLink = async (shareId: string): Promise<void> => {
  console.log('Revoke share link:', shareId);
};

export const getUserShareLinks = async (userId: string): Promise<SharedChat[]> => {
  return [];
};

// ============================================================
// ACCESS LOGGING
// ============================================================

export const logShareAccess = async (shareId: string, userId?: string): Promise<void> => {
  console.log('Log share access:', shareId, userId);
};

export const getShareAccessLogs = async (shareId: string) => {
  return [];
};

// ============================================================
// COMMENTS & ANNOTATIONS
// ============================================================

export const addComment = async (
  messageId: string,
  authorId: string,
  content: string,
  parentCommentId?: string
): Promise<MessageComment> => {
  return {
    id: `comment-${Date.now()}`,
    message_id: messageId,
    author_id: authorId,
    content,
    parent_comment_id: parentCommentId,
    is_edited: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const getMessageComments = async (messageId: string): Promise<MessageComment[]> => {
  return [];
};

export const getCommentThread = async (parentCommentId: string): Promise<MessageComment[]> => {
  return [];
};

export const updateComment = async (
  commentId: string,
  content: string
): Promise<MessageComment> => {
  return {
    id: commentId,
    content,
    is_edited: true,
    updated_at: new Date().toISOString(),
  } as MessageComment;
};

export const deleteComment = async (commentId: string): Promise<void> => {
  console.log('Delete comment:', commentId);
};

// ============================================================
// COMMENT REACTIONS
// ============================================================

export const addCommentReaction = async (
  commentId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  console.log('Add reaction:', commentId, userId, emoji);
};

export const removeCommentReaction = async (
  commentId: string,
  userId: string,
  emoji: string
): Promise<void> => {
  console.log('Remove reaction:', commentId, userId, emoji);
};

export const getCommentReactions = async (commentId: string) => {
  return {};
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 16; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

async function getClientIp(): Promise<string | null> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return null;
  }
}
