import { ChatCollection, CollectionItem, ChatTag } from '../../types/features';

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  COLLECTIONS: 'onyx_collections',
  COLLECTION_ITEMS: 'onyx_collection_items',
  TAGS: 'onyx_chat_tags',
  TAG_MAPPINGS: 'onyx_tag_mappings',
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

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

const getLocalTags = (workspaceId: string): ChatTag[] => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.TAGS}_${workspaceId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveLocalTags = (workspaceId: string, tags: ChatTag[]): void => {
  localStorage.setItem(`${STORAGE_KEYS.TAGS}_${workspaceId}`, JSON.stringify(tags));
};

// ============================================================
// COLLECTION OPERATIONS
// ============================================================

export const createCollection = async (
  workspaceId: string,
  userId: string,
  name: string,
  color: string = '#808080',
  parentId?: string
): Promise<ChatCollection> => {
  const collections = getLocalCollections(workspaceId);
  const newCollection: ChatCollection = {
    id: `collection-${Date.now()}`,
    workspace_id: workspaceId,
    name,
    color,
    parent_id: parentId,
    created_by: userId,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  collections.unshift(newCollection);
  saveLocalCollections(workspaceId, collections);
  return newCollection;
};

export const getCollections = async (workspaceId: string): Promise<ChatCollection[]> => {
  return getLocalCollections(workspaceId);
};

export const getCollectionHierarchy = async (
  workspaceId: string
): Promise<ChatCollection[]> => {
  const collections = await getCollections(workspaceId);
  return collections.filter((c) => !c.parent_id);
};

export const updateCollection = async (
  collectionId: string,
  updates: Partial<ChatCollection>
): Promise<ChatCollection> => {
  return { ...updates, id: collectionId, updated_at: new Date().toISOString() } as ChatCollection;
};

export const deleteCollection = async (collectionId: string): Promise<void> => {
  console.log('Delete collection:', collectionId);
};

// ============================================================
// COLLECTION ITEM OPERATIONS
// ============================================================

export const addChatToCollection = async (
  collectionId: string,
  chatId: string,
  position: number = 0
): Promise<CollectionItem> => {
  const item: CollectionItem = {
    id: `item-${Date.now()}`,
    collection_id: collectionId,
    chat_id: chatId,
    position,
    added_at: new Date().toISOString(),
  };
  return item;
};

export const removeChatFromCollection = async (chatId: string): Promise<void> => {
  console.log('Remove chat from collection:', chatId);
};

export const getCollectionChats = async (collectionId: string): Promise<string[]> => {
  return [];
};

export const reorderCollectionItems = async (
  collectionId: string,
  chatIds: string[]
): Promise<void> => {
  console.log('Reorder collection items:', collectionId, chatIds);
};

// ============================================================
// TAG OPERATIONS
// ============================================================

export const createTag = async (
  workspaceId: string,
  userId: string,
  name: string,
  color: string = '#808080'
): Promise<ChatTag> => {
  const tags = getLocalTags(workspaceId);
  const newTag: ChatTag = {
    id: `tag-${Date.now()}`,
    workspace_id: workspaceId,
    name,
    color,
    created_by: userId,
  };
  tags.unshift(newTag);
  saveLocalTags(workspaceId, tags);
  return newTag;
};

export const getTags = async (workspaceId: string): Promise<ChatTag[]> => {
  return getLocalTags(workspaceId);
};

export const updateTag = async (tagId: string, updates: Partial<ChatTag>): Promise<ChatTag> => {
  return { ...updates, id: tagId } as ChatTag;
};

export const deleteTag = async (tagId: string): Promise<void> => {
  console.log('Delete tag:', tagId);
};

// ============================================================
// TAG MAPPING OPERATIONS
// ============================================================

export const addTagToChat = async (chatId: string, tagId: string): Promise<void> => {
  console.log('Add tag to chat:', chatId, tagId);
};

export const removeTagFromChat = async (chatId: string, tagId: string): Promise<void> => {
  console.log('Remove tag from chat:', chatId, tagId);
};

export const getChatTags = async (chatId: string): Promise<ChatTag[]> => {
  return [];
};

export const getChatsWithTag = async (
  workspaceId: string,
  tagId: string
): Promise<string[]> => {
  return [];
};

export const updateChatTags = async (chatId: string, tagIds: string[]): Promise<void> => {
  console.log('Update chat tags:', chatId, tagIds);
};
