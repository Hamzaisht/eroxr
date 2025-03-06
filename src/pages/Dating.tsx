import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAdsQuery } from "@/components/ads/hooks/useAdsQuery";
import { FilterOptions, SearchCategory } from "@/components/ads/types/dating";
import { AdFilters } from "@/components/ads/AdFilters";
import { DatingHeader } from "@/components/dating/DatingHeader";
import { DatingContent } from "@/components/dating/DatingContent";
import { useUserProfile } from "@/components/dating/hooks/useUserProfile";
import { useViewTracking } from "@/components/dating/hooks/useViewTracking";
import { useLocation } from "react-router-dom";
import { Award, ArrowRight } from "lucide-react";

export default function Dating() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minAge: 18,
    maxAge: 99,
    maxDistance: 50
  });
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);
  
  const location = useLocation();

  // Track page views
  useViewTracking();

  // Get user profile data
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  
  // Check if user is verified and/or premium
  const isVerified = userProfile?.id_verification_status === 'verified';
  const isPremium = userProfile?.is_paying_customer;
  const canAccessFullFeatures = isVerified || isPremium; // Changed to OR logic
  
  // Fetch ads data with special options - always skip moderation checks
  const { data: ads, isLoading, refetch } = useAdsQuery({
    // Always show all ads regardless of moderation status
    skipModeration: true,
    includeMyPendingAds: true,
    filterOptions
  });

  // Handle URL parameters for tag searching
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tagParam = params.get('tag');
    
    if (tagParam && shortcutMap[tagParam.toUpperCase()]) {
      const { seeker, looking_for } = shortcutMap[tagParam.toUpperCase()];
      setSelectedSeeker(seeker);
      setSelectedLookingFor(looking_for);
    }
  }, [location.search]);

  // Define search categories
  const searchCategories: SearchCategory[] = [
    // Couple seeking
    { seeker: "couple", looking_for: "female" },
    { seeker: "couple", looking_for: "male" },
    { seeker: "couple", looking_for: "couple" },
    { seeker: "couple", looking_for: "trans" },
    { seeker: "couple", looking_for: "any" },
    
    // Female seeking
    { seeker: "female", looking_for: "male" },
    { seeker: "female", looking_for: "female" },
    { seeker: "female", looking_for: "couple" },
    { seeker: "female", looking_for: "trans" },
    { seeker: "female", looking_for: "any" },
    
    // Male seeking
    { seeker: "male", looking_for: "female" },
    { seeker: "male", looking_for: "male" },
    { seeker: "male", looking_for: "couple" },
    { seeker: "male", looking_for: "trans" },
    { seeker: "male", looking_for: "any" }
  ];

  // Check if user can access body contact features
  const canAccessBodyContact = isVerified || isPremium; // Changed to OR logic

  // Handler to refresh ads after creating a new one
  const handleAdCreationSuccess = () => {
    refetch();
  };

  // Show loading state
  if (isLoading || isProfileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

  // Define shortcut map for reference in this component
  const shortcutMap = {
    // Couple seeking tags
    "MF4A": { seeker: "couple", looking_for: "any" },
    "MF4F": { seeker: "couple", looking_for: "female" },
    "MF4M": { seeker: "couple", looking_for: "male" },
    "MF4MF": { seeker: "couple", looking_for: "couple" },
    "MF4T": { seeker: "couple", looking_for: "trans" },
    
    // Female seeking tags
    "F4A": { seeker: "female", looking_for: "any" },
    "F4M": { seeker: "female", looking_for: "male" },
    "F4F": { seeker: "female", looking_for: "female" },
    "F4MF": { seeker: "female", looking_for: "couple" },
    "F4T": { seeker: "female", looking_for: "trans" },
    
    // Male seeking tags
    "M4A": { seeker: "male", looking_for: "any" },
    "M4F": { seeker: "male", looking_for: "female" },
    "M4M": { seeker: "male", looking_for: "male" },
    "M4MF": { seeker: "male", looking_for: "couple" },
    "M4T": { seeker: "male", looking_for: "trans" }
  };

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
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="w-full bg-gradient-to-r from-purple-500/20 to-purple-700/20 rounded-lg p-3 flex flex-col sm:flex-row justify-between items-center shadow-lg border border-purple-500/30"
            >
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                <Award className="h-6 w-6 text-purple-400" />
                <div>
                  <h3 className="font-semibold text-white">Unlock BD Ads for 59 SEK/month</h3>
                  <p className="text-xs text-luxury-neutral">Cancel anytime, instant access</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-1"
              >
                Upgrade Now <ArrowRight className="h-4 w-4 ml-1" />
              </motion.button>
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar - Filters */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-80 flex-shrink-0"
            >
              <AdFilters
                selectedCountry={selectedCountry}
                setSelectedCountry={setSelectedCountry}
                selectedSeeker={selectedSeeker}
                selectedLookingFor={selectedLookingFor}
                setSelectedSeeker={setSelectedSeeker}
                setSelectedLookingFor={setSelectedLookingFor}
                searchCategories={searchCategories}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
                countries={["denmark", "finland", "iceland", "norway", "sweden"]}
              />
            </motion.div>

            {/* Main Content - Video Profile Carousel */}
            <DatingContent 
              ads={ads}
              canAccessBodyContact={!!canAccessBodyContact}
              onAdCreationSuccess={handleAdCreationSuccess}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
