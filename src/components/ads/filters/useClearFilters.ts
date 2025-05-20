
import { FilterOptions } from "@/types/dating";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface UseClearFiltersProps {
  setSelectedCountry: (country: NordicCountry | null) => void;
  setSelectedCity: (city: string | null) => void;
  setFilterOptions: (options: FilterOptions) => void;
  filterOptions: FilterOptions;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  setSelectedTag: (tag: string | null) => void;
}

export const useClearFilters = ({
  setSelectedCountry,
  setSelectedCity,
  setFilterOptions,
  filterOptions,
  setSelectedSeeker,
  setSelectedLookingFor,
  setSelectedTag
}: UseClearFiltersProps) => {
  
  const handleClearFilter = (e: React.MouseEvent | null, filterType: string) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    switch (filterType) {
      case 'country':
        setSelectedCountry(null);
        setSelectedCity(null);
        break;
      case 'city':
        setSelectedCity(null);
        break;
      case 'distance':
        setFilterOptions({ ...filterOptions, maxDistance: 50 });
        break;
      case 'seeking':
        setSelectedSeeker(null);
        setSelectedLookingFor(null);
        break;
      case 'tag':
        setSelectedTag(null);
        break;
      case 'age':
        setFilterOptions({ ...filterOptions, minAge: 18, maxAge: 99 });
        break;
      case 'verification':
        setFilterOptions({ ...filterOptions, isVerified: false });
        break;
      case 'premium':
        setFilterOptions({ ...filterOptions, isPremium: false });
        break;
    }
  };

  return { handleClearFilter };
};
