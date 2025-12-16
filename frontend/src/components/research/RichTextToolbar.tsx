import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Table2, 
  Quote, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Code,
  Strikethrough,
  Undo,
  Redo
} from 'lucide-react';

interface RichTextToolbarProps {
  onCommand: (command: string, value?: string) => void;
  onImageUpload: () => void;
}

export const RichTextToolbar = ({ onCommand, onImageUpload }: RichTextToolbarProps) => {
  const toolbarGroups = [
    {
      items: [
        { icon: Undo, command: 'undo', label: 'Undo' },
        { icon: Redo, command: 'redo', label: 'Redo' },
      ]
    },
    {
      items: [
        { icon: Heading1, command: 'formatBlock', value: 'h1', label: 'Heading 1' },
        { icon: Heading2, command: 'formatBlock', value: 'h2', label: 'Heading 2' },
      ]
    },
    {
      items: [
        { icon: Bold, command: 'bold', label: 'Bold (Ctrl+B)' },
        { icon: Italic, command: 'italic', label: 'Italic (Ctrl+I)' },
        { icon: Underline, command: 'underline', label: 'Underline (Ctrl+U)' },
        { icon: Strikethrough, command: 'strikeThrough', label: 'Strikethrough' },
      ]
    },
    {
      items: [
        { icon: List, command: 'insertUnorderedList', label: 'Bullet List' },
        { icon: ListOrdered, command: 'insertOrderedList', label: 'Numbered List' },
      ]
    },
    {
      items: [
        { icon: AlignLeft, command: 'justifyLeft', label: 'Align Left' },
        { icon: AlignCenter, command: 'justifyCenter', label: 'Align Center' },
        { icon: AlignRight, command: 'justifyRight', label: 'Align Right' },
      ]
    },
    {
      items: [
        { icon: Link, command: 'createLink', label: 'Insert Link' },
        { icon: Image, command: 'insertImage', label: 'Insert Image' },
        { icon: Quote, command: 'formatBlock', value: 'blockquote', label: 'Quote' },
        { icon: Code, command: 'formatBlock', value: 'pre', label: 'Code Block' },
        { icon: Table2, command: 'insertTable', label: 'Insert Table' },
      ]
    },
  ];

  const handleCommand = (command: string, value?: string) => {
    if (command === 'insertImage') {
      onImageUpload();
    } else if (command === 'createLink') {
      const url = prompt('Enter URL:');
      if (url) {
        onCommand(command, url);
      }
    } else {
      onCommand(command, value);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-secondary/30 rounded-lg border border-border/30">
      {toolbarGroups.map((group, groupIndex) => (
        <div key={groupIndex} className="flex items-center gap-0.5">
          {group.items.map((item, itemIndex) => (
            <button
              key={itemIndex}
              onClick={() => handleCommand(item.command, item.value)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title={item.label}
              type="button"
            >
              <item.icon className="w-4 h-4" />
            </button>
          ))}
          {groupIndex < toolbarGroups.length - 1 && (
            <div className="w-px h-6 bg-border/50 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
};
