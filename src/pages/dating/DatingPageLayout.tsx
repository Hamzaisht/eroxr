
import { useState } from "react";
import DatingMainContent from "../DatingMainContent";
import { DatingFiltersPanelProps } from "../DatingMainContent";
import { DatingAd, FilterOptions } from "@/types/dating";
import { Dispatch, SetStateAction } from "react";
import { NavigateFunction } from "react-router-dom";

// Create a proper type for the component props
interface DatingPageLayoutProps extends Partial<DatingFiltersPanelProps> {
  datingAds?: DatingAd[];
  isLoading?: boolean;
  userProfile?: DatingAd | null;
  filterOptions?: FilterOptions;
  setFilterOptions?: Dispatch<SetStateAction<FilterOptions>>;
  selectedCountry?: any;
  setSelectedCountry?: (country: any) => void;
  selectedCity?: string | null;
  setSelectedCity?: (city: string | null) => void;
  selectedSeeker?: string | null;
  setSelectedSeeker?: (seeker: string | null) => void;
  selectedLookingFor?: string[] | null;
  setSelectedLookingFor?: (lookingFor: string[] | null) => void;
  selectedTag?: string | null;
  setSelectedTag?: (tag: string | null) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  handleAdCreationSuccess?: () => void;
  handleTagClick?: (tag: string) => void;
  handleResetFilters?: () => void;
  handleFilterToggle?: () => void;
  defaultSearchCategories?: any[];
  nordicCountries?: any[];
  headerRef?: any;
  navigate?: NavigateFunction;
  showFilters?: boolean;
  setShowFilters?: (show: boolean) => void;
}

export const DatingPageLayout = (props: DatingPageLayoutProps) => {
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<"denmark" | "finland" | "iceland" | "norway" | "sweden">("denmark");
  const [selectedGender, setSelectedGender] = useState("");
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>([]);
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);

  const handleApplyFilters = () => {
    setIsFilterApplied(!isFilterApplied);
    setIsFilterCollapsed(true);
  };

  const handleResetFilters = () => {
    setSelectedGender("");
    setMinAge(18);
    setMaxAge(60);
    setSelectedTags([]);
    setSelectedLookingFor([]);
    setIsFilterApplied(false);
    setIsFilterCollapsed(true);
    setSelectedCity(undefined);
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  // Combine props with local state for complete data passing
  const combinedProps = {
    ...props,
    isFilterCollapsed,
    setIsFilterCollapsed,
    showFilters: props.showFilters !== undefined ? props.showFilters : showFilters,
    setShowFilters: props.setShowFilters || setShowFilters,
    selectedGender,
    setSelectedGender,
    minAge,
    setMinAge,
    maxAge, 
    setMaxAge,
    selectedTags,
    setSelectedTags,
    selectedLookingFor: props.selectedLookingFor || selectedLookingFor,
    setSelectedLookingFor: props.setSelectedLookingFor || setSelectedLookingFor,
    isFilterApplied,
    handleApplyFilters,
    handleResetFilters: props.handleResetFilters || handleResetFilters,
    handleFilterToggle: props.handleFilterToggle || handleFilterToggle,
    selectedCity: props.selectedCity || selectedCity,
    setSelectedCity: props.setSelectedCity || setSelectedCity
  };

  return (
    <DatingMainContent {...combinedProps} />
  );
};

export default DatingPageLayout;
