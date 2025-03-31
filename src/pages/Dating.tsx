
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useAdsQuery } from "@/components/ads/hooks/useAdsQuery";
import { FilterOptions } from "@/components/ads/types/dating";
import { DatingHeader } from "@/components/dating/DatingHeader";
import { DatingContent } from "@/components/dating/DatingContent";
import { useUserProfile } from "@/components/dating/hooks/useUserProfile";
import { useViewTracking } from "@/components/dating/hooks/useViewTracking";
import { PremiumPromoBanner } from "@/components/dating/PremiumPromoBanner";
import { SubscriptionDialog } from "@/components/dating/SubscriptionDialog";
import { defaultSearchCategories, nordicCountries } from "@/components/dating/utils/datingUtils";
import { type Database } from "@/integrations/supabase/types";
import { useModifiedSearchParams } from "@/components/dating/hooks/useModifiedSearchParams";
import { DatingFilterSidebar } from "@/components/dating/DatingFilterSidebar";
import { MobileFilterToggle } from "@/components/dating/MobileFilterToggle";

type NordicCountry = Database['public']['Enums']['nordic_country'];

export default function Dating() {
  const [selectedCountry, setSelectedCountry] = useState<NordicCountry | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minAge: 18,
    maxAge: 99,
    maxDistance: 50
  });
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(false);
  const [showFilters, setShowFilters] = useState(true);

  useViewTracking();

  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  
  const isVerified = userProfile?.id_verification_status === 'verified';
  const isPremium = userProfile?.is_paying_customer;
  const canAccessFullFeatures = isVerified || isPremium;

  const { handleTagClick } = useModifiedSearchParams({
    setSelectedTag,
    setSelectedSeeker,
    setSelectedLookingFor
  });

  // Use useMemo for stable query options
  const queryOptions = useMemo(() => ({
    skipModeration: true,
    includeMyPendingAds: true,
    filterOptions,
    tagFilter: selectedTag,
    verifiedOnly: filterOptions.isVerified || selectedSeeker === 'verified',
    premiumOnly: filterOptions.isPremium || selectedSeeker === 'premium',
    // Pass location filters
    locationFilters: {
      country: selectedCountry,
      city: selectedCity
    }
  }), [
    filterOptions, 
    selectedTag, 
    selectedSeeker, 
    selectedCountry, 
    selectedCity
  ]);

  const { data: ads, isLoading, refetch } = useAdsQuery(queryOptions);

  // Use effect to handle filter changes without page refresh
  useEffect(() => {
    console.log("Filters changed, refetching ads...");
    // This will refetch ads when filter options change without refreshing the page
    refetch();
  }, [
    filterOptions, 
    selectedTag, 
    selectedSeeker, 
    selectedLookingFor, 
    selectedCountry, 
    selectedCity, 
    refetch
  ]);

  const handleAdCreationSuccess = () => {
    refetch();
  };

  const handleSubscriptionClick = () => {
    setShowSubscriptionDialog(true);
  };

  // IMPROVED: More comprehensive form submission prevention
  const preventFormSubmission = (e: React.FormEvent | React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  if (isLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  const canAccessBodyContact = isVerified || isPremium;

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to"
      onSubmit={preventFormSubmission}
    >
      <div className="container-fluid px-4 py-8 max-w-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-8"
        >
          <DatingHeader 
            isNewMessageOpen={isNewMessageOpen}
            setIsNewMessageOpen={setIsNewMessageOpen}
            canAccessBodyContact={!!canAccessBodyContact}
            onAdCreationSuccess={handleAdCreationSuccess}
          />

          {!canAccessFullFeatures && (
            <PremiumPromoBanner onSubscriptionClick={handleSubscriptionClick} />
          )}

          <MobileFilterToggle showFilters={showFilters} setShowFilters={setShowFilters} />

          <div className="flex flex-col lg:flex-row gap-8 relative">
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
              nordicCountries={nordicCountries as NordicCountry[]}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
            />

            <DatingContent 
              ads={ads}
              canAccessBodyContact={!!canAccessBodyContact}
              onAdCreationSuccess={handleAdCreationSuccess}
              onTagClick={handleTagClick}
            />
          </div>
        </motion.div>
      </div>

      <SubscriptionDialog 
        open={showSubscriptionDialog} 
        onOpenChange={setShowSubscriptionDialog} 
      />
    </div>
  );
};
