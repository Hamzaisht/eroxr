
import { Users, MapPin, Tags, Shield, Crown, Ruler, Search } from "lucide-react";
import { FilterOptions, SearchCategory } from "../types/dating";
import { SearchCategories } from "./SearchCategories";
import { UserSearchFields } from "./UserSearchFields";
import { TagDisplay } from "./TagDisplay";
import { AgeRangeFilter } from "./AgeRangeFilter";
import { DistanceFilter } from "./DistanceFilter";
import { VerificationFilter } from "./VerificationFilter";
import { FilterGroup } from "./FilterGroup";
import { type Database } from "@/integrations/supabase/types";
import { LocationSearch } from "../LocationSearch";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface FilterSectionsProps {
  selectedCountry: NordicCountry | null;
  setSelectedCountry: (country: NordicCountry | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
  searchCategories: SearchCategory[];
  filterOptions: FilterOptions;
  setFilterOptions: (options: FilterOptions) => void;
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  preventFormSubmission: (e: React.FormEvent | React.MouseEvent | React.TouchEvent) => false;
  handleClearTag: (e?: React.MouseEvent) => void;
}

export const FilterSections = ({
  selectedCountry,
  setSelectedCountry,
  selectedCity,
  setSelectedCity,
  selectedSeeker,
  selectedLookingFor,
  setSelectedSeeker,
  setSelectedLookingFor,
  searchCategories,
  filterOptions,
  setFilterOptions,
  selectedTag,
  preventFormSubmission,
  handleClearTag,
  setSelectedTag
}: FilterSectionsProps) => {
  const stopPropagation = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="divide-y divide-luxury-primary/10" 
      onClick={stopPropagation}
      onMouseDown={stopPropagation}
      onTouchStart={stopPropagation}
    >
      <FilterGroup title="Search by Keyword or Username" icon={<Search className="h-4 w-4" />} defaultOpen>
        <UserSearchFields
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      </FilterGroup>

      <FilterGroup title="Location" icon={<MapPin className="h-4 w-4" />} defaultOpen>
        <LocationSearch
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          filterByDistance={true}
        />
        <div 
          className="mt-4" 
          onSubmit={preventFormSubmission}
          onClick={preventFormSubmission}
          onMouseDown={preventFormSubmission}
          onTouchStart={preventFormSubmission}
        >
          <DistanceFilter 
            filterOptions={filterOptions} 
            setFilterOptions={setFilterOptions} 
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Search Categories" icon={<Users className="h-4 w-4" />}>
        <SearchCategories
          searchCategories={searchCategories}
          selectedSeeker={selectedSeeker}
          selectedLookingFor={selectedLookingFor}
          setSelectedSeeker={setSelectedSeeker}
          setSelectedLookingFor={setSelectedLookingFor}
        />
      </FilterGroup>

      <FilterGroup title="Age Range" icon={<Ruler className="h-4 w-4" />}>
        <div 
          onSubmit={preventFormSubmission}
          onClick={preventFormSubmission}
          onMouseDown={preventFormSubmission}
          onTouchStart={preventFormSubmission}
        >
          <AgeRangeFilter 
            filterOptions={filterOptions} 
            setFilterOptions={setFilterOptions} 
          />
        </div>
      </FilterGroup>

      <FilterGroup title="Verification" icon={<Shield className="h-4 w-4" />}>
        <div 
          onSubmit={preventFormSubmission}
          onClick={preventFormSubmission}
          onMouseDown={preventFormSubmission}
          onTouchStart={preventFormSubmission}
        >
          <VerificationFilter 
            filterOptions={filterOptions} 
            setFilterOptions={setFilterOptions} 
          />
        </div>
      </FilterGroup>

      {selectedTag && (
        <FilterGroup title="Active Tag" icon={<Tags className="h-4 w-4" />}>
          <TagDisplay 
            selectedTag={selectedTag} 
            handleClearTag={handleClearTag} 
          />
        </FilterGroup>
      )}
    </div>
  );
};
