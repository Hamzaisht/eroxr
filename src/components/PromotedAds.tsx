import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdFilters } from "./ads/AdFilters";
import { AdList } from "./ads/AdList";
import { CountrySelect } from "./ads/CountrySelect";
import { type SearchCategory, type DatingAd } from "./ads/types";

const searchCategories: SearchCategory[] = [
  { seeker: "couple", looking_for: "male" },
  { seeker: "couple", looking_for: "couple" },
  { seeker: "couple", looking_for: "female" },
  { seeker: "female", looking_for: "male" },
  { seeker: "female", looking_for: "female" },
  { seeker: "female", looking_for: "couple" },
  { seeker: "male", looking_for: "couple" },
  { seeker: "male", looking_for: "male" },
  { seeker: "male", looking_for: "female" },
];

const countries = ["denmark", "finland", "iceland", "norway", "sweden"];

// Define the type for raw data from Supabase
type RawDatingAd = Omit<DatingAd, 'age_range'> & {
  age_range: string;
};

export const PromotedAds = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);

  const { data: ads, isLoading } = useQuery({
    queryKey: ["dating-ads", selectedCountry, selectedSeeker, selectedLookingFor],
    queryFn: async () => {
      let query = supabase
        .from("dating_ads")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (selectedCountry) {
        query = query.eq("country", selectedCountry);
      }
      if (selectedSeeker && selectedLookingFor) {
        query = query.contains("looking_for", [selectedLookingFor]);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to match the DatingAd type
      return (data as RawDatingAd[] || []).map((ad) => ({
        ...ad,
        age_range: {
          lower: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[0]),
          upper: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[1])
        },
        // Add demo premium and verified status for some ads
        is_premium: Math.random() > 0.7,
        is_verified: Math.random() > 0.5
      })) as DatingAd[];
    },
  });

  return (
    <section className="py-16 bg-gradient-to-br from-[#1A1F2C] to-[#2A1F3D]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[#1EAEDB] to-[#33C3F0] bg-clip-text text-transparent">
              Find Your Perfect Match
            </h2>
            <p className="text-gray-400 text-lg">
              Discover meaningful connections in the Nordics
            </p>
          </div>

          <AdFilters
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            selectedSeeker={selectedSeeker}
            selectedLookingFor={selectedLookingFor}
            setSelectedSeeker={setSelectedSeeker}
            setSelectedLookingFor={setSelectedLookingFor}
            searchCategories={searchCategories}
            countries={countries}
          />

          <div className="flex flex-wrap gap-4 items-center justify-between">
            <CountrySelect
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countries={countries}
            />
            <Button className="bg-gradient-to-r from-[#1EAEDB] to-[#33C3F0] hover:from-[#33C3F0] hover:to-[#1EAEDB] text-white border-none transition-all duration-300">
              Post an Ad
            </Button>
          </div>

          <AdList ads={ads} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};