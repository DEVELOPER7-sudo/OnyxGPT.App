# OnyxGPT - Advanced AI Platform 🚀

A next-generation AI-powered platform featuring advanced trigger framework, 50+ AI models, custom bot creation, memory management, web search, analytics, and mobile app support.

**Status**: Production Ready | **Users**: Open to all | **License**: MIT

---

## ✨ Key Features at a Glance

| Feature | Description |
|---------|-------------|
| 🤖 **50+ AI Models** | Access 50+ flagship models from OpenAI, Anthropic, Google, Meta, DeepSeek, xAI, and more |
| 🧠 **MindStore (Memory System)** | Persistent memory with auto-extraction, organization, and semantic search |
| 🎯 **60+ Trigger Framework** | XML-based trigger system for multi-mode AI responses (reasoning, research, creative, etc.) |
| 🤳 **Custom Bots** | Create AI assistants with custom prompts, templates, and sharing |
| 🌐 **Web Search** | Real-time information retrieval with deep research mode |
| 📊 **Analytics Dashboard** | Track usage, token consumption, and AI performance metrics |
| 📱 **Mobile Apps** | iOS & Android native apps via Capacitor integration |
| 🎨 **Dynamic Island** | Smart task tracking for iPhone 14+ and Oppo Always-On Display |
| 📸 **Image Generation** | Multiple image models with chat integration |
| 🎨 **Full Customization** | Theme colors, task modes, temperature, token limits, and more |

---

## 🤖 50+ Supported AI Models

### **OpenAI** (GPT Series)
- `gpt-4-turbo` - Most capable general model
- `gpt-4o` - Optimized for speed
- `gpt-4o-mini` - Fast & efficient
- `gpt-4-vision` - Vision understanding
- `gpt-3.5-turbo` - Fast & cost-effective

### **Anthropic** (Claude Series)
- `claude-3.5-sonnet` - Flagship model
- `claude-3.5-haiku` - Lightweight
- `claude-3-opus` - Extended context
- `claude-3-sonnet` - Balanced
- `claude-3-haiku` - Ultra-fast

### **Google** (Gemini Series)
- `gemini-2.5-pro` - Advanced reasoning
- `gemini-2.5-flash` - Speed-optimized
- `gemini-1.5-pro` - Extended context
- `gemini-1.5-flash` - Fast processing
- `gemini-pro-vision` - Vision analysis

### **Meta** (Llama Series)
- `llama-3.1-405b` - Massive model
- `llama-3.1-70b` - High performance
- `llama-3.1-8b` - Lightweight
- `llama-2-70b-chat` - Chat optimized

### **DeepSeek**
- `deepseek-r1` - Advanced reasoning
- `deepseek-coder` - Code generation
- `deepseek-chat` - General chat

### **Qwen** (Alibaba)
- `qwen-3-max` - Flagship model
- `qwen-2.5-72b` - High performance
- `qwen-2-7b` - Efficient

### **xAI**
- `grok-3` - Latest reasoning model
- `grok-2` - Previous generation

### **Perplexity**
- `sonar-pro` - Advanced reasoning
- `sonar` - Standard model

