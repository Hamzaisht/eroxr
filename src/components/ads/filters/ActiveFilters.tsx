
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { FilterOptions } from "../types/dating";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface ActiveFiltersProps {
  filterOptions: FilterOptions;
  selectedCountry: NordicCountry | null;
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

  if (filterOptions.maxDistance && filterOptions.maxDistance !== 50) {
    activeFilters.push({
      type: 'distance',
      label: `Distance: ${filterOptions.maxDistance}km`
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

  if (filterOptions.minAge !== 18 || filterOptions.maxAge !== 99) {
    activeFilters.push({
      type: 'age',
      label: `Age: ${filterOptions.minAge}-${filterOptions.maxAge}`
    });
  }

  if (filterOptions.isVerified) {
    activeFilters.push({
      type: 'verification',
      label: `Verified only`
    });
  }

  if (filterOptions.isPremium) {
    activeFilters.push({
      type: 'premium',
      label: `Premium only`
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
            aria-label={`Remove ${label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {activeFilters.length > 1 && (
        <Badge
          variant="outline"
          className="bg-luxury-dark/50 border-luxury-primary/20 text-luxury-neutral pl-3 pr-2 py-1.5 flex items-center gap-1 cursor-pointer hover:bg-luxury-dark/80"
          onClick={() => activeFilters.forEach(filter => onClearFilter(filter.type))}
        >
          Clear all
          <X className="h-3 w-3 ml-1" />
        </Badge>
      )}
    </motion.div>
  );
};
