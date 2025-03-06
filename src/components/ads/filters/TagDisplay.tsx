
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
    <div className="mb-4 p-2 bg-luxury-primary/10 rounded-md flex items-center justify-between">
      <div className="flex items-center">
        <Search className="h-4 w-4 text-luxury-primary mr-2" />
        <span className="text-sm text-white">Tag: {selectedTag}</span>
      </div>
      <button
        className="text-xs text-luxury-neutral hover:text-white"
        onClick={handleClearTag}
      >
        Clear
      </button>
    </div>
  );
};
