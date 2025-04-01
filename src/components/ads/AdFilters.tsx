
import { Users, MapPin, Tags, Shield, Crown, Ruler, Search } from "lucide-react";
import { FilterOptions, SearchCategory } from "./types/dating";
import { SearchCategories } from "./filters/SearchCategories";
import { UserSearchFields } from "./filters/UserSearchFields";
import { TagDisplay } from "./filters/TagDisplay";
import { AgeRangeFilter } from "./filters/AgeRangeFilter";
import { DistanceFilter } from "./filters/DistanceFilter";
import { VerificationFilter } from "./filters/VerificationFilter";
import { ActiveFilters } from "./filters/ActiveFilters";
import { FilterGroup } from "./filters/FilterGroup";
import { type Database } from "@/integrations/supabase/types";
import { LocationSearch } from "./LocationSearch";
import { useClearFilters } from "./filters/useClearFilters";
import { usePreventFormSubmission } from "@/hooks/use-prevent-form-submission";
import { FilterSections } from "./filters/FilterSections";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface AdFiltersProps {
  selectedCountry: NordicCountry | null;
  setSelectedCountry: (country: NordicCountry | null) => void;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  searchCategories: SearchCategory[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  countries: NordicCountry[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
}

export const AdFilters = ({
  selectedCountry,
  setSelectedCountry,
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
  filterOptions,
  setFilterOptions,
  countries,
  selectedTag,
  setSelectedTag,
  selectedCity,
  setSelectedCity
}: AdFiltersProps) => {
  const { handleClearFilter } = useClearFilters({
    setSelectedCountry,
    setSelectedCity,
    setFilterOptions,
    filterOptions,
    setSelectedSeeker,
    setSelectedLookingFor,
    setSelectedTag
  });

  const { preventFormSubmission } = usePreventFormSubmission();

  return (
    <div 
      className="bg-luxury-dark/50 backdrop-blur-sm rounded-xl border border-luxury-primary/10 overflow-hidden"
      onClick={preventFormSubmission}
      onMouseDown={preventFormSubmission}
      onTouchStart={preventFormSubmission}
      onSubmit={preventFormSubmission}
    >
      <div className="p-4 border-b border-luxury-primary/10">
        <h2 className="text-xl font-semibold text-white">Find BD Ads</h2>
      </div>

      <ActiveFilters
        filterOptions={filterOptions}
        selectedCountry={selectedCountry}
        selectedCity={selectedCity}
        selectedSeeker={selectedSeeker}
        selectedLookingFor={selectedLookingFor}
        selectedTag={selectedTag}
        onClearFilter={(filterType) => handleClearFilter(null, filterType)}
      />

      <FilterSections 
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedSeeker={selectedSeeker}
        selectedLookingFor={selectedLookingFor}
        setSelectedSeeker={setSelectedSeeker}
        setSelectedLookingFor={setSelectedLookingFor}
        searchCategories={searchCategories}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        preventFormSubmission={preventFormSubmission}
        handleClearTag={(e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          setSelectedTag(null);
        }}
      />
    </div>
  );
};
