
import { useEffect } from "react";
import { FilterOptions, SearchCategory } from "./types/dating";
import { SearchCategories } from "./filters/SearchCategories";
import { CountrySelect } from "./CountrySelect";
import { UserSearchFields } from "./filters/UserSearchFields";
import { TagDisplay } from "./filters/TagDisplay";
import { AgeRangeFilter } from "./filters/AgeRangeFilter";
import { DistanceFilter } from "./filters/DistanceFilter";
import { VerificationFilter } from "./filters/VerificationFilter";
import { type Database } from "@/integrations/supabase/types";

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
  setSelectedTag
}: AdFiltersProps) => {
  // Function to handle search tag clear
  const handleClearTag = () => {
    setSelectedTag(null);
  };

  // Reset filters when country changes
  useEffect(() => {
    if (selectedCountry) {
      setFilterOptions({
        ...filterOptions,
        country: selectedCountry
      });
    } else {
      const { country, ...rest } = filterOptions;
      setFilterOptions(rest);
    }
  }, [selectedCountry]);

  return (
    <div className="bg-luxury-dark/50 backdrop-blur-sm p-5 rounded-xl border border-luxury-primary/10">
      <h2 className="text-xl font-semibold mb-4 text-white">Find BD Ads</h2>

      {/* User and Location Search Fields */}
      <UserSearchFields 
        filterOptions={filterOptions} 
        setFilterOptions={setFilterOptions} 
      />

      {/* Selected Tag (if any) */}
      <TagDisplay 
        selectedTag={selectedTag} 
        handleClearTag={handleClearTag} 
      />

      {/* Country Filter */}
      <div className="mb-6">
        <label className="text-sm font-medium text-luxury-neutral mb-2 block">Country</label>
        <CountrySelect
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          countries={countries}
        />
      </div>

      {/* Search Categories */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-luxury-neutral mb-2">Search Categories</h3>
        <SearchCategories
          searchCategories={searchCategories}
          selectedSeeker={selectedSeeker}
          selectedLookingFor={selectedLookingFor}
          setSelectedSeeker={setSelectedSeeker}
          setSelectedLookingFor={setSelectedLookingFor}
        />
      </div>

      {/* Age Range Filter */}
      <AgeRangeFilter 
        filterOptions={filterOptions} 
        setFilterOptions={setFilterOptions} 
      />

      {/* Distance Filter */}
      <DistanceFilter 
        filterOptions={filterOptions} 
        setFilterOptions={setFilterOptions} 
      />

      {/* Verification Filter */}
      <VerificationFilter 
        filterOptions={filterOptions} 
        setFilterOptions={setFilterOptions} 
      />
    </div>
  );
};
