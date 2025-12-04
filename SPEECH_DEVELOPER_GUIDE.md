# 🛠️ Speech Features - Developer Integration Guide

Technical documentation for integrating and extending speech features.

## 📚 Architecture Overview

```
Voice Features
├── Input (Speech-to-Text)
│   ├── useSpeechToText hook
│   ├── MediaRecorder API
│   ├── WebAudio API (WAV encoding)
│   └── Pollinations API
│
├── Output (Text-to-Speech)
│   ├── useTextToSpeech hook
│   ├── Pollinations API
│   ├── HTML5 Audio API
│   └── Browser Audio Context
│
└── UI Integration
    ├── ChatArea component
    ├── SettingsPanel component
    └── AppDocumentation component
```

## 🔌 API Specifications

### Text-to-Speech API

**Endpoint:** `GET https://text.pollinations.ai/{prompt}`

**Parameters:**
```javascript
{
  model: "openai-audio",      // Required
  voice: "nova"               // alloy | echo | fable | onyx | nova | shimmer
}
```

**Example:**
```javascript
const text = "Hello world";
const voice = "nova";
const url = `https://text.pollinations.ai/${encodeURIComponent(text)}?model=openai-audio&voice=${voice}`;

fetch(url)
  .then(response => response.blob())
  .then(blob => {
    const audio = new Audio(URL.createObjectURL(blob));
    audio.play();
  });
```

**Response:**
- Content-Type: `audio/mpeg` (MP3)
- No authentication required
- Rate limited (free tier available)

### Speech-to-Text API

**Endpoint:** `POST https://text.pollinations.ai/openai`

**Payload:**
```json
{
  "model": "openai-audio",
  "messages": [{
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "Transcribe this audio:"
      },
      {
        "type": "input_audio",
        "input_audio": {
          "data": "base64_encoded_audio",
          "format": "wav"
        }
      }
    ]
  }]
}
```

**Response:**
```json
{
  "choices": [{
    "message": {
      "content": "Transcribed text here"
    }
  }]
}
```

## 📦 Hook Usage

### useSpeechToText Hook

```typescript
import { useSpeechToText } from '@/hooks/useSpeechToText';

function MyComponent() {
  const {
    isRecording,
    isTranscribing,
    startRecording,
    stopRecording
  } = useSpeechToText({
    onTranscribed: (text) => {
      console.log('Transcribed:', text);
    }
  });

  return (
    <>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start'}
      </button>
      <button onClick={stopRecording} disabled={!isRecording}>
        Stop
      </button>
      {isTranscribing && <p>Transcribing...</p>}
    </>
  );
}
```

**Options:**
```typescript
interface UseSpeechToTextOptions {
  onTranscribed?: (text: string) => void;
}
```

**Return Value:**
```typescript
{
  isRecording: boolean;
  isTranscribing: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<string | null>;
}
```

### useTextToSpeech Hook

```typescript
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

function MyComponent() {
  const {
    isSpeaking,
    isGenerating,
    speak,
    stop,
    pause,
    resume
  } = useTextToSpeech({
    voice: 'nova'
  });

  return (
    <>
      <button onClick={() => speak("Hello world", "nova")}>
        Speak
      </button>
      <button onClick={stop} disabled={!isSpeaking}>
        Stop
      </button>
      <button onClick={pause} disabled={!isSpeaking}>
        Pause
      </button>
      <button onClick={resume} disabled={isSpeaking || !isSpeaking}>
        Resume
      </button>
    </>
  );
}
```

**Options:**
```typescript
interface UseTextToSpeechOptions {
  voice?: SpeechVoice;  // alloy | echo | fable | onyx | nova | shimmer
}
```

**Return Value:**
```typescript
{
  isSpeaking: boolean;
  isGenerating: boolean;
  speak: (text: string, voice: SpeechVoice) => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => void;
}
```

## 🧠 State Management

### Settings Integration

Speech settings are stored in `AppSettings`:

```typescript
export interface AppSettings {
  speechEnabled?: boolean;                    // Enable/disable speech
  speechVoice?: 'alloy' | 'echo' | 'fable'  // Selected voice
    | 'onyx' | 'nova' | 'shimmer';
  autoPlaySpeech?: boolean;                   // Auto-play responses
  // ... other settings
}
```

### Local State in ChatArea

```typescript
const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);

// Track which message is currently being spoken
if (speakingMessageId === message.id) {
  // Message is being spoken
}
```

## 🎯 Component Integration

### ChatArea Component

**Props:**
```typescript
interface ChatAreaProps {
  speechVoice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  autoPlaySpeech?: boolean;
  // ... other props
}
```

**Features:**
- Microphone button in input area
- Speaker button on assistant messages
- Voice visual feedback (pulsing, scaling)
- Auto-play integration

### SettingsPanel Component

**Features:**
- Speech enable/disable toggle
- Voice dropdown selector
- Auto-play toggle
- Informational sections

## 🔄 Data Flow

