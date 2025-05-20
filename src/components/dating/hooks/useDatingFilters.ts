import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { getActiveAdsWithLocation } from "@/utils/supabase/typeSafeOperations";

export interface DatingFiltersState {
  isFilterCollapsed: boolean;
  showFilters: boolean;
  selectedCountry: "denmark" | "finland" | "iceland" | "norway" | "sweden";
  selectedGender: string;
  minAge: number;
  maxAge: number;
  selectedTag: string | null;
  selectedLookingFor: string[];
  isFilterApplied: boolean;
  selectedCity?: string;
  selectedVerified: boolean;
  selectedPremium: boolean;
  distanceRange: [number, number];
}

export function useDatingFilters(initialState?: Partial<DatingFiltersState>) {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    minAge: 18,
    maxAge: 65,
    distance: 100,
    verifiedOnly: false,
    city: '',
    country: 'sweden',
    lookingFor: [],
    relationshipStatus: [],
    bodyType: [],
  });

  const [isFilterCollapsed, setIsFilterCollapsed] = useState(initialState?.isFilterCollapsed || true);
  const [showFilters, setShowFilters] = useState(initialState?.showFilters || false);
  const [selectedCountry, setSelectedCountry] = useState<"denmark" | "finland" | "iceland" | "norway" | "sweden">(
    initialState?.selectedCountry || "denmark"
  );
  const [selectedGender, setSelectedGender] = useState(initialState?.selectedGender || "");
  const [minAge, setMinAge] = useState(initialState?.minAge || 18);
  const [maxAge, setMaxAge] = useState(initialState?.maxAge || 60);
  const [selectedTag, setSelectedTag] = useState<string | null>(initialState?.selectedTag || null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string[]>(initialState?.selectedLookingFor || []);
  const [isFilterApplied, setIsFilterApplied] = useState(initialState?.isFilterApplied || false);
  const [selectedCity, setSelectedCity] = useState<string | undefined>(initialState?.selectedCity);
  const [selectedVerified, setSelectedVerified] = useState(initialState?.selectedVerified || false);
  const [selectedPremium, setSelectedPremium] = useState(initialState?.selectedPremium || false);
  const [distanceRange, setDistanceRange] = useState<[number, number]>(initialState?.distanceRange || [0, 100]);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleApplyFilters = () => {
    setIsFilterApplied(!isFilterApplied);
    setIsFilterCollapsed(true);
  };

  const handleResetFilters = () => {
    setSelectedGender("");
    setMinAge(18);
    setMaxAge(60);
    setSelectedTag(null);
    setSelectedLookingFor([]);
    setIsFilterApplied(false);
    setIsFilterCollapsed(true);
    setSelectedCity(undefined);
    setSelectedVerified(false);
    setSelectedPremium(false);
    setDistanceRange([0, 100]);
  };

  const fetchFilteredAds = async (appliedFilters) => {
    try {
      // Use the secure function instead of direct table access
      const { data, error } = await getActiveAdsWithLocation({
        filters: appliedFilters
      });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching filtered ads:", error);
      return [];
    }
  };

  return {
    // State
    isFilterCollapsed,
    setIsFilterCollapsed,
    showFilters,
    setShowFilters,
    selectedCountry,
    setSelectedCountry,
    selectedGender,
    setSelectedGender,
    minAge,
    setMinAge,
    maxAge,
    setMaxAge,
    selectedTag,
    setSelectedTag,
    selectedLookingFor,
    setSelectedLookingFor,
    isFilterApplied,
    setIsFilterApplied,
    selectedCity,
    setSelectedCity,
    selectedVerified,
    setSelectedVerified,
    selectedPremium,
    setSelectedPremium,
    distanceRange,
    setDistanceRange,
    
    // Actions
    toggleFilters,
    handleApplyFilters,
    handleResetFilters,
    filters,
    setFilters,
    fetchFilteredAds
  };
}
