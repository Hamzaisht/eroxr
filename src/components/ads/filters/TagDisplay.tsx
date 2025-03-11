
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagDisplayProps {
  selectedTag: string;
  handleClearTag: (e?: React.MouseEvent) => void;
}

export const TagDisplay = ({ 
  selectedTag, 
  handleClearTag 
}: TagDisplayProps) => {
  const preventFormSubmission = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  return (
    <div className="mt-2">
      <Badge 
        variant="outline" 
        className="gap-1 px-2 py-1 border-luxury-primary/20 bg-luxury-primary/10 text-luxury-primary
          hover:bg-luxury-primary/20 transition-all"
        onMouseDown={preventFormSubmission}
      >
        {selectedTag}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleClearTag(e);
          }}
          onMouseDown={preventFormSubmission}
          className="hover:text-red-400 transition-colors"
        >
          <X className="h-3 w-3" />
        </button>
      </Badge>
    </div>
  );
};
