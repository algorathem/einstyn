import { useState, useMemo } from 'react';
import { FindingCard, Finding, SourceType } from './FindingCard';
import { FileStack, Filter, ChevronDown, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';

interface FindingsPanelProps {
  findings: Finding[];
}

type SortOption = 'relevance' | 'trustScore' | 'date';

export const FindingsPanel = ({ findings }: FindingsPanelProps) => {
  const [excludedIds, setExcludedIds] = useState<Set<string>>(new Set());
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [minRelevance, setMinRelevance] = useState(0);
  const [minTrustScore, setMinTrustScore] = useState(0);
  const [factCheckFilters, setFactCheckFilters] = useState<Set<'verified' | 'pending' | 'disputed'>>(
    new Set(['verified', 'pending', 'disputed'])
  );
  const [sourceTypeFilters, setSourceTypeFilters] = useState<Set<SourceType>>(
    new Set(['academic', 'news', 'blog', 'dataset', 'government', 'other'])
  );
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [hideExcluded, setHideExcluded] = useState(false);

  const toggleExclude = (id: string) => {
    setExcludedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleFactCheck = (status: 'verified' | 'pending' | 'disputed') => {
    setFactCheckFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(status)) {
        newSet.delete(status);
      } else {
        newSet.add(status);
      }
      return newSet;
    });
  };

  const toggleSourceType = (type: SourceType) => {
    setSourceTypeFilters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(type)) {
        newSet.delete(type);
      } else {
        newSet.add(type);
      }
      return newSet;
    });
  };

  const filteredFindings = useMemo(() => {
    let result = findings.filter(finding => {
      // Hide excluded if enabled
      if (hideExcluded && excludedIds.has(finding.id)) return false;
      
      // Relevance filter
      if (finding.relevance !== undefined && finding.relevance < minRelevance) return false;
      
      // Trust score filter
      if (finding.trustScore < minTrustScore) return false;
      
      // Fact check filter
      if (!factCheckFilters.has(finding.factCheckStatus)) return false;
      
      // Source type filter
      if (finding.sourceType && !sourceTypeFilters.has(finding.sourceType)) return false;
      
      return true;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'relevance':
          return (b.relevance ?? 0) - (a.relevance ?? 0);
        case 'trustScore':
          return b.trustScore - a.trustScore;
        case 'date':
          const dateA = a.publishedDate ? new Date(a.publishedDate).getTime() : 0;
          const dateB = b.publishedDate ? new Date(b.publishedDate).getTime() : 0;
          return dateB - dateA;
        default:
          return 0;
      }
    });

    return result;
  }, [findings, excludedIds, hideExcluded, minRelevance, minTrustScore, factCheckFilters, sourceTypeFilters, sortBy]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (minRelevance > 0) count++;
    if (minTrustScore > 0) count++;
    if (factCheckFilters.size < 3) count++;
    if (sourceTypeFilters.size < 6) count++;
    if (hideExcluded) count++;
    return count;
  }, [minRelevance, minTrustScore, factCheckFilters, sourceTypeFilters, hideExcluded]);

  const clearFilters = () => {
    setMinRelevance(0);
    setMinTrustScore(0);
    setFactCheckFilters(new Set(['verified', 'pending', 'disputed']));
    setSourceTypeFilters(new Set(['academic', 'news', 'blog', 'dataset', 'government', 'other']));
    setHideExcluded(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileStack className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Findings</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {filteredFindings.length}/{findings.length}
          </span>
        </div>
        <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors relative">
              <Filter className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 bg-card border-border z-50">
            <div className="flex items-center justify-between px-2 py-1.5">
              <DropdownMenuLabel className="p-0">Filter Sources</DropdownMenuLabel>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            <DropdownMenuSeparator />

            {/* Sort By */}
            <div className="px-2 py-2">
              <label className="text-xs text-muted-foreground mb-2 block">Sort By</label>
              <div className="flex gap-1">
                {(['relevance', 'trustScore', 'date'] as SortOption[]).map(option => (
                  <button
                    key={option}
                    onClick={() => setSortBy(option)}
                    className={`px-2 py-1 text-xs rounded transition-colors ${
                      sortBy === option
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {option === 'trustScore' ? 'Trust' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <DropdownMenuSeparator />

            {/* Relevance Slider */}
            <div className="px-2 py-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted-foreground">Min Relevance</label>
                <span className="text-xs text-foreground">{minRelevance}%</span>
              </div>
              <Slider
                value={[minRelevance]}
                onValueChange={([value]) => setMinRelevance(value)}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
            <DropdownMenuSeparator />

            {/* Trust Score Slider */}
            <div className="px-2 py-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-muted-foreground">Min Trust Score</label>
                <span className="text-xs text-foreground">{minTrustScore}%</span>
              </div>
              <Slider
                value={[minTrustScore]}
                onValueChange={([value]) => setMinTrustScore(value)}
                max={100}
                step={10}
                className="w-full"
              />
            </div>
            <DropdownMenuSeparator />

            {/* Fact Check Status */}
            <DropdownMenuLabel className="text-xs">Fact-Check Status</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={factCheckFilters.has('verified')}
              onCheckedChange={() => toggleFactCheck('verified')}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Verified
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={factCheckFilters.has('pending')}
              onCheckedChange={() => toggleFactCheck('pending')}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />
                Pending
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={factCheckFilters.has('disputed')}
              onCheckedChange={() => toggleFactCheck('disputed')}
            >
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Disputed
              </span>
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />

            {/* Source Type */}
            <DropdownMenuLabel className="text-xs">Source Type</DropdownMenuLabel>
            {(['academic', 'news', 'blog', 'dataset', 'government', 'other'] as SourceType[]).map(type => (
              <DropdownMenuCheckboxItem
                key={type}
                checked={sourceTypeFilters.has(type)}
                onCheckedChange={() => toggleSourceType(type)}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />

            {/* Hide Excluded */}
            <DropdownMenuCheckboxItem
              checked={hideExcluded}
              onCheckedChange={(checked) => setHideExcluded(checked)}
            >
              Hide manually excluded sources
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {excludedIds.size > 0 && (
        <div className="mb-3 p-2 rounded-lg bg-secondary/30 text-xs text-muted-foreground flex items-center justify-between">
          <span>{excludedIds.size} source(s) excluded</span>
          <button
            onClick={() => setExcludedIds(new Set())}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            Restore all
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1">
        {filteredFindings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <FileStack className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              {findings.length === 0 
                ? 'Research findings will appear here'
                : 'No findings match current filters'}
            </p>
            {findings.length > 0 && activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          filteredFindings.map((finding, index) => (
            <FindingCard
              key={finding.id}
              finding={finding}
              index={index}
              isExcluded={excludedIds.has(finding.id)}
              onToggleExclude={toggleExclude}
            />
          ))
        )}
      </div>
    </div>
  );
};