### **Other Models**
- `mistral-7b` - Efficient open model
- `dolphin-2.8-mixtral-8x7b` - Uncensored
- `neural-chat-7b` - Conversation focused
- `mixtral-8x7b` - Mixture of experts
- `openhermes-2.5-mistral-7b` - Creative
- `nous-hermes-2-mistral-7b` - Instruction-tuned
- `and 30+ more via OpenRouter...**

**Total**: 50+ models | **Provider**: OpenRouter + Puter JS | **Switch**: One-click in settings

---

## 🧠 MindStore - Intelligent Memory System

### Features
- **Auto-Extraction**: Automatically extract key information from conversations
- **Smart Organization**: Categorize memories by type, importance, and tags
- **Semantic Search**: Find relevant memories across all conversations
- **Memory Context**: Include memories in AI prompts for better responses
- **Expiration**: Set memories to auto-expire after X days
- **Importance Levels**: Mark memories as low/medium/high priority
- **Organization Support**: Organize memories into custom groups
- **API Integration**: Send memory context to AI models

### Usage
```
1. Chat with AI → Memories auto-extracted
2. View in MindStore panel → Edit, organize, tag
3. Enable "Memory Context" in Settings
4. AI includes memories in next responses
```

---

## 💬 Chat Interface

### Main Features
- **Real-time Streaming**: Watch responses generate in real-time
- **Message History**: All conversations saved locally + cloud sync
- **Image Support**: Upload images for vision analysis
- **Markdown Rendering**: Full markdown + KaTeX math support
- **Message Reactions**: React to messages with emojis
- **Copy/Share**: Easy message manipulation
- **Auto-title**: Chat titles generated automatically

### Settings Control
- **Model Selection**: Switch between 50+ models instantly
- **Temperature**: 0.0 (deterministic) to 2.0 (creative)
- **Max Tokens**: Up to 100,000 tokens per response
- **Provider**: Choose Puter JS or OpenRouter
- **Streaming**: Toggle real-time response display
- **Web Search**: Enable automatic web lookups

---

## 🎯 Trigger Framework (60+ Triggers)

### What Are Triggers?
Triggers are keywords that activate special AI modes. Include them in your message to get tailored responses.

### Trigger Categories

#### 🧩 **Reasoning & Analysis** (20 triggers)
`reason` `analyze` `critique` `debate` `compare` `contrast` `deduce` `evaluate` `justify` `hypothesize` `examine` `interpret` `verify` `reflect` `infer` `explore` `discuss` `validate` `assess` `troubleshoot`

#### 🔍 **Research & Information** (18 triggers)
`search` `deep research` `fact-check` `contextualize` `summarize` `outline` `extract` `highlight` `define` `explain` `describe` `cite` `reference` `clarify` `expand` `compress` `investigate` `compile`

#### 📋 **Planning & Organization** (12 triggers)
`plan` `roadmap` `checklist` `organize` `prioritize` `schedule` `brainstorm` `propose` `structure` `map` `draft` `improve` `review` `refactor`

#### ✨ **Communication & Style** (10 triggers)
`simplify` `formalize` `rephrase` `rewrite` `summarize-for-kids` `persuasive` `informative` `neutral` `balanced` `empathetic`

### Example Usage
```
User: "deep research and summarize AI safety concerns"

AI Response:
<deep_research>
[Comprehensive research on AI safety]
</deep_research>

<summarize>
[Concise summary of key points]
</summarize>
```

### How It Works
1. Type trigger keyword in message
2. System detects and highlights trigger
3. Enhanced system prompt applied
4. Response wrapped in XML tags
5. TriggerBar shows trigger metadata
6. Clean content displayed to user

---

## 🤖 Custom Bots

### Create Your Own AI Assistant
- **Name & Description**: What does your bot do?
- **System Prompt**: Custom instructions for behavior
- **Category**: General, Coding, Writing, Research, Education, Business, Creative, etc.
- **Visibility**: Public (share with others) or Private (just for you)

### Example Bots

**Code Expert** (Coding)
```
System Prompt: "You are an expert software developer with 20+ years experience..."
Use: Code review, debugging, optimization, architecture
```

**Research Assistant** (Research)
```
System Prompt: "You are a meticulous researcher specializing in academic citations..."
Use: Literature review, fact verification, source compilation
```

**Creative Writer** (Creative)
```
System Prompt: "You are a creative writing coach specializing in storytelling..."
Use: Plot development, character creation, dialogue writing
```

### Management
- **Browse**: See all your bots in one place
- **Activate**: One-click activation for chat
- **Edit**: Modify prompts anytime
- **Share**: Export as JSON and share
- **Import**: Load shared bot configurations
- **Usage Tracking**: See how often each bot is used

---

## 🌐 Web Search Integration

### Features
- **Real-time Search**: Fetch current information from the web
- **Deep Research**: Comprehensive multi-source research
- **Automatic Search**: Toggle to search all queries
- **Command Mode**: Use `/websearch query` for on-demand search
- **Citation Links**: Sources included in responses
- **Search History**: Track all queries
- **Smart Injection**: Web results injected into AI context

### Usage
```
# Option 1: Command
User: "/websearch latest AI breakthroughs 2025"

# Option 2: Toggle
Settings → Enable Web Search → All messages search automatically

