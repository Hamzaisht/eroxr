
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "@/hooks/use-mobile";
import { type Database } from "@/integrations/supabase/types";
import { DatingAd, FilterOptions } from "@/components/ads/types/dating";
import { nordicCountries } from "@/components/dating/utils/datingUtils";
import { useDatingAds } from "./dating/useDatingAds";
import { useUserDatingProfile } from "./dating/useUserDatingProfile";
import { useDatingPresence } from "./dating/useDatingPresence";
import { DatingPageLayout } from "./dating/DatingPageLayout";

type NordicCountry = Database['public']['Enums']['nordic_country'];

const Dating = () => {
  // States for filters and ads
  const [datingAds, setDatingAds] = useState<DatingAd[] | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<DatingAd | null>(null);
  const { toast } = useToast();
  const session = useSession();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [activeTab, setActiveTab] = useState<string>("browse");
  const [isFilterCollapsed, setIsFilterCollapsed] = useState<boolean>(window.innerWidth < 1024);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<NordicCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minAge: 18,
    maxAge: 80,
    minDistance: 0,
    maxDistance: 100,
    verifiedOnly: false,
    premiumOnly: false,
    keyword: "",
    username: "",
  });
  const { ref: headerRef } = useInView({ threshold: 0 });

  const defaultSearchCategories = [
    { seeker: "male", lookingFor: "female", label: "Men seeking Women" },
    { seeker: "female", lookingFor: "male", label: "Women seeking Men" },
    { seeker: "couple", lookingFor: "female", label: "Couples seeking Women" },
    { seeker: "couple", lookingFor: "male", label: "Couples seeking Men" },
    { seeker: "female", lookingFor: "couple", label: "Women seeking Couples" },
    { seeker: "male", lookingFor: "couple", label: "Men seeking Couples" },
    { seeker: "female", lookingFor: "female", label: "Women seeking Women" },
    { seeker: "male", lookingFor: "male", label: "Men seeking Men" },
    { seeker: "any", lookingFor: "any", label: "Open to All" },
    { seeker: "verified", lookingFor: "any", label: "Verified Profiles" },
    { seeker: "premium", lookingFor: "any", label: "Premium Profiles" },
  ];

  // Custom query hook for fetching ads
  useDatingAds(
    filterOptions,
    selectedCountry,
    selectedCity,
    selectedSeeker,
    selectedLookingFor,
    selectedTag,
    setDatingAds,
    setIsLoading
  );

  // Custom hook for user profile
  useUserDatingProfile(setUserProfile);

  // Set up online presence tracking
  useDatingPresence(userProfile);

  const handleAdCreationSuccess = () => {
    toast({
      title: "Profile created successfully!",
      description: "Your profile is now visible to others.",
      variant: "default",
    });
    if (session?.user?.id) {
      // Re-fetch the user profile once ad is created
      setTimeout(() => useUserDatingProfile(setUserProfile), 500);
    }
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast({
      title: `Filtering by: ${tag}`,
      description: "Showing profiles matching this tag",
      duration: 2000,
    });
  };

  const handleResetFilters = () => {
    setSelectedCountry(null);
    setSelectedCity(null);
    setSelectedSeeker(null);
    setSelectedLookingFor(null);
    setSelectedTag(null);
    setFilterOptions({
      minAge: 18,
      maxAge: 80,
      minDistance: 0,
      maxDistance: 100,
      verifiedOnly: false,
      premiumOnly: false,
      keyword: "",
      username: "",
    });
    toast({
      title: "Filters reset",
      description: "Showing all profiles",
      duration: 2000,
    });
  };

  const handleFilterToggle = () => {
    setShowFilters(!showFilters);
  };

  return (
    <DatingPageLayout
      datingAds={datingAds}
      isLoading={isLoading}
      userProfile={userProfile}
      filterOptions={filterOptions}
      setFilterOptions={setFilterOptions}
      selectedCountry={selectedCountry}
      setSelectedCountry={setSelectedCountry}
      selectedCity={selectedCity}
      setSelectedCity={setSelectedCity}
      selectedSeeker={selectedSeeker}
      setSelectedSeeker={setSelectedSeeker}
      selectedLookingFor={selectedLookingFor}
      setSelectedLookingFor={setSelectedLookingFor}
      selectedTag={selectedTag}
      setSelectedTag={setSelectedTag}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      isFilterCollapsed={isFilterCollapsed}
      setIsFilterCollapsed={setIsFilterCollapsed}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
      handleAdCreationSuccess={handleAdCreationSuccess}
      handleTagClick={handleTagClick}
      handleResetFilters={handleResetFilters}
      handleFilterToggle={handleFilterToggle}
      defaultSearchCategories={defaultSearchCategories}
      nordicCountries={nordicCountries as NordicCountry[]}
      headerRef={headerRef}
      navigate={navigate}
    />
  );
};

export default Dating;
