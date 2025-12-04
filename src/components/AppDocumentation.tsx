import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react';
import { toast } from 'sonner';

const AppDocumentation = () => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-secondary/20 p-4 md:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            AionyxGPT Documentation
          </h1>
          <p className="text-muted-foreground text-lg">
            Complete guide to all features, models, settings, and AI capabilities
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6 gap-2">
            <TabsTrigger value="overview" className="text-xs md:text-sm">Features</TabsTrigger>
            <TabsTrigger value="models" className="text-xs md:text-sm">Models</TabsTrigger>
            <TabsTrigger value="speech" className="text-xs md:text-sm">Speech</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs md:text-sm">Settings</TabsTrigger>
            <TabsTrigger value="shortcuts" className="text-xs md:text-sm">Shortcuts</TabsTrigger>
            <TabsTrigger value="api" className="text-xs md:text-sm">APIs</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">🎯 Core Features</h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">💬 Chat Interface</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time messaging with streaming responses, thinking visualization, and message editing
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">🖼️ Vision AI</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload and analyze images with detailed descriptions and insights
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">🎤 Voice Input</h3>
                  <p className="text-sm text-muted-foreground">
                    Record and transcribe voice messages directly into your chat
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">🔊 Audio Output</h3>
                  <p className="text-sm text-muted-foreground">
                    Listen to AI responses with multiple voice options and auto-play
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">🌐 Web Search</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time internet search integration for current information
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">🏷️ Trigger System</h3>
                  <p className="text-sm text-muted-foreground">
                    Collapsible content segments with custom tags for organized responses
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">💾 Memory System</h3>
                  <p className="text-sm text-muted-foreground">
                    Persistent memory context across conversations with tagging and organization
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <h3 className="font-semibold flex items-center gap-2">📊 Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Track your chat activity, model usage, and interaction statistics
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">🤖 Available AI Models</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('text-models')}
                  >
                    {expandedSections.has('text-models') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">📝 Text Models</h3>
                  </div>
                  {expandedSections.has('text-models') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">Featured Models (Puter JS)</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>🟢 GPT-5 Nano - High speed, latest features</li>
                          <li>🟦 Claude Sonnet 4.5 - Advanced reasoning</li>
                          <li>🟨 Gemini 2.5 Pro - Multimodal capabilities</li>
                          <li>🟥 DeepSeek R1 - Specialized reasoning</li>
                          <li>🟪 Grok-3 - Real-time information</li>
                          <li>🟧 Llama 4 - Open-source alternative</li>
                        </ul>
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm">🐬 Uncensored Model (OpenRouter)</p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>Venice - Uncensored responses (requires OpenRouter API key)</li>
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('image-models')}
                  >
                    {expandedSections.has('image-models') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">🖼️ Image Generation Models</h3>
                  </div>
                  {expandedSections.has('image-models') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>
                          <strong>Pollinations (Fast)</strong> - Quick generation, good quality
                        </li>
                        <li>
                          <strong>Flux (Realistic)</strong> - Highly detailed, photorealistic images
                        </li>
                        <li>
                          <strong>DALL-E 3</strong> - OpenAI's advanced model
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Speech Tab */}
          <TabsContent value="speech" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">🎙️ Speech & Audio Features</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('voice-input')}
                  >
                    {expandedSections.has('voice-input') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">🎤 Voice Input (Speech-to-Text)</h3>
                  </div>
                  {expandedSections.has('voice-input') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Record voice messages and automatically transcribe them into your chat input.
                      </p>
                      <div className="bg-secondary/30 p-3 rounded space-y-2">
                        <p className="font-semibold text-sm">How to Use:</p>
                        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                          <li>Click the 🎤 microphone button in the input area</li>
                          <li>Speak clearly into your microphone</li>
                          <li>Click the button again to stop recording</li>
                          <li>Your speech will be transcribed automatically</li>
                        </ol>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded">
                        <p className="text-sm">
                          <strong>API:</strong> Pollinations AI Speech-to-Text (requires microphone access)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('voice-output')}
                  >
                    {expandedSections.has('voice-output') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">🔊 Voice Output (Text-to-Speech)</h3>
                  </div>
                  {expandedSections.has('voice-output') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Listen to AI responses in multiple voice styles. Enable in settings for full control.
                      </p>
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">Available Voices:</p>
                        <div className="grid gap-2">
                          {[
                            { name: 'Alloy', desc: 'Neutral, professional' },
                            { name: 'Echo', desc: 'Deep, resonant' },
                            { name: 'Fable', desc: 'Storyteller vibe' },
                            { name: 'Onyx', desc: 'Warm, rich' },
                            { name: 'Nova', desc: 'Bright, friendly' },
                            { name: 'Shimmer', desc: 'Soft, melodic' },
                          ].map((voice) => (
                            <div
                              key={voice.name}
                              className="text-sm text-muted-foreground p-2 bg-secondary/30 rounded"
                            >
                              <strong>{voice.name}</strong> - {voice.desc}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-secondary/30 p-3 rounded space-y-2">
                        <p className="font-semibold text-sm">How to Use:</p>
                        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                          <li>Click the 🔊 speaker button under any AI response</li>
                          <li>The audio will start playing immediately</li>
                          <li>Click the ⏹️ stop button to pause</li>
                          <li>Choose your preferred voice in Settings</li>
                        </ol>
                      </div>
                      <div className="bg-blue-500/5 border border-blue-500/20 p-3 rounded">
                        <p className="text-sm">
                          <strong>API:</strong> Pollinations AI Text-to-Speech (no additional setup needed)
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('speech-settings')}
                  >
                    {expandedSections.has('speech-settings') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">⚙️ Speech Settings</h3>
                  </div>
                  {expandedSections.has('speech-settings') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <div className="space-y-2 text-sm">
                        <div className="p-2 bg-secondary/30 rounded">
                          <p className="font-semibold">Enable Text-to-Speech</p>
                          <p className="text-muted-foreground text-xs">
                            Toggle speech features on/off globally
                          </p>
                        </div>
                        <div className="p-2 bg-secondary/30 rounded">
                          <p className="font-semibold">Voice Selection</p>
                          <p className="text-muted-foreground text-xs">
                            Choose from 6 unique voice styles (Nova, Alloy, Echo, etc.)
                          </p>
                        </div>
                        <div className="p-2 bg-secondary/30 rounded">
                          <p className="font-semibold">Auto-Play Response Audio</p>
                          <p className="text-muted-foreground text-xs">
                            Automatically play audio for all new AI responses
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">⚙️ Settings & Configuration</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('model-settings')}
                  >
                    {expandedSections.has('model-settings') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">🤖 Model Selection</h3>
                  </div>
                  {expandedSections.has('model-settings') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Choose text and image models for your conversations.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Default uses free Puter JS models</li>
                        <li>• Switch to Venice for uncensored responses (requires OpenRouter API key)</li>
                        <li>• Custom models: Add your own model IDs for OpenRouter or Together AI</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('param-settings')}
                  >
                    {expandedSections.has('param-settings') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">📊 Model Parameters</h3>
                  </div>
                  {expandedSections.has('param-settings') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <div className="space-y-2">
                        <div className="p-2 bg-secondary/30 rounded">
                          <p className="font-semibold text-sm">Temperature (0-2)</p>
                          <p className="text-muted-foreground text-xs">
                            Lower = focused, deterministic | Higher = creative, random
                          </p>
                        </div>
                        <div className="p-2 bg-secondary/30 rounded">
                          <p className="font-semibold text-sm">Max Tokens</p>
                          <p className="text-muted-foreground text-xs">
                            Maximum length of generated responses
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('theme-settings')}
                  >
                    {expandedSections.has('theme-settings') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">🎨 Theme & Appearance</h3>
                  </div>
                  {expandedSections.has('theme-settings') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Customize colors, theme, and visual appearance.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Dark/Light mode toggle</li>
                        <li>• Custom primary and accent colors</li>
                        <li>• Background and sidebar customization</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Shortcuts Tab */}
          <TabsContent value="shortcuts" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">⌨️ Keyboard Shortcuts & Tips</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Chat Navigation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded text-sm">
                      <span>Send message</span>
                      <Badge variant="outline">Enter</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded text-sm">
                      <span>New line in message</span>
                      <Badge variant="outline">Shift + Enter</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded text-sm">
                      <span>Scroll to bottom</span>
                      <Badge variant="outline">Click ⬇️ button</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Message Actions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded text-sm">
                      <span>Copy response</span>
                      <Badge variant="outline">Copy button (📋)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded text-sm">
                      <span>Read response aloud</span>
                      <Badge variant="outline">Speaker button (🔊)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded text-sm">
                      <span>Regenerate response</span>
                      <Badge variant="outline">Reload button (↻)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-secondary/30 rounded text-sm">
                      <span>Edit user message</span>
                      <Badge variant="outline">Edit button (✏️)</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Input Tips</h3>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-blue-500/5 border border-blue-500/20 rounded">
                      <p>💡 Type <code className="bg-secondary px-2 py-1 rounded">/img</code> to generate images directly</p>
                    </div>
                    <div className="p-2 bg-blue-500/5 border border-blue-500/20 rounded">
                      <p>🎤 Use the microphone button to transcribe voice messages</p>
                    </div>
                    <div className="p-2 bg-blue-500/5 border border-blue-500/20 rounded">
                      <p>📎 Click the attachment icon to upload images for analysis</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api" className="space-y-4">
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold">🔌 API Integrations</h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('puter-api')}
                  >
                    {expandedSections.has('puter-api') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">Puter JS API</h3>
                  </div>
                  {expandedSections.has('puter-api') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Free cloud AI service with 400M tokens per account per month.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Powers all default text models (GPT-5, Claude, Gemini, etc.)</li>
                        <li>• Requires Puter account (free)</li>
                        <li>• No API key needed - works out of the box</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('openrouter-api')}
                  >
                    {expandedSections.has('openrouter-api') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">OpenRouter API</h3>
                  </div>
                  {expandedSections.has('openrouter-api') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Access to Venice (uncensored) and many other premium models.
                      </p>
                      <div className="bg-secondary/30 p-3 rounded space-y-2">
                        <p className="text-sm font-semibold">How to Set Up:</p>
                        <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                          <li>Visit <a href="https://openrouter.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">openrouter.ai</a></li>
                          <li>Create a free account</li>
                          <li>Get your API key from settings</li>
                          <li>Paste it in Settings → OpenRouter API Key</li>
                          <li>Select Venice model to use</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('pollinations-api')}
                  >
                    {expandedSections.has('pollinations-api') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">Pollinations AI API</h3>
                  </div>
                  {expandedSections.has('pollinations-api') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Free speech-to-text and text-to-speech API.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Text-to-Speech: 6 voice options</li>
                        <li>• Speech-to-Text: Transcribe audio to text</li>
                        <li>• No API key required</li>
                        <li>• Requires microphone permission for voice input</li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div
                    className="cursor-pointer flex items-center gap-2 p-3 hover:bg-secondary/50 rounded-lg"
                    onClick={() => toggleSection('together-api')}
                  >
                    {expandedSections.has('together-api') ? (
                      <ChevronDown className="w-5 h-5" />
                    ) : (
                      <ChevronRight className="w-5 h-5" />
                    )}
                    <h3 className="font-semibold">Together AI API</h3>
                  </div>
                  {expandedSections.has('together-api') && (
                    <div className="pl-8 space-y-3 py-3 border-l border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Alternative API provider for custom models.
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Use for custom model deployment</li>
                        <li>• Requires Together AI API key</li>
                        <li>• Add custom models in Settings</li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* API Status */}
              <div className="border-t border-border pt-4 mt-4">
                <h3 className="font-semibold mb-2">API Status & Limits</h3>
                <div className="space-y-2">
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded text-sm">
                    <p className="font-semibold text-green-700 dark:text-green-400">✅ All APIs Operational</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded text-sm">
                    <p><strong>Puter:</strong> 400M tokens/month</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <Card className="p-6 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <div className="space-y-2">
            <h3 className="font-semibold">📚 More Resources</h3>
            <p className="text-sm text-muted-foreground">
              For more help and updates, visit our settings panel for detailed configuration options and feature toggles.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AppDocumentation;
