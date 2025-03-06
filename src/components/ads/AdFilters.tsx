
import { useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { FilterOptions, SearchCategory } from "./types/dating";
import { FilterAccordion } from "./filters/FilterAccordion";
import { SearchCategories } from "./filters/SearchCategories";
import { CountrySelect } from "./CountrySelect";
import { Input } from "@/components/ui/input";
import { Search, MapPin, User } from "lucide-react";
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

  // Handle username search
  const handleUsernameSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterOptions({
      ...filterOptions,
      username: value.length > 0 ? value : undefined
    });
  };

  // Handle city search
  const handleCitySearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterOptions({
      ...filterOptions,
      city: value.length > 0 ? value : undefined
    });
  };

  // Update age range when min or max age changes
  const handleAgeRangeChange = (values: number[]) => {
    if (values.length === 2) {
      setFilterOptions({
        ...filterOptions,
        minAge: values[0],
        maxAge: values[1]
      });
    }
  };

  // Update distance when max distance changes
  const handleDistanceChange = (values: number[]) => {
    if (values.length === 1) {
      setFilterOptions({
        ...filterOptions,
        maxDistance: values[0]
      });
    }
  };

  // Update verification filter
  const handleVerifiedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({
      ...filterOptions,
      isVerified: e.target.checked
    });
  };

  // Update premium filter
  const handlePremiumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions({
      ...filterOptions,
      isPremium: e.target.checked
    });
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

      {/* Username Search */}
      <div className="mb-6">
        <label className="text-sm font-medium text-luxury-neutral mb-2 block">Search by Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-neutral h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter username..."
            className="pl-9 bg-luxury-darker border-luxury-primary/20 text-white"
            onChange={handleUsernameSearch}
          />
        </div>
      </div>

      {/* Location Search */}
      <div className="mb-6">
        <label className="text-sm font-medium text-luxury-neutral mb-2 block">Search by Location</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-luxury-neutral h-4 w-4" />
          <Input
            type="text"
            placeholder="Enter city..."
            className="pl-9 bg-luxury-darker border-luxury-primary/20 text-white"
            onChange={handleCitySearch}
          />
        </div>
      </div>

      {/* Selected Tag (if any) */}
      {selectedTag && (
        <div className="mb-4 p-2 bg-luxury-primary/10 rounded-md flex items-center justify-between">
          <div className="flex items-center">
            <Search className="h-4 w-4 text-luxury-primary mr-2" />
            <span className="text-sm text-white">Tag: {selectedTag}</span>
          </div>
          <button
            className="text-xs text-luxury-neutral hover:text-white"
            onClick={handleClearTag}
          >
            Clear
          </button>
        </div>
      )}

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
      <FilterAccordion title="Age Range" defaultOpen={true}>
        <div className="mt-2 px-1">
          <div className="flex justify-between text-sm text-luxury-neutral mb-2">
            <span>{filterOptions.minAge} years</span>
            <span>{filterOptions.maxAge} years</span>
          </div>
          <Slider
            defaultValue={[filterOptions.minAge || 18, filterOptions.maxAge || 99]}
            max={99}
            min={18}
            step={1}
            onValueChange={handleAgeRangeChange}
          />
        </div>
      </FilterAccordion>

      {/* Distance Filter */}
      <FilterAccordion title="Maximum Distance" defaultOpen={true}>
        <div className="mt-2 px-1">
          <div className="flex justify-between text-sm text-luxury-neutral mb-2">
            <span>Distance</span>
            <span>{filterOptions.maxDistance} km</span>
          </div>
          <Slider
            defaultValue={[filterOptions.maxDistance || 50]}
            max={500}
            min={5}
            step={5}
            onValueChange={handleDistanceChange}
          />
        </div>
      </FilterAccordion>

      {/* Verification */}
      <FilterAccordion title="Verification" defaultOpen={true}>
        <div className="space-y-2 mt-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="verified-only"
              className="rounded h-4 w-4 bg-luxury-darker border-luxury-primary/20 text-luxury-primary"
              checked={!!filterOptions.isVerified}
              onChange={handleVerifiedChange}
            />
            <label
              htmlFor="verified-only"
              className="ml-2 text-sm text-luxury-neutral"
            >
              Verified Profiles Only
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="premium-only"
              className="rounded h-4 w-4 bg-luxury-darker border-luxury-primary/20 text-luxury-primary"
              checked={!!filterOptions.isPremium}
              onChange={handlePremiumChange}
            />
            <label
              htmlFor="premium-only"
              className="ml-2 text-sm text-luxury-neutral"
            >
              Premium Profiles Only
            </label>
          </div>
        </div>
      </FilterAccordion>
    </div>
  );
};
