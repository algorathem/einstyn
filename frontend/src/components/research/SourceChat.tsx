import { useState } from 'react';
import { Finding } from './FindingCard';
import { 
  X, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Lightbulb, 
  BookOpen, 
  Quote, 
  FlaskConical,
  Send,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SourceChatProps {
  source: Finding;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  isPointForm?: boolean;
}

const generateSummaryPoints = (source: Finding): string[] => [
  `This research demonstrates ${source.title.toLowerCase()}, representing a significant advancement in the field.`,
  `Key methodology involves systematic analysis across multiple experimental conditions with rigorous statistical validation.`,
  `Results show consistent improvements of 15-30% over baseline approaches in standardized benchmarks.`,
  `The findings have been validated through peer review and independent replication studies.`,
  `Practical implications include enhanced performance in real-world applications with minimal computational overhead.`,
];

const generateImplementationDetails = (source: Finding): string[] => [
  `**Prerequisites**: Python 3.8+, PyTorch 2.0, CUDA 11.7 or higher`,
  `**Step 1**: Clone the official repository and install dependencies via \`pip install -r requirements.txt\``,
  `**Step 2**: Download pre-trained checkpoints from the provided model hub link`,
  `**Step 3**: Configure hyperparameters in \`config.yaml\` - recommended: batch_size=32, learning_rate=1e-4`,
  `**Step 4**: Run training with \`python train.py --config config.yaml --experiment_name your_run\``,
  `**Step 5**: Evaluate results using \`python evaluate.py --checkpoint best_model.pt\``,
  `**Common issues**: OOM errors can be resolved by reducing batch size or enabling gradient checkpointing`,
];

export const SourceChat = ({ source, onClose }: SourceChatProps) => {
  const [showImplementation, setShowImplementation] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Here's a summary of "${source.title}":`,
      isPointForm: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');

  const summaryPoints = generateSummaryPoints(source);
  const implementationDetails = generateImplementationDetails(source);

  const quickActions = [
    { icon: Quote, label: 'Cite this', action: 'Generate a citation for this source' },
    { icon: Lightbulb, label: 'Key insights', action: 'What are the most important insights from this research?' },
    { icon: BookOpen, label: 'Related work', action: 'What related research should I explore?' },
    { icon: FlaskConical, label: 'Limitations', action: 'What are the limitations of this study?' },
  ];

  const handleQuickAction = (action: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: action,
    };
    
    // Simulate AI response
    const responses: Record<string, string> = {
      'Generate a citation for this source': `**APA Format:**\n\nAuthors, A. A., & Authors, B. B. (2024). ${source.title}. *Journal of AI Research*, 15(3), 234-256. https://doi.org/10.xxxx/xxxxx`,
      'What are the most important insights from this research?': `• The primary breakthrough is the discovery of emergent capabilities at scale\n• Cross-domain transfer learning shows promising results\n• The methodology can be applied to adjacent problem domains\n• Energy efficiency improvements make deployment more practical`,
      'What related research should I explore?': `• "Scaling Laws for Neural Language Models" - foundational work on emergence\n• "Constitutional AI" - related safety considerations\n• "Instruction Tuning" - complementary training techniques\n• "Retrieval Augmented Generation" - practical applications`,
      'What are the limitations of this study?': `• Limited to English language data in experiments\n• Computational requirements may be prohibitive for smaller labs\n• Long-term stability of results not yet established\n• Edge cases in adversarial settings not fully explored`,
    };

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responses[action] || 'I can help you explore that aspect of the research.',
    };

    setMessages([...messages, userMessage, aiMessage]);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
    };

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `Based on the research in "${source.title}", I can provide more context on your question. The methodology section indicates that the researchers used a combination of quantitative and qualitative approaches to validate their findings. Would you like me to elaborate on any specific aspect?`,
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInputValue('');
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm rounded-lg border border-border/50">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-border/50">
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs text-muted-foreground">Source Chat</span>
          </div>
          <h3 className="text-sm font-semibold text-foreground truncate">
            {source.title}
          </h3>
          <div className="flex items-center gap-2 mt-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                source.trustScore >= 80 
                  ? 'border-green-500/50 text-green-400' 
                  : source.trustScore >= 60 
                  ? 'border-yellow-500/50 text-yellow-400'
                  : 'border-red-500/50 text-red-400'
              }`}
            >
              Trust: {source.trustScore}%
            </Badge>
            <Badge 
              variant="outline"
              className={`text-xs ${
                source.factCheckStatus === 'verified' 
                  ? 'border-green-500/50 text-green-400'
                  : source.factCheckStatus === 'pending'
                  ? 'border-yellow-500/50 text-yellow-400'
                  : 'border-red-500/50 text-red-400'
              }`}
            >
              {source.factCheckStatus}
            </Badge>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="shrink-0 h-8 w-8"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary/20 text-foreground' 
                    : 'bg-secondary/50 text-foreground'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}

          {/* Summary Points */}
          {messages.length === 1 && (
            <div className="bg-secondary/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-medium">Key Points</span>
              </div>
              <ul className="space-y-2">
                {summaryPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="text-primary mt-1">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Implementation Details Toggle */}
          <div className="border border-border/50 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowImplementation(!showImplementation)}
              className="w-full flex items-center justify-between p-3 bg-secondary/20 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Implementation Details</span>
              </div>
              {showImplementation ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
            
            {showImplementation && (
              <div className="p-4 bg-secondary/10 space-y-2">
                {implementationDetails.map((detail, idx) => (
                  <p key={idx} className="text-sm text-foreground/90">
                    {detail}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground">Quick actions</span>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  className="text-xs h-8 bg-secondary/30 border-border/50 hover:bg-secondary/50"
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about this source..."
            className="flex-1 bg-secondary/30 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputValue.trim()}
            className="shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
