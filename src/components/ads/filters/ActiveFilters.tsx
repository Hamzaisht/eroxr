
import { FilterOptions } from "@/types/dating";
import { type Database } from "@/integrations/supabase/types";
import { FilterBadge } from "./FilterBadge";

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
    (filterOptions.minAge !== undefined && filterOptions.minAge !== 18) || 
    (filterOptions.maxAge !== undefined && filterOptions.maxAge !== 99) ||
    (filterOptions.maxDistance !== undefined && filterOptions.maxDistance !== 50) ||
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
        {/* Country filter */}
        {selectedCountry && (
          <FilterBadge 
            label={selectedCountry}
            onClear={(e) => handleFilterClear(e, 'country')}
          />
        )}
        
        {/* City filter */}
        {selectedCity && (
          <FilterBadge 
            label={selectedCity}
            onClear={(e) => handleFilterClear(e, 'city')}
          />
        )}
        
        {/* Age range filter */}
        {((filterOptions.minAge !== undefined && filterOptions.minAge !== 18) || 
          (filterOptions.maxAge !== undefined && filterOptions.maxAge !== 99)) && (
          <FilterBadge 
            label={`Age: ${filterOptions.minAge || 18}-${filterOptions.maxAge || 99}`}
            onClear={(e) => handleFilterClear(e, 'age')}
          />
        )}
        
        {/* Seeking filter */}
        {selectedSeeker && selectedLookingFor && (
          <FilterBadge 
            label={`${selectedSeeker}4${selectedLookingFor}`}
            onClear={(e) => handleFilterClear(e, 'seeking')}
          />
        )}
        
        {/* Tag filter */}
        {selectedTag && (
          <FilterBadge 
            label={`Tag: ${selectedTag}`}
            onClear={(e) => handleFilterClear(e, 'tag')}
          />
        )}
        
        {/* Distance filter */}
        {filterOptions.maxDistance !== undefined && filterOptions.maxDistance !== 50 && (
          <FilterBadge 
            label={`Distance: ${filterOptions.maxDistance}km`}
            onClear={(e) => handleFilterClear(e, 'distance')}
          />
        )}
        
        {/* Verification filter */}
        {filterOptions.isVerified && (
          <FilterBadge 
            label="Verified Only"
            onClear={(e) => handleFilterClear(e, 'verification')}
          />
        )}
        
        {/* Premium filter */}
        {filterOptions.isPremium && (
          <FilterBadge 
            label="Premium Only"
            onClear={(e) => handleFilterClear(e, 'premium')}
          />
        )}
      </div>
    </div>
  );
};
