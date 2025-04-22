
import React from "react";
import { DatingFiltersPanel } from "@/components/dating/DatingFiltersPanel";
import { DatingResults } from "@/components/dating/DatingResults";
import { DatingAd, FilterOptions } from "@/components/ads/types/dating";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface DatingMainContentProps {
  isFilterCollapsed: boolean;
  setIsFilterCollapsed: (b: boolean) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedCountry: NordicCountry | null;
  setSelectedCountry: (c: NordicCountry | null) => void;
  selectedCity: string | null;
  setSelectedCity: (city: string | null) => void;
  selectedSeeker: string | null;
  selectedLookingFor: string | null;
  setSelectedSeeker: (v: string | null) => void;
  setSelectedLookingFor: (v: string | null) => void;
  filterOptions: FilterOptions;
  setFilterOptions: (o: FilterOptions) => void;
  defaultSearchCategories: any[];
  nordicCountries: NordicCountry[];
  selectedTag: string | null;
  setSelectedTag: (tag: string | null) => void;
  datingAds: DatingAd[] | undefined;
  isLoading: boolean;
  activeTab: string;
  userProfile: DatingAd | null;
  handleAdCreationSuccess: () => void;
  handleTagClick: (tag: string) => void;
  handleTabChange: (tab: string) => void;
  handleFilterToggle: () => void;
}

export const DatingMainContent: React.FC<DatingMainContentProps> = ({
  isFilterCollapsed,
  setIsFilterCollapsed,
  showFilters,
  setShowFilters,
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
  setSelectedTag,
  datingAds,
  isLoading,
  activeTab,
  userProfile,
  handleAdCreationSuccess,
  handleTagClick,
  handleTabChange,
  handleFilterToggle
}) => (
  <div className="mt-6 flex flex-col lg:flex-row gap-6">
    <DatingFiltersPanel
      isFilterCollapsed={isFilterCollapsed}
      setIsFilterCollapsed={setIsFilterCollapsed}
      showFilters={showFilters}
      selectedCountry={selectedCountry}
      setSelectedCountry={setSelectedCountry}
      selectedCity={selectedCity}
      setSelectedCity={setSelectedCity}
      selectedSeeker={selectedSeeker}
      selectedLookingFor={selectedLookingFor}
      setSelectedSeeker={setSelectedSeeker}
      setSelectedLookingFor={setSelectedLookingFor}
      filterOptions={filterOptions}
      setFilterOptions={setFilterOptions}
      defaultSearchCategories={defaultSearchCategories}
      nordicCountries={nordicCountries}
      selectedTag={selectedTag}
      setSelectedTag={setSelectedTag}
      showFilterPanel={showFilters}
    />

    <div className="flex-1">
      <DatingResults
        datingAds={datingAds}
        isLoading={isLoading}
        activeTab={activeTab}
        userProfile={userProfile}
        handleAdCreationSuccess={handleAdCreationSuccess}
        handleTagClick={handleTagClick}
        handleTabChange={handleTabChange}
        handleFilterToggle={handleFilterToggle}
      />
    </div>
  </div>
);
