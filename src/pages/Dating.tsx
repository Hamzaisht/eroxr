import { useState } from "react";
import { AdList } from "@/components/ads/AdList";
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

          {/* Main Content - Ad List */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center justify-between bg-[#1A1F2C]/50 backdrop-blur-sm p-4 rounded-xl">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-luxury-primary to-luxury-accent bg-clip-text text-transparent">
                Dating Ads
              </h1>
              <NewMessageDialog onSelectUser={() => {}} />
            </div>
            <AdList ads={ads} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}