
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdsQuery } from "@/components/ads/hooks/useAdsQuery";
import { FilterOptions } from "@/components/ads/types/dating";
import { AdFilters } from "@/components/ads/AdFilters";
import { DatingHeader } from "@/components/dating/DatingHeader";
import { DatingContent } from "@/components/dating/DatingContent";
import { useUserProfile } from "@/components/dating/hooks/useUserProfile";
import { useViewTracking } from "@/components/dating/hooks/useViewTracking";
import { PremiumPromoBanner } from "@/components/dating/PremiumPromoBanner";
import { SubscriptionDialog } from "@/components/dating/SubscriptionDialog";
import { defaultSearchCategories, nordicCountries } from "@/components/dating/utils/datingUtils";
import { type Database } from "@/integrations/supabase/types";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

type NordicCountry = Database['public']['Enums']['nordic_country'];

// Modified version of useSearchParams without page refreshes
const useModifiedSearchParams = ({
  setSelectedTag,
  setSelectedSeeker,
  setSelectedLookingFor
}: {
  setSelectedTag: (tag: string | null) => void;
  setSelectedSeeker: (seeker: string | null) => void;
  setSelectedLookingFor: (lookingFor: string | null) => void;
}) => {
  const location = useLocation();
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get('tag');
    const seekerParam = params.get('seeker');
    const lookingForParam = params.get('looking_for');
    
    if (tagParam) {
      setSelectedTag(tagParam);
    }
    
    if (seekerParam && lookingForParam) {
      setSelectedSeeker(seekerParam);
      setSelectedLookingFor(lookingForParam);
    }
  }, [location.search, setSelectedTag, setSelectedSeeker, setSelectedLookingFor]);

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag);
    // We're not updating the URL here to avoid page refresh
  };

  return { handleTagClick };
};

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

  const { data: ads, isLoading, refetch } = useAdsQuery({
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
  });

  useEffect(() => {
    // This will refetch ads when filter options change without refreshing the page
    refetch();
  }, [filterOptions, selectedTag, selectedSeeker, selectedLookingFor, selectedCountry, selectedCity, refetch]);

  const handleAdCreationSuccess = () => {
    refetch();
  };

  const handleSubscriptionClick = () => {
    setShowSubscriptionDialog(true);
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
    <div className="min-h-screen bg-gradient-to-br from-luxury-gradient-from via-luxury-gradient-via to-luxury-gradient-to">
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

          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 relative">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ 
                opacity: 1, 
                x: 0,
                width: isFilterCollapsed ? '40px' : '320px',
              }}
              transition={{ duration: 0.3 }}
              className={`
                ${isFilterCollapsed ? 'w-10' : 'w-full lg:w-80'} 
                flex-shrink-0 relative
                ${!showFilters && 'hidden lg:block'}
              `}
            >
              <button
                onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
                className="hidden lg:flex absolute -right-4 top-20 z-10 w-8 h-16 bg-luxury-dark/80 border border-luxury-primary/30 rounded-r-lg items-center justify-center text-luxury-primary hover:bg-luxury-dark transition-colors"
              >
                {isFilterCollapsed ? (
                  <ChevronRight className="w-5 h-5" />
                ) : (
                  <ChevronLeft className="w-5 h-5" />
                )}
              </button>
              
              <div className={`${isFilterCollapsed ? 'invisible opacity-0' : 'visible opacity-100'} transition-opacity duration-300`}>
                <AdFilters
                  selectedCountry={selectedCountry}
                  setSelectedCountry={setSelectedCountry}
                  selectedSeeker={selectedSeeker}
                  selectedLookingFor={selectedLookingFor}
                  setSelectedSeeker={setSelectedSeeker}
                  setSelectedLookingFor={setSelectedLookingFor}
                  searchCategories={defaultSearchCategories}
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                  countries={nordicCountries as NordicCountry[]}
                  selectedTag={selectedTag}
                  setSelectedTag={setSelectedTag}
                  selectedCity={selectedCity}
                  setSelectedCity={setSelectedCity}
                />
              </div>
            </motion.div>

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
