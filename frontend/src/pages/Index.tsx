import { useState, useEffect } from 'react';
import { KnowledgeGraph } from '@/components/background/KnowledgeGraph';
import { FooterGraph } from '@/components/background/FooterGraph';
import { Header } from '@/components/layout/Header';
import { QueryInput } from '@/components/research/QueryInput';
import { DepthSelector, ResearchDepth } from '@/components/research/DepthSelector';
import { ResearchPipeline } from '@/components/research/ResearchPipeline';
import { FindingsPanel } from '@/components/research/FindingsPanel';
import { ReportEditor } from '@/components/research/ReportEditor';
import { DashboardCards } from '@/components/dashboard/DashboardCards';
import { Finding } from '@/components/research/FindingCard';
import { SourceChat } from '@/components/research/SourceChat';
import { LayoutDashboard, Microscope } from 'lucide-react';

const mockFindings: Finding[] = [
  {
    id: 'F001',
    title: 'Large Language Models Show Emergent Reasoning',
    summary: 'Recent studies demonstrate that LLMs exhibit emergent reasoning capabilities at scale, with performance improvements appearing suddenly beyond certain parameter thresholds.',
    source: 'https://arxiv.org/example',
    trustScore: 92,
    factCheckStatus: 'verified',
    reasoning: 'This finding is supported by multiple peer-reviewed papers from leading AI research labs. The methodology used follows established benchmarks and the results have been replicated.',
  },
  {
    id: 'F002',
    title: 'Chain-of-Thought Prompting Enhances Performance',
    summary: 'Chain-of-thought prompting significantly improves model performance on complex reasoning tasks by encouraging step-by-step problem decomposition.',
    source: 'https://arxiv.org/example2',
    trustScore: 88,
    factCheckStatus: 'verified',
    reasoning: 'This technique has been validated across multiple model architectures and task types. The improvements are consistent and statistically significant.',
  },
  {
    id: 'F003',
    title: 'Attention Mechanisms May Not Be Optimal',
    summary: 'Emerging research suggests alternative architectures may outperform traditional attention mechanisms in certain domains, though results are still preliminary.',
    source: 'https://arxiv.org/example3',
    trustScore: 65,
    factCheckStatus: 'pending',
    reasoning: 'While promising, these findings are from recent preprints and have not yet undergone extensive peer review. More replication studies are needed.',
  },
];

const mockSessions = [
  { id: '1', title: 'LLM Reasoning Capabilities Analysis', date: 'Dec 15, 2024', findingsCount: 12, status: 'completed' as const },
  { id: '2', title: 'Neural Architecture Search Survey', date: 'Dec 14, 2024', findingsCount: 8, status: 'in-progress' as const },
  { id: '3', title: 'Multimodal Learning Trends', date: 'Dec 13, 2024', findingsCount: 15, status: 'completed' as const },
  { id: '4', title: 'Reinforcement Learning from Human Feedback', date: 'Dec 12, 2024', findingsCount: 6, status: 'paused' as const },
];

const pipelineSteps = [
  { id: '1', label: 'Query Analysis', status: 'completed' as const },
  { id: '2', label: 'Source Discovery', status: 'completed' as const },
  { id: '3', label: 'Content Extraction', status: 'active' as const },
  { id: '4', label: 'Fact Verification', status: 'pending' as const },
  { id: '5', label: 'Synthesis', status: 'pending' as const },
];

export default function Index() {
  const [view, setView] = useState<'research' | 'dashboard'>('research');
  const [depth, setDepth] = useState<ResearchDepth>('intermediate');
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState(2);
  const [findings, setFindings] = useState<Finding[]>(mockFindings);
  const [isResearching, setIsResearching] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editorExpanded, setEditorExpanded] = useState(false);
  const [selectedSource, setSelectedSource] = useState<Finding | null>(null);
  
  const handleSearch = (query: string) => {
    setIsResearching(true);
    setCurrentStep(0);
    // Simulate research progress
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= pipelineSteps.length - 1) {
          clearInterval(interval);
          setIsResearching(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Background Knowledge Graph */}
      <KnowledgeGraph />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* View Toggle */}
        <div className="px-6 py-4 flex items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 bg-secondary/30 rounded-lg p-1">
            <button
              onClick={() => setView('research')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'research'
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Microscope className="w-4 h-4" />
              Research
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                view === 'dashboard'
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
          </div>

          {view === 'research' && (
            <DepthSelector value={depth} onChange={setDepth} />
          )}
        </div>

        {/* Main Area */}
        <div className="flex-1 overflow-hidden">
          {view === 'research' ? (
            <div className="h-full flex">
              {/* Left Panel - Findings */}
              <aside
                className={`
                  border-r border-border/50 p-4 bg-sidebar/50 backdrop-blur-sm overflow-hidden
                  transition-all duration-300
                  ${editorExpanded ? 'w-0 p-0 border-0 opacity-0' : 'w-80'}
                  ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                  fixed lg:relative inset-y-0 left-0 z-40 lg:z-auto
                `}
              >
                <FindingsPanel 
                  findings={findings} 
                  onSelectSource={setSelectedSource}
                  selectedSourceId={selectedSource?.id}
                />
              </aside>

              {/* Center - Workspace */}
              <main className={`p-6 overflow-y-auto custom-scrollbar transition-all duration-300 ${
                editorExpanded ? 'w-0 p-0 opacity-0 overflow-hidden' : 'flex-1'
              }`}>
                {selectedSource ? (
                  <div className="h-full max-w-4xl mx-auto">
                    <SourceChat 
                      source={selectedSource} 
                      onClose={() => setSelectedSource(null)} 
                    />
                  </div>
                ) : (
                  <div className="max-w-3xl mx-auto space-y-6">
                    <QueryInput onSubmit={handleSearch} isLoading={isResearching} />
                    
                    {isResearching && (
                      <ResearchPipeline
                        steps={pipelineSteps}
                        currentStep={currentStep}
                        isPaused={isPaused}
                        onPause={() => setIsPaused(true)}
                        onResume={() => setIsPaused(false)}
                        onSkip={() => setCurrentStep((prev) => Math.min(prev + 1, pipelineSteps.length - 1))}
                      />
                    )}

                    {!isResearching && findings.length > 0 && !selectedSource && (
                      <div className="glass-card p-6 text-center">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          Research Complete
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Found {findings.length} relevant findings. Click a source in the left panel to explore it.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </main>

              {/* Right Panel - Report Editor */}
              <aside className={`border-l border-border/50 p-4 bg-sidebar/50 backdrop-blur-sm transition-all duration-300 ${
                editorExpanded ? 'flex-1 w-full' : 'w-96 hidden xl:block'
              }`}>
                <ReportEditor 
                  isExpanded={editorExpanded} 
                  onExpandChange={setEditorExpanded} 
                />
              </aside>
            </div>
          ) : (
            <div className="h-full p-6 overflow-y-auto custom-scrollbar">
              <div className="max-w-6xl mx-auto">
                <DashboardCards sessions={mockSessions} />
              </div>
            </div>
          )}
        </div>

        {/* Footer with Animated Graph */}
        <footer className="h-24 border-t border-border/50 bg-background/80 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-60">
            <FooterGraph />
          </div>
          <div className="relative z-10 h-full flex items-center justify-center">
            <p className="text-xs text-muted-foreground">
              Powered by advanced AI research synthesis • Real-time knowledge graph analysis
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
