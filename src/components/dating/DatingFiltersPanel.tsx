
import React from "react";
import { DatingFilterSidebar } from "@/components/dating/DatingFilterSidebar";
import { FilterOptions } from "@/components/ads/types/dating";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

interface DatingFiltersPanelProps {
  isFilterCollapsed: boolean;
  setIsFilterCollapsed: (b: boolean) => void;
  showFilters: boolean;
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
  showFilterPanel: boolean;
}

export const DatingFiltersPanel: React.FC<DatingFiltersPanelProps> = ({
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
  setSelectedTag,
}) => (
  <DatingFilterSidebar
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
  />
);
