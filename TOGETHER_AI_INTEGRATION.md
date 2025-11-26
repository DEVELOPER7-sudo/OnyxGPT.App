# Together AI Integration Guide

## Overview

Together AI is integrated as a direct endpoint (similar to Puter), not requiring a separate API key setup. Users can add custom models with the `togetherai:` prefix and they will be routed to Together AI's API endpoint.

## How It Works

### Prefix System
- **Puter models**: Default endpoint (no prefix or regular model IDs)
- **OpenRouter models**: Prefix `openrouter:` (e.g., `openrouter:mistral/mistral-7b`)
- **Together AI models**: Prefix `togetherai:` (e.g., `togetherai:meta-llama/llama-2-70b`)

### Settings Toggle
Users can select their preferred API provider in **Settings → AI Models → Custom Model API Prefix**:
- OpenRouter (blue card)
- Together AI (green card)

When a user adds a custom model, it automatically gets prefixed with their selected provider.

### Request Routing
The system routes requests based on model prefix:

1. **Venice (uncensored)**: Routes to OpenRouter endpoint via Supabase function
2. **Custom togetherai:** models: Routes to Together AI endpoint directly
3. **All other models**: Routes to Puter endpoint (default)

## Implementation Notes

### No API Key Required
Unlike OpenRouter which requires an API key for authentication, Together AI works as a direct endpoint similar to Puter. The API calls are made directly from the frontend.

### Model Format
Together AI model IDs follow the format:
```
togetherai:organization/model-name
```

Examples:
- `togetherai:meta-llama/llama-2-70b-chat-hf`
- `togetherai:mistralai/mistral-7b-instruct-v0.1`
- `togetherai:NousResearch/Nous-Hermes-2-Mixtral-8x7B-DPO`

### Adding Custom Models
1. Open Settings
2. Select "Together AI" in Custom Model API Prefix section
3. Enter model ID (without prefix): `meta-llama/llama-2-70b-chat-hf`
4. Click "Add Model"
5. Model is saved as `togetherai:meta-llama/llama-2-70b-chat-hf`
6. Model appears in model selection dropdown

## Current Implementation Status

✅ **Completed**:
- Toggle UI for prefix selection (OpenRouter/Together AI)
- Automatic prefix application to custom models
- Storage of prefix preference in settings
- Display logic handles both prefixes

⏳ **To Implement** (if needed):
- Conditional routing for togetherai: prefixed models in ChatApp.tsx
- Together AI Supabase function (if authentication/proxying needed)
- Model list updates to show Together AI available models

## Notes

- Together AI endpoint is likely called directly from frontend (no separate Supabase function needed)
- Prefix detection logic in `beautifyModelName()` and `getProviderFromModelId()` already supports both openrouter: and togetherai:
- Settings default to `openrouter` for backward compatibility
- Storage persists user's prefix choice across sessions