# Option 3: Deep Research
User: "deep research analyze market trends"
```

---

## 📊 Analytics Dashboard

### Metrics Tracked
- **Total Chats**: Number of conversations created
- **Messages**: Total messages sent and received
- **Models Used**: Breakdown of model usage
- **Tokens**: Token consumption per model
- **Cost Estimate**: Approximate API costs
- **Response Time**: Average response latency
- **Trigger Usage**: Most-used triggers
- **Daily Activity**: Usage trends over time

### Features
- **Real-time Stats**: Live metric updates
- **Export Data**: Download analytics as CSV
- **Time Range**: Filter by date range
- **Model Comparison**: Compare performance across models
- **Visual Charts**: Beautiful data visualization

---

## 🎨 Image Generation

### Supported Models
- **Flux** - State-of-the-art generation
- **Pollinations AI** - Fast and diverse
- **DALL-E 3** (via OpenRouter)
- **Midjourney** (via OpenRouter)
- **Stable Diffusion** - Classic model
- **Others** - 20+ additional models

### Features
- **Generate**: Create images from text prompts
- **Edit**: Inpaint and modify images
- **Upscale**: Enhance image quality
- **Style Control**: Apply artistic styles
- **Gallery View**: Browse all generated images
- **Chat Integration**: Link images to conversations
- **Download**: Export high-quality images

### Usage
```
User: "/img a futuristic city with flying cars"

