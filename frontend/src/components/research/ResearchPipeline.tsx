import { Pause, Play, SkipForward, CheckCircle2, Loader2, Circle } from 'lucide-react';

interface PipelineStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

interface ResearchPipelineProps {
  steps: PipelineStep[];
  currentStep: number;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
}

export const ResearchPipeline = ({
  steps,
  currentStep,
  isPaused,
  onPause,
  onResume,
  onSkip,
}: ResearchPipelineProps) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Research Pipeline
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={isPaused ? onResume : onPause}
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button
            onClick={onSkip}
            className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-secondary rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-node-secondary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.status === 'completed';
          
          return (
            <div
              key={step.id}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-300
                ${isActive ? 'bg-primary/10 border border-primary/30' : ''}
                ${isCompleted ? 'opacity-60' : ''}
              `}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : isActive ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <span
                className={`
                  text-sm font-medium
                  ${isActive ? 'text-primary glow-text' : ''}
                  ${isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
