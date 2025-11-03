const MotionBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 opacity-30 animate-gradient"
        style={{
          background: `linear-gradient(45deg, 
            hsl(var(--primary) / 0.1), 
            hsl(var(--accent) / 0.1), 
            hsl(var(--primary) / 0.15),
            hsl(var(--accent) / 0.05)
          )`,
        }}
      />
      
      {/* Floating orbs with staggered animations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-primary/3 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
      <div className="absolute top-1/2 right-1/3 w-80 h-80 bg-accent/4 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      
      {/* Center pulsing glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl animate-pulse-glow" />
      
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default MotionBackground;
