
import { type Database } from "@/integrations/supabase/types";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdFilters } from "@/components/ads/AdFilters";
import { FilterOptions } from "@/components/ads/types/dating";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface DatingFilterSidebarProps {
  isFilterCollapsed: boolean;
  setIsFilterCollapsed: (collapsed: boolean) => void;
  showFilters: boolean;
  selectedCountry: NordicCountry | null;
  setSelectedCountry: (country: NordicCountry | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  defaultSearchCategories: any[];
  nordicCountries: NordicCountry[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
}

export const DatingFilterSidebar = ({
  isFilterCollapsed,
  setIsFilterCollapsed,
  showFilters,
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  filterOptions,
  setFilterOptions,
  defaultSearchCategories,
  nordicCountries,
  selectedTag,
  setSelectedTag
}: DatingFilterSidebarProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        width: isFilterCollapsed ? '40px' : '320px',
      }}
      transition={{ duration: 0.3 }}
      className={`
        ${isFilterCollapsed ? 'w-10' : 'w-full lg:w-80'} 
        flex-shrink-0 relative
        ${!showFilters && 'hidden lg:block'}
      `}
    >
      <button
        onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
        className="hidden lg:flex absolute -right-4 top-20 z-10 w-8 h-16 bg-luxury-dark/80 border border-luxury-primary/30 rounded-r-lg items-center justify-center text-luxury-primary hover:bg-luxury-dark transition-colors"
      >
        {isFilterCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
      
      <div className={`${isFilterCollapsed ? 'invisible opacity-0' : 'visible opacity-100'} transition-opacity duration-300`}>
        <AdFilters
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedSeeker={selectedSeeker}
          selectedLookingFor={selectedLookingFor}
          setSelectedSeeker={setSelectedSeeker}
          setSelectedLookingFor={setSelectedLookingFor}
          searchCategories={defaultSearchCategories}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          countries={nordicCountries as NordicCountry[]}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
        />
      </div>
    </motion.div>
  );
};
