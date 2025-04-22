
import { LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ViewModeToggleProps {
  viewMode: 'grid' | 'list';
  setViewMode: (mode: 'grid' | 'list') => void;
  size?: 'sm' | 'md' | 'lg';
}

export const ViewModeToggle = ({ 
  viewMode, 
  setViewMode,
  size = 'md'
}: ViewModeToggleProps) => {
  const sizeClasses = {
    sm: "h-8 gap-1",
    md: "h-10 gap-2",
    lg: "h-12 gap-3"
  };
  
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  };
  
  return (
    <div 
      className={cn(
        "flex items-center bg-luxury-dark/50 backdrop-blur-sm rounded-lg border border-luxury-primary/10",
        sizeClasses[size]
      )}
    >
      <button
        onClick={() => setViewMode('grid')}
        className={cn(
          "flex items-center justify-center px-3 h-full rounded-l-lg transition-colors",
          viewMode === 'grid' ? 'text-luxury-primary bg-luxury-primary/10' : 'text-luxury-neutral hover:text-white'
        )}
        aria-label="Grid view"
      >
        <LayoutGrid size={iconSizes[size]} />
      </button>
      <button
        onClick={() => setViewMode('list')}
        className={cn(
          "flex items-center justify-center px-3 h-full rounded-r-lg transition-colors",
          viewMode === 'list' ? 'text-luxury-primary bg-luxury-primary/10' : 'text-luxury-neutral hover:text-white'
        )}
        aria-label="List view"
      >
        <List size={iconSizes[size]} />
      </button>
      
      <motion.div
        className="absolute h-full w-1/2 bg-luxury-primary/5 rounded-lg"
        animate={{
          x: viewMode === 'grid' ? 0 : '100%',
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      />
    </div>
  );
};
