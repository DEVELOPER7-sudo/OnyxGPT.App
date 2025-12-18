import { beautifyModelName, getProviderFromModelId, getCustomModels } from './model-utils';
import { ALL_OPENROUTER_MODELS } from './all-models';

export const TEXT_MODELS = [
  // Flagship Models Only (Puter JS endpoint with OpenRouter prefix)
  { id: 'openrouter:kwaipilot/kat-coder-pro:free', name: 'KAI Coder Pro (Free)', provider: 'Kwaipilot' },
  { id: 'openrouter:openai/gpt-5', name: 'GPT-5', provider: 'OpenAI' },
  { id: 'openrouter:anthropic/claude-sonnet-4.5', name: 'Claude Sonnet 4.5', provider: 'Anthropic' },
  { id: 'openrouter:google/gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'Google' },
  { id: 'openrouter:openai/gpt-5-nano', name: 'GPT-5 Nano', provider: 'OpenAI' },
];

/**
 * Get all text models including ALL OpenRouter models and custom ones
 */
export function getAllTextModels() {
  const customModels = getCustomModels();
  const customModelObjects = customModels.map(id => ({
    id,
    name: beautifyModelName(id),
    provider: getProviderFromModelId(id),
    isCustom: true,
  }));
  
  // Create model objects from ALL_OPENROUTER_MODELS
  const allOpenRouterModelObjects = ALL_OPENROUTER_MODELS.map(id => ({
    id,
    name: beautifyModelName(id),
    provider: getProviderFromModelId(id),
  }));
  
  // Combine: Featured models first, then all OpenRouter models, then custom
  // Remove duplicates by tracking seen IDs
  const seenIds = new Set<string>();
  const allModels = [...TEXT_MODELS, ...allOpenRouterModelObjects, ...customModelObjects];
  
  return allModels.filter(model => {
    if (seenIds.has(model.id)) {
      return false;
    }
    seenIds.add(model.id);
    return true;
  });
}

export const IMAGE_MODELS = [
  { id: 'flux-puter', name: 'FLUX.1-schnell (Puter JS)', description: 'High quality generation via Puter.js', isPuter: true, provider: 'Puter' },
  { id: 'flux', name: 'Flux', description: 'High quality, fast generation' },
  { id: 'kontext', name: 'Kontext', description: 'Contextual understanding' },
  { id: 'turbo', name: 'Turbo', description: 'Ultra fast generation' },
  { id: 'gptimage', name: 'GPT Image', description: 'GPT-powered generation' },
  { id: 'seedream', name: 'SeeDream', description: 'Artistic style' },
  { id: 'nanobanana', name: 'Nano Banana', description: 'Compact and efficient' },
];

// Import from separate file to keep this file clean
export { ALL_OPENROUTER_MODELS } from './all-models';
