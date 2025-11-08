import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info } from 'lucide-react';
import { Trigger } from '@/lib/triggers';

interface TriggerBarProps {
  triggers: Trigger[];
  metadata: any[];
  rawContent: string;
}

const TriggerBar = ({ triggers, metadata, rawContent }: TriggerBarProps) => {
  const [expandedTrigger, setExpandedTrigger] = useState<string | null>(null);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Reasoning & Analysis': return 'bg-blue-500/20 text-blue-300';
      case 'Research & Information': return 'bg-green-500/20 text-green-300';
      case 'Planning & Organization': return 'bg-yellow-500/20 text-yellow-300';
      case 'Communication & Style': return 'bg-purple-500/20 text-purple-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const handleToggle = (triggerName: string) => {
    setExpandedTrigger(expandedTrigger === triggerName ? null : triggerName);
  };

  return (
    <div className="p-2 bg-background/50 rounded-lg mb-2">
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold text-muted-foreground mr-2">Triggers:</span>
        {triggers.map(trigger => (
          <button 
            key={trigger.trigger}
            onClick={() => handleToggle(trigger.trigger)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${getCategoryColor(trigger.category)} hover:scale-105`}
          >
            {trigger.trigger}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {expandedTrigger && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="mt-2 p-4 bg-black/20 rounded-md overflow-hidden"
          >
            <h3 className="font-bold text-lg mb-2 capitalize">{expandedTrigger}</h3>
            {metadata.filter(m => m.trigger === expandedTrigger).map((meta, i) => (
              <div key={i} className="text-sm">
                <p className="mb-2"><strong className="text-primary">Purpose:</strong> {meta.purpose}</p>
                <p className="mb-2"><strong className="text-primary">Context:</strong> {meta.context_used}</p>
                <p><strong className="text-primary">Influence:</strong> {meta.influence_scope}</p>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t border-border/20">
                <h4 className="font-semibold mb-2">Raw Content:</h4>
                <pre className="text-xs whitespace-pre-wrap bg-black/30 p-2 rounded"><code>{rawContent}</code></pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TriggerBar;
