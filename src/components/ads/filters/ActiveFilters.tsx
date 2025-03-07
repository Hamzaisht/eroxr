
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FilterOptions } from "../types/dating";

interface ActiveFiltersProps {
  filterOptions: FilterOptions;
  selectedCountry: string | null;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  selectedTag: string | null;
  onClearFilter: (filterType: string) => void;
}

export const ActiveFilters = ({
  filterOptions,
  selectedCountry,
  selectedSeeker,
  selectedLookingFor,
  selectedTag,
  onClearFilter
}: ActiveFiltersProps) => {
  const activeFilters = [];

  if (selectedCountry) {
    activeFilters.push({
      type: 'country',
      label: `Location: ${selectedCountry}`
    });
  }

  if (selectedSeeker && selectedLookingFor) {
    activeFilters.push({
      type: 'seeking',
      label: `${selectedSeeker} seeking ${selectedLookingFor}`
    });
  }

  if (selectedTag) {
    activeFilters.push({
      type: 'tag',
      label: `Tag: ${selectedTag}`
    });
  }

  if (filterOptions.minAge && filterOptions.maxAge) {
    activeFilters.push({
      type: 'age',
      label: `Age: ${filterOptions.minAge}-${filterOptions.maxAge}`
    });
  }

  if (filterOptions.maxDistance) {
    activeFilters.push({
      type: 'distance',
      label: `Distance: ${filterOptions.maxDistance}km`
    });
  }

  if (activeFilters.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mb-4 p-3 bg-luxury-dark/30 backdrop-blur-sm rounded-lg border border-luxury-primary/10"
    >
      {activeFilters.map(({ type, label }) => (
        <Badge
          key={type}
          variant="outline"
          className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-neutral pl-3 pr-2 py-1.5 flex items-center gap-1"
        >
          {label}
          <button
            onClick={() => onClearFilter(type)}
            className="ml-1 hover:text-white transition-colors"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}
    </motion.div>
  );
};
