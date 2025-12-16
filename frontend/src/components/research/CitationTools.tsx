import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

type CitationFormat = 'APA' | 'IEEE' | 'MLA';

interface CitationToolsProps {
  onFormatChange: (format: CitationFormat) => void;
}

export const CitationTools = ({ onFormatChange }: CitationToolsProps) => {
  const [activeFormat, setActiveFormat] = useState<CitationFormat>('APA');
  const [copied, setCopied] = useState(false);

  const formats: CitationFormat[] = ['APA', 'IEEE', 'MLA'];

  const handleFormatChange = (format: CitationFormat) => {
    setActiveFormat(format);
    onFormatChange(format);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground">Citation Format:</span>
      <div className="flex gap-1 bg-secondary/30 rounded-lg p-1">
        {formats.map((format) => (
          <button
            key={format}
            onClick={() => handleFormatChange(format)}
            className={`citation-tab ${activeFormat === format ? 'citation-tab-active' : ''}`}
          >
            {format}
          </button>
        ))}
      </div>
      <button
        onClick={handleCopy}
        className="ml-auto p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
        title="Copy all citations"
      >
        {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};