AI: Generates image and displays in chat
```

---

## 🎨 Customization & Settings

### Theme Customization
- **Dark/Light Mode**: Toggle UI theme
- **Accent Color**: Primary action color
- **Sidebar Color**: Custom sidebar styling
- **Background**: Custom background patterns
- **Font Size**: Adjust text readability

### AI Settings
- **Model**: Switch between 50+ models
- **Temperature**: Control randomness
- **Max Tokens**: Set response length
- **Provider**: Puter JS or OpenRouter
- **Streaming**: Real-time response display
- **API Keys**: Custom OpenRouter key support

### Feature Toggles
- **Web Search**: Enable/disable web lookups
- **Deep Search**: Enhanced research mode
- **Incognito Mode**: Private temporary chats
- **Memory Context**: Include memories in prompts
- **Voice**: Text-to-speech for responses
- **Debug Logs**: Developer logging

### Task Modes
- **Standard**: General purpose
- **Reasoning**: Step-by-step thinking
- **Research**: Deep investigation
- **Creative**: Imaginative generation

---

## 🎙️ Voice Features

### Text-to-Speech (TTS)
- **6 Voices**: alloy, echo, fable, onyx, nova, shimmer
- **Auto-play**: Enable auto-play for responses
- **Manual Play**: Click to play any message
- **Speed Control**: Adjust playback speed
- **Language Support**: Multiple languages

### Usage
```
Settings → Enable Speech → Choose Voice → Auto-play (optional)
AI responses automatically read aloud
```

---

## 📱 Mobile Features

### iOS & Android Apps
- **Native Performance**: Built with Capacitor
- **Offline-First**: Work without internet
- **Local Storage**: All data on device
- **Push Notifications**: Daily reminders
- **Home Screen**: Add as app icon
- **App Store Ready**: Distribute via app stores

### Dynamic Island (iPhone 14+)
- **Task Tracking**: See chat progress in notch
- **Real-time Updates**: Progress bar visualization
- **Automatic Display**: Shows during operations
- **Smart Cleanup**: Auto-removes when complete

### Oppo Always-On Display
- **Always-On Visibility**: Task on lock screen
- **Custom Format**: Optimized for AOD
- **Progress Tracking**: Visual progress bars
- **Persistent Display**: Visible at all times

---

## 💾 Data Management

### Cloud Sync
- **Supabase Integration**: Cloud storage option
- **Cross-Device Sync**: Access chats everywhere
- **Auto-sync**: Automatic background sync
- **Conflict Resolution**: Smart merge handling
- **Optional**: Can be disabled for privacy

### Local Storage
- **Offline-First**: All data on device by default
- **IndexedDB**: Efficient local database
- **Persistent**: Data survives app reload
- **Private**: No cloud required

### Import/Export
- **Backup Chats**: Export all conversations
- **Restore**: Import previous backups
- **Format**: JSON format for compatibility
- **Selective**: Choose what to backup

### Incognito Mode
- **Private Chats**: Messages not saved
- **Temporary**: Auto-deleted on session end
- **No History**: No search/analytics tracking
- **Quick Toggle**: Enable in settings

---

## 🔐 Security & Privacy

- ✅ **Local-First Architecture**: Data stored on device by default
- ✅ **No Tracking**: Zero analytics or telemetry
- ✅ **Optional Cloud**: User-controlled Supabase sync
- ✅ **Input Validation**: All inputs validated with Zod
- ✅ **Rate Limiting**: API protection
- ✅ **Incognito Mode**: Private sessions
- ✅ **Export Control**: Full data ownership
- ✅ **Open Source**: Auditable code

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS |
| **UI Components** | shadcn/ui, Radix UI, Lucide Icons |
| **State & Data** | React Query, Local Storage, IndexedDB |
| **Backend** | Supabase (Auth, Database, Storage) |
| **AI APIs** | OpenRouter (200+ models), Puter.js |
| **Mobile** | Capacitor (iOS/Android), PWA |
| **Markdown** | react-markdown, remark-gfm, rehype-katex |
| **Build** | Vite, TypeScript, ESLint |
| **Hosting** | Vercel, Netlify, or self-hosted |

---

## 🚀 Quick Start

### Web App
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Mobile Apps

#### Android
```bash
npm run build
npx cap add android
npx cap sync android
npx cap open android
```

#### iOS
```bash
npm run build
npx cap add ios
npx cap sync ios
npx cap open ios
```

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| **Bundle Size** | ~1.2 MB (gzipped: 365 KB) |
| **Initial Load** | < 2 seconds |
| **Chat Response** | Real-time streaming |
| **Model Count** | 50+ models |
| **Max Tokens** | 100,000 tokens |
| **Component Count** | 30+ components |
| **Mobile Support** | iOS 13+, Android 8+ |

---

## 📋 Features by Section

### Sidebar Navigation
- 📝 **New Chat** - Start conversation
- 💬 **Chat History** - Browse previous chats
- 🧠 **MindStore** - Memory management
- 🤖 **Custom Bots** - Bot management
- 🎯 **Triggers** - Trigger gallery
- 📸 **Images** - Image gallery
- 🔍 **Search** - Chat/memory search
- ⚙️ **Settings** - Configuration
- 📊 **Analytics** - Usage dashboard
- 🌐 **Web Search** - Search panel

### Main Chat Area
- 💭 Message display with markdown/KaTeX
- 🎯 Trigger detection and highlighting
- 📎 Image attachment support
- 📋 Message actions (copy, share, react)
- ⏱️ Timestamp and metadata
- 🔄 Regenerate/edit options
- 📌 Pin important messages

### Settings Panel
- 🤖 **Model Settings** - Choose AI model
- 🎨 **Appearance** - Colors and themes
- 🌐 **API Configuration** - Custom keys
- 🔍 **Search Options** - Web/deep search
- 🎙️ **Voice Settings** - TTS configuration
- 📊 **Debug Logs** - Developer logging
- 💾 **Data Management** - Backup/restore

---

## 🛣️ Roadmap

### Completed ✅
- [x] 50+ AI Models integration
- [x] MindStore (Memory System)
- [x] 60+ Trigger Framework
- [x] Custom Bots
- [x] Web Search Integration
- [x] Analytics Dashboard
- [x] Image Generation
- [x] Mobile Apps (iOS/Android)
- [x] Dynamic Island Support
- [x] Full Customization

### Planned 🚀
- [ ] Bot Marketplace
- [ ] Collaborative Editing
- [ ] Voice Input (Speech-to-Text)
- [ ] Multi-language Support
- [ ] Plugin System
- [ ] Advanced Mermaid Diagrams
- [ ] Trigger Chaining/Workflows
- [ ] Team Features
- [ ] Advanced Analytics

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

Built with ❤️ using:
- [React](https://react.dev)
- [Vite](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)
- [OpenRouter](https://openrouter.ai)
- [Puter](https://puter.com)
- [Capacitor](https://capacitorjs.com)

---

## 📞 Support

- **GitHub Issues**: Report bugs and request features
- **GitHub Discussions**: Ask questions and share ideas
- **Email**: dev@onyxgpt.ai

---

**OnyxGPT v3.0.0** - The Most Powerful Free AI Platform

Get started today: [Visit OnyxGPT](https://onyxgpt.app)
