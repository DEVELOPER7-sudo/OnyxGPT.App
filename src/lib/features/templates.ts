import { PromptTemplate, TemplateFavorite } from '../../types/features';

// ============================================================
// LOCAL STORAGE KEYS
// ============================================================

const STORAGE_KEYS = {
  TEMPLATES: 'onyx_templates',
  FAVORITES: 'onyx_template_favorites',
};

// ============================================================
// TEMPLATE OPERATIONS
// ============================================================

export const createTemplate = async (
  workspaceId: string,
  userId: string,
  name: string,
  content: string,
  options?: {
    description?: string;
    category?: string;
    variables?: string[];
    isPublic?: boolean;
  }
): Promise<PromptTemplate> => {
  // Extract variables from content ({{variable}} format)
  const variableRegex = /\{\{(\w+)\}\}/g;
  const extractedVars = Array.from(content.matchAll(variableRegex), (m) => m[1]);
  const variables = options?.variables || extractedVars;

  return {
    id: `template-${Date.now()}`,
    workspace_id: workspaceId,
    created_by: userId,
    name,
    content,
    description: options?.description,
    category: options?.category,
    variables,
    is_public: options?.isPublic || false,
    download_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

export const getTemplates = async (workspaceId: string): Promise<PromptTemplate[]> => {
  return [];
};

export const getPublicTemplates = async (limit: number = 50): Promise<PromptTemplate[]> => {
  return [];
};

export const searchTemplates = async (
  workspaceId: string,
  query: string
): Promise<PromptTemplate[]> => {
  return [];
};

export const updateTemplate = async (
  templateId: string,
  updates: Partial<PromptTemplate>
): Promise<PromptTemplate> => {
  return { ...updates, id: templateId, updated_at: new Date().toISOString() } as PromptTemplate;
};

export const deleteTemplate = async (templateId: string): Promise<void> => {
  console.log('Delete template:', templateId);
};

// ============================================================
// TEMPLATE RENDERING
// ============================================================

export const renderTemplate = (template: PromptTemplate, variables: Record<string, string>): string => {
  let rendered = template.content;

  for (const [key, value] of Object.entries(variables)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    rendered = rendered.replace(regex, value);
  }

  return rendered;
};

// ============================================================
// TEMPLATE FAVORITES
// ============================================================

export const favoriteTemplate = async (
  userId: string,
  templateId: string
): Promise<TemplateFavorite> => {
  return {
    id: `fav-${Date.now()}`,
    user_id: userId,
    template_id: templateId,
    added_at: new Date().toISOString(),
  };
};

export const unfavoriteTemplate = async (userId: string, templateId: string): Promise<void> => {
  console.log('Unfavorite template:', userId, templateId);
};

export const getUserFavoriteTemplates = async (userId: string): Promise<PromptTemplate[]> => {
  return [];
};

export const isTemplateFavorited = async (userId: string, templateId: string): Promise<boolean> => {
  return false;
};

// ============================================================
// TEMPLATE CATEGORIES
// ============================================================

export const getTemplateCategories = async (workspaceId: string): Promise<string[]> => {
  return [];
};

export const getTemplatesByCategory = async (
  workspaceId: string,
  category: string
): Promise<PromptTemplate[]> => {
  return [];
};

// ============================================================
// TEMPLATE DOWNLOAD TRACKING
// ============================================================

export const incrementTemplateDownloads = async (templateId: string): Promise<void> => {
  console.log('Increment downloads:', templateId);
};

export const getTemplate = async (templateId: string): Promise<PromptTemplate | null> => {
  return null;
};

// ============================================================
// BUILT-IN TEMPLATES
// ============================================================

export const BUILT_IN_TEMPLATES = [
  {
    name: 'Email Response',
    category: 'Communication',
    description: 'Professional email response template',
    content: `Subject: RE: {{subject}}

Hi {{name}},

Thank you for your message regarding {{topic}}.

{{content}}

Best regards`,
    variables: ['subject', 'name', 'topic', 'content'],
  },
  {
    name: 'Bug Report',
    category: 'Technical',
    description: 'Structured bug report template',
    content: `## Bug Report

**Environment:** {{environment}}
**Severity:** {{severity}}

### Description
{{description}}

### Steps to Reproduce
1. {{step1}}
2. {{step2}}
3. {{step3}}

### Expected Behavior
{{expected}}

### Actual Behavior
{{actual}}

### Additional Context
{{context}}`,
    variables: ['environment', 'severity', 'description', 'step1', 'step2', 'step3', 'expected', 'actual', 'context'],
  },
  {
    name: 'Meeting Notes',
    category: 'Documentation',
    description: 'Meeting notes template',
    content: `# Meeting Notes - {{date}}

**Attendees:** {{attendees}}
**Duration:** {{duration}}

## Agenda
- {{agenda_item_1}}
- {{agenda_item_2}}
- {{agenda_item_3}}

## Discussion
{{discussion}}

## Action Items
- [ ] {{action_1}} (Owner: {{owner_1}})
- [ ] {{action_2}} (Owner: {{owner_2}})

## Next Meeting
{{next_meeting_date}}`,
    variables: ['date', 'attendees', 'duration', 'agenda_item_1', 'agenda_item_2', 'agenda_item_3', 'discussion', 'action_1', 'owner_1', 'action_2', 'owner_2', 'next_meeting_date'],
  },
];

export const loadBuiltInTemplates = async (
  workspaceId: string,
  userId: string
): Promise<void> => {
  // Would load built-in templates into storage
  console.log('Load built-in templates:', workspaceId, userId);
};
