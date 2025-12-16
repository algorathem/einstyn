import { Sparkles, ThumbsUp, ThumbsDown, RefreshCw } from 'lucide-react';

interface AIFeedbackPanelProps {
  feedback: string | null;
  onRegenerate: () => void;
}

export const AIFeedbackPanel = ({ feedback, onRegenerate }: AIFeedbackPanelProps) => {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-node-secondary flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary-foreground" />
        </div>
        <h3 className="font-medium text-foreground">AI Feedback</h3>
      </div>

      {feedback ? (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
            {feedback}
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-success/20 text-muted-foreground hover:text-success transition-colors">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors">
              <ThumbsDown className="w-4 h-4" />
            </button>
            <button
              onClick={onRegenerate}
              className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Regenerate
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            AI feedback will appear here as you write
          </p>
        </div>
      )}
    </div>
  );
};
