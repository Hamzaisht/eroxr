
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-4 px-4 py-3 bg-gradient-to-r from-luxury-primary/20 to-luxury-secondary/20 rounded-lg flex items-center justify-between backdrop-blur-sm border border-luxury-primary/30 shadow-md"
    >
      <div className="flex items-center">
        <div className="bg-luxury-primary/30 rounded-full p-1.5 mr-3">
          <Search className="h-3.5 w-3.5 text-luxury-primary" />
        </div>
        <span className="text-sm font-medium text-white">Tag: {selectedTag}</span>
      </div>
      <button
        className="text-xs bg-luxury-dark/60 hover:bg-luxury-dark/80 px-2.5 py-1.5 rounded-md text-luxury-neutral hover:text-white transition-colors flex items-center gap-1 hover:shadow-inner"
        onClick={handleClearTag}
        aria-label="Clear tag filter"
      >
        <X className="h-3.5 w-3.5" />
        Clear
      </button>
    </motion.div>
  );
};
