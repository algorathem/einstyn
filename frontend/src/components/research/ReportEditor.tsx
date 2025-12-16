import { useState, useRef, useCallback } from 'react';
import { FileText, Download, Save, Maximize2, Minimize2, Sun, Moon } from 'lucide-react';
import { CitationTools } from './CitationTools';
import { AIFeedbackPanel } from './AIFeedbackPanel';
import { RichTextToolbar } from './RichTextToolbar';

interface ReportEditorProps {
  isExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export const ReportEditor = ({ isExpanded = false, onExpandChange }: ReportEditorProps) => {
  const [citationFormat, setCitationFormat] = useState('APA');
  const [content, setContent] = useState('');
  const [lightMode, setLightMode] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleImageUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = event.target?.result as string;
        document.execCommand('insertImage', false, img);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          execCommand('bold');
          break;
        case 'i':
          e.preventDefault();
          execCommand('italic');
          break;
        case 'u':
          e.preventDefault();
          execCommand('underline');
          break;
      }
    }
  }, [execCommand]);

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  const toggleExpand = () => onExpandChange?.(!isExpanded);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-foreground">Report Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLightMode(!lightMode)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
            title={lightMode ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {lightMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>
          <button 
            onClick={toggleExpand}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isExpanded ? 'Dock' : 'Expand'}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/20 hover:bg-primary/30 text-sm text-primary transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Citation Tools */}
      <div className="mb-4">
        <CitationTools onFormatChange={(f) => setCitationFormat(f)} />
      </div>

      {/* Rich Text Toolbar */}
      <div className="mb-4">
        <RichTextToolbar onCommand={execCommand} onImageUpload={handleImageUpload} />
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Editor Area */}
      <div className={`flex-1 overflow-hidden flex flex-col mb-4 rounded-xl border transition-colors ${
        lightMode 
          ? 'bg-white border-gray-200' 
          : 'glass-card'
      }`}>
        <div
          ref={editorRef}
          contentEditable
          onInput={handleContentChange}
          onKeyDown={handleKeyDown}
          className={`flex-1 p-6 outline-none overflow-y-auto custom-scrollbar text-sm leading-relaxed prose max-w-none transition-colors
            ${lightMode 
              ? 'bg-white text-gray-900 [&_h1]:text-gray-900 [&_h2]:text-gray-900 [&_blockquote]:text-gray-600 [&_pre]:bg-gray-100' 
              : 'bg-transparent text-foreground prose-invert [&_h1]:text-foreground [&_h2]:text-foreground [&_blockquote]:text-muted-foreground [&_pre]:bg-secondary/50'
            }
            [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
            [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3
            [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4
            [&_ol]:list-decimal [&_ol]:ml-6 [&_ol]:mb-4
            [&_li]:mb-1
            [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
            [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
            [&_a]:text-primary [&_a]:underline [&_a]:hover:text-primary/80
            [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-4
            [&_table]:w-full [&_table]:border-collapse [&_table]:my-4
            [&_td]:border [&_td]:border-border/50 [&_td]:p-2
            [&_th]:border [&_th]:border-border/50 [&_th]:p-2 [&_th]:bg-secondary/30`}
          data-placeholder="Start writing your research report...

Use the toolbar above to format text, insert images, tables, and citations. 
Your findings from the left panel can be dragged directly into this editor.

Keyboard shortcuts:
• Ctrl+B for bold
• Ctrl+I for italic  
• Ctrl+U for underline

The AI will provide real-time feedback on your writing structure."
          suppressContentEditableWarning
        />
        <style>{`
          [data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: hsl(var(--muted-foreground) / 0.5);
            pointer-events: none;
            white-space: pre-wrap;
          }
        `}</style>
      </div>

      {/* AI Feedback */}
      <AIFeedbackPanel
        feedback={
          content.length > 50
            ? "Your introduction sets up the topic well. Consider adding more specific evidence from your findings to support the main argument. The flow between paragraphs could be improved with transitional phrases."
            : null
        }
        onRegenerate={() => {}}
      />
    </div>
  );
};
