import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading?: boolean;
}

export const QueryInput = ({ onSubmit, isLoading }: QueryInputProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="glass-card p-1.5 flex items-center gap-2 group focus-within:border-primary/50 transition-all duration-300">
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
          <Search className="w-5 h-5 text-primary" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What would you like to research today?"
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg py-3 pr-4"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium transition-all duration-300 hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed group-focus-within:glow-primary"
        >
          <Sparkles className="w-4 h-4" />
          <span>Research</span>
        </button>
      </div>
    </form>
  );
};
