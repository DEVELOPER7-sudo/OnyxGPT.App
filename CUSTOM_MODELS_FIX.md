# Custom Models - Raw ID Fix

## Problem
The app was automatically adding `openrouter:` or `togetherai:` prefixes to custom model IDs, which caused issues when users wanted to use raw model IDs from their preferred providers.

## Solution
Removed all automatic prefix logic. Users can now add **raw model IDs** directly and the app will use them exactly as provided.

## Changes Made

### 1. **model-utils.ts** - Updated `addCustomModel()` function
- **Before**: Automatically added `openrouter:` or `togetherai:` prefix
- **After**: Stores raw model ID as-is without any prefix
- Model IDs are now stored exactly as the user provides them

### 2. **SettingsPanel.tsx** - Removed prefix selection UI
- **Removed**: API Provider selection dropdown (OpenRouter vs Together AI)
- **Updated**: Placeholder text to guide users to enter raw model IDs
- **New placeholder**: "Enter your raw model ID (e.g. gpt-4o, claude-3-sonnet-20240229)"

### 3. **types/chat.ts** - Cleaned up AppSettings type
- **Removed**: `customModelPrefix?: 'openrouter' | 'togetherai'` field
- No longer needed since we don't auto-prefix models

## How Users Should Use Custom Models

### Examples of Valid Model IDs:
```
gpt-4o
gpt-4o-mini
claude-3-sonnet-20240229
claude-opus-4-20250514
gemini-2.0-flash
deepseek-chat
llama-3.1-405b-instruct
mistral-large-latest
```

### If using OpenRouter or Together AI:
Users can still prefix their model IDs if needed:
```
openrouter:openai/gpt-4o
togetherai:meta-llama/Llama-3.1-405b-Instruct
```

But this is **optional** - the app will use whatever ID is provided.

## Benefits
✅ Users can use raw model IDs from any provider  
✅ No confusion about prefixes  
✅ Works with OpenAI, Anthropic, Google, Meta, Mistral, etc.  
✅ Simplified UI  
✅ Backwards compatible with existing prefixed model IDs  

## Testing
Try adding these custom models:
- `gpt-4o` (if using OpenAI)
- `claude-3-sonnet-20240229` (if using Anthropic)
- `gemini-2.0-flash` (if using Google)

The app should accept and use them exactly as provided.
