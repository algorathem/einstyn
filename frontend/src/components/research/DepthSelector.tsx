import { Layers, Zap, Brain } from 'lucide-react';

export type ResearchDepth = 'surface' | 'intermediate' | 'advanced';

interface DepthSelectorProps {
  value: ResearchDepth;
  onChange: (depth: ResearchDepth) => void;
}

const depths = [
  {
    id: 'surface' as const,
    label: 'Surface',
    description: 'Quick overview',
    icon: Zap,
  },
  {
    id: 'intermediate' as const,
    label: 'Intermediate',
    description: 'Balanced depth',
    icon: Layers,
  },
  {
    id: 'advanced' as const,
    label: 'Advanced',
    description: 'Deep analysis',
    icon: Brain,
  },
];

export const DepthSelector = ({ value, onChange }: DepthSelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Research Depth:</span>
      <div className="flex gap-2">
        {depths.map((depth) => {
          const Icon = depth.icon;
          const isActive = value === depth.id;
          
          return (
            <button
              key={depth.id}
              onClick={() => onChange(depth.id)}
              className={`
                depth-button flex items-center gap-2
                ${isActive ? 'depth-button-active' : ''}
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{depth.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
