
import { Search } from "lucide-react";

interface TagDisplayProps {
  selectedTag: string | null;
  handleClearTag: () => void;
}

export const TagDisplay = ({ 
  selectedTag, 
  handleClearTag 
}: TagDisplayProps) => {
  if (!selectedTag) return null;
  
  return (
    <div className="mb-4 p-3 bg-gradient-to-r from-luxury-primary/10 to-luxury-secondary/10 rounded-lg flex items-center justify-between backdrop-blur-sm border border-luxury-primary/10">
      <div className="flex items-center">
        <Search className="h-4 w-4 text-luxury-primary mr-2" />
        <span className="text-sm text-white">Tag: {selectedTag}</span>
      </div>
      <button
        className="text-xs bg-luxury-dark/60 px-2 py-1 rounded-md text-luxury-neutral hover:text-white hover:bg-luxury-dark/80 transition-colors"
        onClick={handleClearTag}
      >
        Clear
      </button>
    </div>
  );
};
