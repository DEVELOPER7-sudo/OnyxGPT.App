import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface TriggerTagWrapperProps {
  tagName: string;
  content: string;
  category?: string;
}

const TriggerTagWrapper = ({ tagName, content, category }: TriggerTagWrapperProps) => {
  const getCategoryColor = (cat?: string) => {
    if (!cat) return 'border-gray-500/30 bg-gray-500/5';
    
    if (cat.includes('Reasoning')) return 'border-blue-500/30 bg-blue-500/5';
    if (cat.includes('Research')) return 'border-green-500/30 bg-green-500/5';
    if (cat.includes('Planning')) return 'border-purple-500/30 bg-purple-500/5';
    if (cat.includes('Communication')) return 'border-orange-500/30 bg-orange-500/5';
    return 'border-primary/30 bg-primary/5';
  };

  const getCategoryIcon = (cat?: string) => {
    if (!cat) return '⚡';
    if (cat.includes('Reasoning')) return '🧩';
    if (cat.includes('Research')) return '🔍';
    if (cat.includes('Planning')) return '📋';
    if (cat.includes('Communication')) return '✨';
    return '⚡';
  };

  const getBadgeColor = (cat?: string) => {
    if (!cat) return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    
    if (cat.includes('Reasoning')) return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    if (cat.includes('Research')) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (cat.includes('Planning')) return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
    if (cat.includes('Communication')) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-primary/10 text-primary border-primary/20';
  };

  return (
    <Card className={cn(
      'my-4 p-4 border-2 transition-all duration-200 hover:shadow-lg',
      getCategoryColor(category)
    )}>
      {/* Header with tag name */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-current/20">
        <span className="text-lg">{getCategoryIcon(category)}</span>
        <Badge 
          variant="outline" 
          className={cn('font-mono text-xs', getBadgeColor(category))}
        >
          &lt;{tagName}&gt;
        </Badge>
        {category && (
          <span className="text-xs text-muted-foreground ml-auto">
            {category}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Footer with closing tag */}
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-current/20 opacity-60">
        <Badge 
          variant="outline" 
          className={cn('font-mono text-xs', getBadgeColor(category))}
        >
          &lt;/{tagName}&gt;
        </Badge>
      </div>
    </Card>
  );
};

export default TriggerTagWrapper;
