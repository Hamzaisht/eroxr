
import { useEffect } from "react";
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

  return (
    <div className="bg-luxury-dark/50 backdrop-blur-sm rounded-xl border border-luxury-primary/10 overflow-hidden">
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

      <div className="divide-y divide-luxury-primary/10">
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
          <div className="mt-4">
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
          <AgeRangeFilter 
            filterOptions={filterOptions} 
            setFilterOptions={setFilterOptions} 
          />
        </FilterGroup>

        <FilterGroup title="Verification" icon={<Shield className="h-4 w-4" />}>
          <VerificationFilter 
            filterOptions={filterOptions} 
            setFilterOptions={setFilterOptions} 
          />
        </FilterGroup>

        {selectedTag && (
          <FilterGroup title="Active Tag" icon={<Tags className="h-4 w-4" />}>
            <TagDisplay 
              selectedTag={selectedTag} 
              handleClearTag={(e) => {
                if (e) e.preventDefault();
                setSelectedTag(null);
              }} 
            />
          </FilterGroup>
        )}
      </div>
    </div>
  );
};
