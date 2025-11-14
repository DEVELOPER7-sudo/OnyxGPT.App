import { Sparkles, Image as ImageIcon, MessageSquare, Zap, Brain, Lightbulb, Rocket } from 'lucide-react';

const WelcomeMessage = () => {
  return (
    <div className="flex items-center justify-center h-full p-6 animate-fade-in">
      <div className="max-w-3xl text-center space-y-10">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        </div>

        {/* Main greeting */}
        <div className="space-y-6 animate-bounce-in relative z-10">
          <div className="inline-block p-4 bg-gradient-to-br from-primary/20 to-purple-600/20 rounded-2xl border border-white/10 backdrop-blur-sm glow-blue animate-pulse-glow">
            <img src="https://res.cloudinary.com/dcwnn9c0u/image/upload/v1763027959/zk5ditmfngx9bwa2fn7g.png" alt="OnyxGPT logo" className="w-14 h-14 rounded-lg shadow-lg" />
          </div>
          <div className="space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              Welcome to OnyxGPT
            </h1>
            <p className="text-lg text-muted-foreground animate-slide-up font-light">
              Your intelligent companion for conversations, creativity, and analysis
            </p>
          </div>
        </div>

        {/* Features grid with enhanced styling */}
        <div className="grid md:grid-cols-3 gap-4 mt-12 relative z-10">
          {/* Feature 1 */}
          <div className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-scale-in backdrop-blur-sm" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 space-y-3">
              <div className="inline-block p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-white">Chat Naturally</h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                Have fluid conversations with powerful AI models
              </p>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-scale-in backdrop-blur-sm" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 space-y-3">
              <div className="inline-block p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                <ImageIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="font-semibold text-lg text-white">Generate & Analyze</h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                Create amazing images and analyze any picture
              </p>
            </div>
          </div>
          
          {/* Feature 3 */}
          <div className="group relative p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 rounded-2xl hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 animate-scale-in backdrop-blur-sm" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 space-y-3">
              <div className="inline-block p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-semibold text-lg text-white">500+ Models</h3>
              <p className="text-sm text-muted-foreground group-hover:text-muted-foreground/80 transition-colors">
                Access GPT-5, Claude, Gemini, and more
              </p>
            </div>
          </div>
        </div>

        {/* Additional capabilities */}
        <div className="grid md:grid-cols-3 gap-3 mt-8 relative z-10">
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group cursor-pointer">
            <Brain className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span>Advanced Reasoning</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group cursor-pointer">
            <Lightbulb className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span>Smart Suggestions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-white transition-colors group cursor-pointer">
            <Rocket className="w-4 h-4 group-hover:text-primary transition-colors" />
            <span>Lightning Fast</span>
          </div>
        </div>

        {/* Call to action */}
        <div className="pt-8 space-y-4 animate-slide-up relative z-10" style={{ animationDelay: '0.4s' }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full">
            <Sparkles className="w-4 h-4 text-primary animate-spin" />
            <span className="text-sm text-primary font-medium">Ready to get started?</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Type a message below or upload an image to begin your journey
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-4">
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span>Powered by cutting-edge AI technology</span>
            <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeMessage;
