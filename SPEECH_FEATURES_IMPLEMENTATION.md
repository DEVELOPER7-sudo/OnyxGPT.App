# Speech & Audio Features Implementation

Complete implementation of voice-to-text and text-to-speech capabilities using the Pollinations AI API.

## ✅ Features Implemented

### 1. **Voice Input (Speech-to-Text)**
- **Location:** Microphone button next to the send button
- **How It Works:**
  - Click the 🎤 microphone button
  - Record your message (button pulses red while recording)
  - Click again to stop and transcribe
  - Transcribed text is automatically added to the input field
- **Technology:** Pollinations AI Speech-to-Text API
- **Format:** WAV audio transcription to text

### 2. **Voice Output (Text-to-Speech)**
- **Location:** Speaker button (🔊) below each AI response
- **How It Works:**
  - Click the speaker button to hear the response read aloud
  - Click again to stop playback
  - Button shows active state while speaking
- **Technology:** Pollinations AI Text-to-Speech API
- **Supported Voices:** 6 natural-sounding voices
  - **Alloy:** Neutral, professional
  - **Echo:** Deep, resonant
  - **Fable:** Storyteller vibe
  - **Onyx:** Warm, rich
  - **Nova:** Bright, friendly (default)
  - **Shimmer:** Soft, melodic

### 3. **Settings Panel Integration**
New "🎙️ Speech & Audio Settings" section with:
- **Enable Text-to-Speech** toggle
- **Voice Selection** dropdown (Nova, Alloy, Echo, Fable, Onyx, Shimmer)
- **Auto-Play Response Audio** toggle
- Helpful info section explaining voice input and output

## 📁 New Files Created

### Hooks
- **`src/hooks/useSpeechToText.ts`**
  - Manages microphone recording
  - Handles audio capture and WAV conversion
  - Integrates with Pollinations Speech-to-Text API
  - Provides `startRecording()`, `stopRecording()` methods
  
- **`src/hooks/useTextToSpeech.ts`**
  - Manages audio generation and playback
  - Integrates with Pollinations Text-to-Speech API
  - Supports 6 voice options
  - Provides `speak()`, `stop()`, `pause()`, `resume()` methods

### Components
- **`src/components/AppDocumentation.tsx`**
  - Comprehensive documentation component
  - Tabbed interface with Features, Models, Speech, Settings, Shortcuts, APIs
  - All features and models documented
  - API integration information
  - Usage examples and shortcuts
  - Accessible at `/docs` route

## 🔧 Modified Files

### Type Definitions
- **`src/types/chat.ts`**
  - Added `speechEnabled?: boolean` - Enable/disable speech features
  - Added `speechVoice?: SpeechVoice` - Selected voice (alloy|echo|fable|onyx|nova|shimmer)
  - Added `autoPlaySpeech?: boolean` - Auto-play audio for responses

### Components
- **`src/components/ChatArea.tsx`**
  - Added speech-to-text hook integration
  - Added text-to-speech hook integration
  - Implemented mic button with recording state
  - Added speaker button to assistant messages
  - Added visual feedback for recording (pulsing red) and speaking (scaled up)
  - Message state tracking for speaking status

- **`src/components/SettingsPanel.tsx`**
  - Added "🎙️ Speech & Audio Settings" section
  - Speech enable/disable toggle
  - Voice selection dropdown
  - Auto-play speech toggle
  - Info box explaining voice features

- **`src/pages/ChatApp.tsx`**
  - Pass `speechVoice` and `autoPlaySpeech` from settings to ChatArea

### Routing
- **`src/App.tsx`**
  - Added documentation route `/docs`
  - Imported AppDocumentation component

## 🎯 User Interface Changes

### Input Area (Bottom)
```
[Input Field] [Attachment] [Mic 🎤] [Send ▶️]
                           ↑
                    Now interactive!
```

### Assistant Message Actions
```
[Copy 📋] [Speak 🔊] [Regenerate ↻]
          ↑
     New button with stop state
```

## 🔌 API Integration

### Pollinations AI - Text-to-Speech
**Endpoint:** `GET https://text.pollinations.ai/{prompt}?model=openai-audio&voice={voice}`
- No authentication required
- Supports 6 voice styles
- Returns MP3 audio file
- Used for reading AI responses aloud

### Pollinations AI - Speech-to-Text
**Endpoint:** `POST https://text.pollinations.ai/openai`
- Accepts base64-encoded WAV audio
- Returns transcribed text
- No authentication required
- Used for voice input transcription

## 📝 Settings Persistence

All speech settings are saved to localStorage:
- Speech enabled/disabled state
- Selected voice preference
- Auto-play preference

Settings are loaded when app starts and updated when user saves.

## ⌨️ Keyboard & Touch Support

- Mic button: Click to start/stop recording
- Speaker button: Click to play/stop audio
- Responsive: Works on mobile and desktop
- Visual feedback: Color changes and animations

## 🎨 Visual Feedback

- **Recording:** Mic button pulses red (`animate-pulse`)
- **Speaking:** Speaker button glows primary color and scales up
- **Transcribing:** Loading state during speech-to-text
- **Generating Audio:** Loading state during text-to-speech

## 📱 Mobile Support

- Full microphone support on modern mobile browsers
- Touch-friendly button sizes (h-10 w-10)
- Responsive layout maintained
- No breaking changes to mobile UI

## 🔒 Privacy & Security

- Microphone access only requested when user clicks mic button
- Audio files not stored, only transmitted for transcription
- No tracking of audio content
- All API calls use HTTPS
- No API keys required for Pollinations API

## 📊 Analytics Integration

Speech feature usage can be tracked through:
- Message stats for voice input
- Response stats for voice output
- Settings analytics for feature adoption

## 🚀 Future Enhancements

Potential additions:
- Speaking rate adjustment
- Audio volume control
- Multiple audio file downloads
- Background music/ambient sounds
- Advanced voice cloning
- Audio file caching

## 🔍 Testing Checklist

- [ ] Mic button toggles recording state
- [ ] Recorded audio transcribes correctly
- [ ] Transcribed text appears in input
- [ ] Speaker button plays response audio
- [ ] Speaker button stops audio playback
- [ ] Voice selection changes speaker audio
- [ ] Auto-play works when enabled
- [ ] Settings persist after page reload
- [ ] Works on mobile browsers
- [ ] Graceful error handling for API failures
- [ ] Documentation page loads correctly

## 📋 Documentation

Complete documentation available at:
- **Route:** `/docs`
- **Component:** `AppDocumentation.tsx`
- **Sections:** Features, Models, Speech, Settings, Shortcuts, APIs

Users can access from main menu or direct URL navigation.

## 🆘 Troubleshooting

### Microphone not working
- Check browser microphone permissions
- Ensure HTTPS connection (required by most browsers)
- Try refreshing the page

### No audio output
- Check speaker volume settings
- Ensure browser audio isn't muted
- Check for browser autoplay policies

### Transcription not working
- Check internet connection
- Verify Pollinations API is accessible
- Check browser console for errors

### Settings not saving
- Clear browser cache if needed
- Check localStorage isn't full
- Ensure cookies are enabled