### Voice Input Flow
```
User clicks mic
    ↓
startRecording() → MediaRecorder starts
    ↓
User speaks
    ↓
User clicks mic again
    ↓
stopRecording() → Audio captured
    ↓
Audio → WAV conversion → Base64 encoding
    ↓
Pollinations Speech-to-Text API
    ↓
Transcribed text → onTranscribed callback
    ↓
Text added to input field
```

### Voice Output Flow
```
User clicks speaker button
    ↓
speak(text, voice) called
    ↓
Pollinations Text-to-Speech API
    ↓
MP3 audio blob received
    ↓
HTML5 Audio element loads blob
    ↓
audio.play() starts playback
    ↓
isSpeaking state updates
    ↓
User hears audio
```

## 🧪 Testing

### Testing Speech-to-Text

```typescript
import { renderHook, act } from '@testing-library/react-hooks';
import { useSpeechToText } from '@/hooks/useSpeechToText';

describe('useSpeechToText', () => {
  it('should start and stop recording', async () => {
    const { result } = renderHook(() => useSpeechToText());
    
    act(() => {
      result.current.startRecording();
    });
    
    expect(result.current.isRecording).toBe(true);
    
    act(() => {
      result.current.stopRecording();
    });
    
    // Wait for transcription
    await new Promise(resolve => setTimeout(resolve, 1000));
  });
});
```

### Testing Text-to-Speech

```typescript
describe('useTextToSpeech', () => {
  it('should speak text', async () => {
    const { result } = renderHook(() => useTextToSpeech());
    
    act(() => {
      result.current.speak('Hello world', 'nova');
    });
    
    expect(result.current.isGenerating).toBe(true);
  });
});
```

## 🐛 Error Handling

### Common Errors

**Microphone Access Denied**
```typescript
startRecording().catch(error => {
  if (error.name === 'NotAllowedError') {
    toast.error('Microphone permission denied');
  }
});
```

**Network Error**
```typescript
speak(text, voice).catch(error => {
  console.error('Text-to-speech failed:', error);
  toast.error('Failed to generate speech');
});
```

**Audio Playback Error**
```typescript
audioRef.onerror = () => {
  toast.error('Failed to play audio');
};
```

## 📊 Performance Considerations

### Optimization Tips

1. **Audio Caching**
   - Cache frequently spoken phrases
   - Use browser cache headers

2. **Lazy Loading**
   - Load hooks only when needed
   - Defer audio generation

3. **Batch Transcription**
   - Send multiple audio samples at once
   - Reduce API calls

4. **Streaming**
   - Stream large audio files
   - Progressive audio generation

### Metrics to Track

- Average transcription time
- Average TTS generation time
- Failed transcriptions
- Audio playback success rate
- User engagement with features

## 🔐 Security Considerations

### Microphone Access
```typescript
// Always request permission explicitly
navigator.mediaDevices.getUserMedia({ audio: true })
  .catch(error => {
    // Handle denial gracefully
  });
```

### API Security
- Use HTTPS only
- No sensitive data in audio
- No API key exposure
- Rate limiting awareness

### Data Privacy
```typescript
// Audio is not stored
// Only transmitted for transcription
// User can revoke permissions anytime
```

## 🚀 Extension Points

### Adding New Voices

```typescript
type SpeechVoice = 
  | 'alloy' 
  | 'echo' 
  | 'fable' 
  | 'onyx' 
  | 'nova' 
  | 'shimmer'
  | 'custom_voice'; // Add new voice
```

### Custom Voice Synthesis

```typescript
const customSpeak = async (text: string, voiceId: string) => {
  // Implement custom TTS provider
};
```

### Advanced Audio Processing

```typescript
const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
// Implement audio visualization
```

## 📚 Related Files

- `src/hooks/useSpeechToText.ts` - Voice input hook
- `src/hooks/useTextToSpeech.ts` - Voice output hook
- `src/components/ChatArea.tsx` - UI integration
- `src/components/SettingsPanel.tsx` - Settings UI
- `src/components/AppDocumentation.tsx` - User docs
- `src/types/chat.ts` - Type definitions

## 🔗 External Resources

- [Pollinations AI](https://pollinations.ai)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
- [HTML5 Audio](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)

## 📝 Implementation Checklist

### For New Features
- [ ] Create new hook in `src/hooks/`
- [ ] Add TypeScript types to `src/types/chat.ts`
- [ ] Integrate with ChatArea component
- [ ] Add settings in SettingsPanel
- [ ] Update AppDocumentation
- [ ] Add error handling with toast notifications
- [ ] Test on mobile and desktop
- [ ] Document in this guide

### For Custom Implementation
- [ ] Fork the hooks as needed
- [ ] Modify API endpoints
- [ ] Update TypeScript types
- [ ] Add error handling
- [ ] Test thoroughly
- [ ] Update documentation

## 🤝 Contributing

When extending speech features:

1. Keep API contracts stable
2. Maintain TypeScript typing
3. Add proper error handling
4. Include user feedback (toast/UI)
5. Document changes
6. Test across browsers
7. Consider accessibility

---

**Last Updated:** December 2024
**Version:** 1.0
**Framework:** React + TypeScript
