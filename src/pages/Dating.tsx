import { useState } from "react";
import { VideoProfileCarousel } from "@/components/ads/VideoProfileCarousel";
import { AdFilters } from "@/components/ads/AdFilters";
import { useAdsQuery } from "@/components/ads/useAdsQuery";
import { FilterOptions, SearchCategory } from "@/components/ads/types/dating";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";
import { CreateBodyContactDialog } from "@/components/ads/CreateBodyContactDialog";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Dating() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false);

  const { data: ads, isLoading } = useAdsQuery();

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
          {/* Header Section */}
          <div className="relative">
            <div className="absolute inset-0 bg-neon-glow opacity-20 blur-xl"></div>
            <div className="relative glass-effect p-8 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                    Discover Connections
                  </h1>
                  <p className="text-luxury-neutral text-lg">
                    Find your perfect match through authentic video profiles
                  </p>
                </div>
                <div className="flex gap-3">
                  <CreateBodyContactDialog />
                  <NewMessageDialog 
                    open={isNewMessageOpen} 
                    onOpenChange={setIsNewMessageOpen} 
                    onSelectUser={() => {}} 
                  />
                </div>
              </div>
            </div>
          </div>

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
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex-1"
            >
              {ads && ads.length > 0 ? (
                <VideoProfileCarousel ads={ads} />
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] glass-effect rounded-2xl p-8 text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-luxury-primary animate-pulse" />
                  <h3 className="text-2xl font-semibold text-white">No Profiles Found</h3>
                  <p className="text-luxury-neutral max-w-md">
                    Be the first to create a profile in this category and start connecting with others
                  </p>
                  <CreateBodyContactDialog />
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
