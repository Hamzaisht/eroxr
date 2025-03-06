
import { useState } from "react";
import { motion } from "framer-motion";
import { useAdsQuery } from "@/components/ads/useAdsQuery";
import { FilterOptions, SearchCategory } from "@/components/ads/types/dating";
import { AdFilters } from "@/components/ads/AdFilters";
import { DatingHeader } from "@/components/dating/DatingHeader";
import { DatingContent } from "@/components/dating/DatingContent";
import { useUserProfile } from "@/components/dating/hooks/useUserProfile";
import { useViewTracking } from "@/components/dating/hooks/useViewTracking";

export default function Dating() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  // Track page views
  useViewTracking();

  // Fetch ads data
  const { data: ads, isLoading, refetch } = useAdsQuery();

  // Get user profile data
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();

  // Define search categories
  const searchCategories: SearchCategory[] = [
    { seeker: "couple", looking_for: "female" },
    { seeker: "couple", looking_for: "male" },
    { seeker: "couple", looking_for: "couple" },
    { seeker: "female", looking_for: "male" },
    { seeker: "female", looking_for: "female" },
    { seeker: "female", looking_for: "couple" },
    { seeker: "male", looking_for: "female" },
    { seeker: "male", looking_for: "male" },
    { seeker: "male", looking_for: "couple" },
    { seeker: "any", looking_for: "any" }, // A4A - Anyone for Anyone
    { seeker: "couple", looking_for: "couple" }, // MF4MF - Couple for Couple
  ];

  // Check if user can access body contact features
  const canAccessBodyContact = userProfile?.is_paying_customer || userProfile?.id_verification_status === 'verified';

  // Handler to refresh ads after creating a new one
  const handleAdCreationSuccess = () => {
    refetch();
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-primary"></div>
      </div>
    );
  }

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
