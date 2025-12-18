import { Shield, AlertTriangle, CheckCircle, ExternalLink, ChevronDown, EyeOff, Eye } from 'lucide-react';
import { useState } from 'react';

export type SourceType = 'academic' | 'news' | 'blog' | 'dataset' | 'government' | 'other';

export interface Finding {
  id: string;
  title: string;
  summary: string;
  source: string;
  trustScore: number;
  factCheckStatus: 'verified' | 'pending' | 'disputed';
  reasoning?: string;
  relevance?: number;
  publishedDate?: string;
  sourceType?: SourceType;
}

interface FindingCardProps {
  finding: Finding;
  index: number;
  isExcluded?: boolean;
  onToggleExclude?: (id: string) => void;
  isSelected?: boolean;
  onSelect?: (finding: Finding) => void;
}

export const FindingCard = ({ finding, index, isExcluded = false, onToggleExclude, isSelected = false, onSelect }: FindingCardProps) => {
  const [showReasoning, setShowReasoning] = useState(false);

  const getTrustBadge = () => {
    if (finding.trustScore >= 80) {
      return { class: 'trust-high', label: 'High Trust', icon: Shield };
    } else if (finding.trustScore >= 50) {
      return { class: 'trust-medium', label: 'Medium Trust', icon: AlertTriangle };
    } else {
      return { class: 'trust-low', label: 'Low Trust', icon: AlertTriangle };
    }
  };

  const getFactCheckBadge = () => {
    switch (finding.factCheckStatus) {
      case 'verified':
        return { class: 'trust-high', label: 'Verified', icon: CheckCircle };
      case 'pending':
        return { class: 'trust-medium', label: 'Pending', icon: AlertTriangle };
      case 'disputed':
        return { class: 'trust-low', label: 'Disputed', icon: AlertTriangle };
    }
  };

  const getSourceTypeLabel = (type?: SourceType) => {
    const labels: Record<SourceType, string> = {
      academic: 'Academic Paper',
      news: 'News Article',
      blog: 'Blog Post',
      dataset: 'Dataset',
      government: 'Government',
      other: 'Other'
    };
    return type ? labels[type] : 'Unknown';
  };

  const trustBadge = getTrustBadge();
  const factBadge = getFactCheckBadge();
  const TrustIcon = trustBadge.icon;
  const FactIcon = factBadge.icon;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons/links
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;
    onSelect?.(finding);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`glass-card-hover p-4 animate-slide-in-left transition-all cursor-pointer ${
        isExcluded ? 'opacity-50' : ''
      } ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className={`font-medium text-foreground line-clamp-2 ${isExcluded ? 'line-through' : ''}`}>
          {finding.title}
        </h4>
        <div className="flex items-center gap-2">
          {onToggleExclude && (
            <button
              onClick={() => onToggleExclude(finding.id)}
              className={`p-1 rounded hover:bg-secondary/50 transition-colors ${
                isExcluded ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'
              }`}
              title={isExcluded ? 'Include source' : 'Exclude source'}
            >
              {isExcluded ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          )}
          <span className="text-xs text-primary font-medium">#{finding.id}</span>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
        {finding.summary}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${trustBadge.class}`}>
          <TrustIcon className="w-3 h-3" />
          {finding.trustScore}%
        </span>
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${factBadge.class}`}>
          <FactIcon className="w-3 h-3" />
          {factBadge.label}
        </span>
        {finding.relevance !== undefined && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
            {finding.relevance}% Match
          </span>
        )}
        {finding.sourceType && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-muted-foreground">
            {getSourceTypeLabel(finding.sourceType)}
          </span>
        )}
      </div>

      {finding.publishedDate && (
        <p className="text-xs text-muted-foreground mb-3">
          Published: {new Date(finding.publishedDate).toLocaleDateString()}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <a
          href={finding.source}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Source
        </a>
        <button
          onClick={() => setShowReasoning(!showReasoning)}
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          Explain Reasoning
          <ChevronDown
            className={`w-3 h-3 transition-transform ${showReasoning ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {showReasoning && finding.reasoning && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {finding.reasoning}
          </p>
        </div>
      )}
    </div>
  );
};