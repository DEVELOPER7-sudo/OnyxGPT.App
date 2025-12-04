# 🎙️ Speech Features - Quick Reference Card

## 🎤 Voice Input Quick Start

### For Users
```
1. Click microphone button (🎤)
2. Speak your message
3. Click microphone button again
4. Text appears in input
5. Send with Enter or Send button
```

### Usage Example
- "I need help with JavaScript" → Your typed message appears → Send

## 🔊 Voice Output Quick Start  

### For Users
```
1. Read AI response
2. Click speaker button (🔊) under response
3. Listen to audio playback
4. Click button again to stop
```

### Voice Options
| Voice | Style | Best For |
|-------|-------|----------|
| Nova | Bright, friendly | Casual, default |
| Alloy | Professional | Business, formal |
| Echo | Deep, resonant | Narration |
| Fable | Storyteller | Stories |
| Onyx | Warm, rich | Personal |
| Shimmer | Soft, melodic | Calming |

## ⚙️ Settings Quick Reference

### Enable Features
```
Settings → Speech & Audio Settings → 
  🔊 Enable Text-to-Speech → Toggle ON → Save
```

### Change Voice
```
Settings → Speech & Audio Settings → 
  Voice → Select from dropdown → Save
```

### Enable Auto-Play
```
Settings → Speech & Audio Settings → 
  ▶️ Auto-Play Response Audio → Toggle ON → Save
```

## 💻 Developer Quick Reference

### Use Speech-to-Text Hook
```typescript
import { useSpeechToText } from '@/hooks/useSpeechToText';

const { isRecording, startRecording, stopRecording } = useSpeechToText({
  onTranscribed: (text) => console.log(text)
});
```

### Use Text-to-Speech Hook
```typescript
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

const { isSpeaking, speak, stop } = useTextToSpeech({ voice: 'nova' });

speak("Hello world", "nova");
```

### API Endpoints
```
Text-to-Speech:
GET https://text.pollinations.ai/{text}?model=openai-audio&voice={voice}

Speech-to-Text:
POST https://text.pollinations.ai/openai
```

## 📁 File Locations

### New Files
```
src/hooks/
  ├── useSpeechToText.ts      (Recording & transcription)
  └── useTextToSpeech.ts      (Audio generation & playback)

src/components/
  └── AppDocumentation.tsx    (Full docs at /docs)
```

### Modified Files
```
src/types/chat.ts             (Speech settings types)
src/components/ChatArea.tsx   (Buttons & integration)
src/components/SettingsPanel.tsx (Settings UI)
src/pages/ChatApp.tsx         (Props pass-through)
src/App.tsx                   (/docs route)
```

## 🎯 Common Tasks

### Record & Send Voice Message
```
🎤 → Speak → 🎤 → Edit (optional) → Enter
```

### Listen to Response Multiple Times
```
Read → 🔊 (play) → 🔊 (stop) → 🔊 (play again)
```

### Change Voice Mid-Conversation
```
⚙️ Settings → Voice dropdown → Change → Save → 🔊
```

### Enable Auto-Play
```
⚙️ Settings → Auto-Play toggle → Save → Auto-listen to all responses
```

## 🆘 Troubleshooting Matrix

| Issue | Solution |
|-------|----------|
| Mic not working | Check browser permissions, use HTTPS |
| No transcription | Check internet, speak clearly |
| No audio output | Check volume, browser unmuted |
| Voice not changing | Save settings, reload page |
| Settings lost | Check localStorage enabled |
| Mobile mic fails | Grant permissions, use modern browser |

## 📊 Feature Status

| Feature | Status | Works On |
|---------|--------|----------|
| Voice Input | ✅ Complete | Desktop, Mobile |
| Voice Output | ✅ Complete | Desktop, Mobile |
| Voice Selection | ✅ Complete | All Platforms |
| Auto-Play | ✅ Complete | All Platforms |
| Settings | ✅ Complete | All Platforms |
| Documentation | ✅ Complete | All Platforms |

## 🔗 Quick Links

- **Full Documentation:** `/docs`
- **User Guide:** `SPEECH_USER_GUIDE.md`
- **Developer Guide:** `SPEECH_DEVELOPER_GUIDE.md`
- **Implementation Details:** `SPEECH_FEATURES_IMPLEMENTATION.md`
- **Feature Summary:** `FEATURES_SUMMARY_SPEECH.md`

## ⏱️ Time to Learn

- Using voice features: **5 minutes**
- Full documentation: **15 minutes**
- Integration for developers: **20 minutes**
- Extension/customization: **30-60 minutes**

## 💡 Pro Tips

1. **Hands-Free:** Enable auto-play and use voice input
2. **Quick Edits:** Use voice input for quick messages
3. **Learning:** Listen to complex topics
4. **Multitask:** Use audio while doing other things
5. **Experiment:** Try all 6 voices to find your favorite

## 📱 Mobile Tips

- Hold steady for better recording
- Use speaker phone for better audio
- Larger buttons are easier to tap
- Landscape mode easier to read
- Test microphone permission first

## 🎓 Learning Path

**Beginner:**
1. Click speaker button on first response
2. Try voice input with simple message
3. Change voice in settings

**Intermediate:**
1. Enable auto-play
2. Use voice input regularly
3. Combine with other features

**Advanced:**
1. Read developer guide
2. Customize hooks
3. Build extensions

## ✨ Feature Highlights

- **No Setup Required** - Works out of the box
- **Free API** - Pollinations AI free tier
- **6 Voices** - Natural-sounding options
- **Mobile Support** - Full iOS/Android support
- **Auto-Persist** - Settings saved automatically
- **Error Handling** - Graceful failure handling
- **Documentation** - Complete user & dev docs
- **Accessibility** - Voice and audio accessible

## 🚀 Getting Started Now

1. **Try It:** Click 🎤 or 🔊 button
2. **Learn:** Read `/docs` page  
3. **Customize:** Adjust voice in Settings
4. **Explore:** Enable auto-play feature
5. **Master:** Read guides for deep knowledge

---

**Version:** 1.0  
**Status:** ✅ Production Ready  
**Last Updated:** December 2024

For detailed information, see the full documentation files.
