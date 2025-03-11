
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import React from "react";

interface FilterBadgeProps {
  label: string;
  onClear: (e: React.MouseEvent) => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const FilterBadge = ({ 
  label, 
  onClear,
  onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }
}: FilterBadgeProps) => {
  return (
    <Badge 
      variant="secondary" 
      className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
      onMouseDown={onMouseDown}
    >
      {label}
      <button 
        type="button"
        className="ml-2 hover:text-red-400 transition-colors" 
        onClick={onClear}
        onMouseDown={onMouseDown}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
};
