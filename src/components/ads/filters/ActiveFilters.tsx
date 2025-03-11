
import { FilterOptions } from "../types/dating";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface ActiveFiltersProps {
  filterOptions: FilterOptions;
  selectedCountry: NordicCountry | null;
  selectedCity: string | null;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  selectedTag: string | null;
  onClearFilter: (filterType: string) => void;
}

export const ActiveFilters = ({ 
  filterOptions,
  selectedCountry,
  selectedCity,
  selectedSeeker,
  selectedLookingFor,
  selectedTag,
  onClearFilter
}: ActiveFiltersProps) => {
  // Check if any filters are active
  const isAnyFilterActive = 
    selectedCountry || 
    selectedCity || 
    selectedSeeker || 
    selectedTag || 
    filterOptions.minAge !== 18 || 
    filterOptions.maxAge !== 99 ||
    filterOptions.maxDistance !== 50 ||
    filterOptions.isVerified ||
    filterOptions.isPremium;
  
  if (!isAnyFilterActive) return null;
  
  const preventFormSubmission = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleFilterClear = (e: React.MouseEvent, filterType: string) => {
    e.preventDefault();
    e.stopPropagation();
    onClearFilter(filterType);
  };
  
  return (
    <div className="p-3 border-b border-luxury-primary/10 bg-luxury-primary/5" onMouseDown={preventFormSubmission}>
      <h4 className="text-xs text-luxury-neutral mb-2">Active Filters</h4>
      <div className="flex flex-wrap gap-2">
        {selectedCountry && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            {selectedCountry}
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'country')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {selectedCity && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            {selectedCity}
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'city')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {(filterOptions.minAge !== 18 || filterOptions.maxAge !== 99) && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            Age: {filterOptions.minAge}-{filterOptions.maxAge}
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'age')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {selectedSeeker && selectedLookingFor && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            {`${selectedSeeker}4${selectedLookingFor}`}
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'seeking')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {selectedTag && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            Tag: {selectedTag}
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'tag')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {filterOptions.maxDistance !== 50 && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            Distance: {filterOptions.maxDistance}km
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'distance')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {filterOptions.isVerified && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            Verified Only
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'verification')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
        
        {filterOptions.isPremium && (
          <Badge 
            variant="secondary" 
            className="px-2 py-1 bg-luxury-primary/10 text-luxury-primary hover:bg-luxury-primary/20 transition-all duration-200"
            onMouseDown={preventFormSubmission}
          >
            Premium Only
            <button 
              type="button"
              className="ml-2 hover:text-red-400 transition-colors" 
              onClick={(e) => handleFilterClear(e, 'premium')}
              onMouseDown={preventFormSubmission}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};
