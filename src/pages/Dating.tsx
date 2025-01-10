import { useState } from "react";
import { VideoProfileCarousel } from "@/components/ads/VideoProfileCarousel";
import { AdFilters } from "@/components/ads/AdFilters";
import { useAdsQuery } from "@/components/ads/useAdsQuery";
import { FilterOptions, SearchCategory } from "@/components/ads/types/dating";
import { NewMessageDialog } from "@/components/messages/NewMessageDialog";

export default function Dating() {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

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
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-80 flex-shrink-0">
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
          </div>

          {/* Main Content - Video Profile Carousel */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between bg-luxury-dark/50 backdrop-blur-sm p-4 rounded-xl">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Video Profiles
              </h1>
              <NewMessageDialog onSelectUser={() => {}} />
            </div>
            
            {ads && ads.length > 0 ? (
              <VideoProfileCarousel ads={ads} />
            ) : (
              <div className="flex justify-center items-center min-h-[400px] text-luxury-neutral">
                No video profiles found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};