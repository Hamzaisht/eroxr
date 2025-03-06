import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdFilters } from "./ads/AdFilters";
import { AdList } from "./ads/AdList";
import { CountrySelect } from "./ads/CountrySelect";
import { type SearchCategory, type FilterOptions, type DatingAd } from "./ads/types/dating";
import { type Database } from "@/integrations/supabase/types";

type NordicCountry = Database['public']['Enums']['nordic_country'];

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

const countries: NordicCountry[] = ["denmark", "finland", "iceland", "norway", "sweden"];

// Define the type for raw data from Supabase
type RawDatingAd = Omit<DatingAd, 'age_range'> & {
  age_range: string;
  preferred_age_range?: string;
};

export const PromotedAds = () => {
  const [selectedCountry, setSelectedCountry] = useState<NordicCountry | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({});

  const { data: ads, isLoading } = useQuery({
    queryKey: ["dating-ads", selectedCountry, selectedSeeker, selectedLookingFor, filterOptions],
    queryFn: async () => {
      let query = supabase
        .from("dating_ads")
        .select("*")
        .eq("is_active", true);

      // Apply filters
      if (selectedCountry) {
        query = query.eq("country", selectedCountry);
      }
      if (selectedSeeker && selectedLookingFor) {
        query = query.contains("looking_for", [selectedLookingFor]);
      }
      if (filterOptions.bodyType && Array.isArray(filterOptions.bodyType) && filterOptions.bodyType.length > 0) {
        query = query.in("body_type", filterOptions.bodyType);
      }
      if (filterOptions.educationLevel && Array.isArray(filterOptions.educationLevel) && filterOptions.educationLevel.length > 0) {
        query = query.in("education_level", filterOptions.educationLevel);
      }
      if (filterOptions.minAge || filterOptions.maxAge) {
        const ageRange = `[${filterOptions.minAge || 18},${filterOptions.maxAge || 99}]`;
        query = query.overlaps("age_range", ageRange);
      }
      if (filterOptions.lastActive) {
        const now = new Date();
        let fromDate = new Date();
        switch (filterOptions.lastActive) {
          case 'today':
            fromDate.setHours(0, 0, 0, 0);
            break;
          case 'week':
            fromDate.setDate(now.getDate() - 7);
            break;
          case 'month':
            fromDate.setMonth(now.getMonth() - 1);
            break;
          default:
            break;
        }
        if (filterOptions.lastActive !== 'all') {
          query = query.gte("last_active", fromDate.toISOString());
        }
      }

      // Order by
      switch (filterOptions.sortBy) {
        case 'newest':
          query = query.order("created_at", { ascending: false });
          break;
        case 'lastActive':
          query = query.order("last_active", { ascending: false });
          break;
        case 'profileScore':
          query = query.order("profile_completion_score", { ascending: false });
          break;
        default:
          query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Transform the data to match the DatingAd type
      return (data as RawDatingAd[] || []).map((ad) => {
        const parsedAge = typeof ad.age_range === 'string' 
          ? { 
              lower: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[0]),
              upper: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[1])
            }
          : ad.age_range;
          
        const parsedPreferredAge = ad.preferred_age_range && typeof ad.preferred_age_range === 'string' 
          ? { 
              lower: parseInt(ad.preferred_age_range.replace(/[\[\]\(\)]/g, '').split(',')[0]),
              upper: parseInt(ad.preferred_age_range.replace(/[\[\]\(\)]/g, '').split(',')[1])
            }
          : ad.preferred_age_range;
          
        return {
          ...ad,
          age_range: parsedAge,
          preferred_age_range: parsedPreferredAge,
          // Add demo premium and verified status for some ads
          is_premium: ad.is_premium || Math.random() > 0.7,
          is_verified: ad.is_verified || Math.random() > 0.5
        } as unknown as DatingAd;
      });
    },
  });

  const handleCountryChange = (country: NordicCountry | null) => {
    setSelectedCountry(country);
  };

  return (
    <section className="py-8 bg-gradient-to-br from-[#1A1F2C] to-[#2A1F3D]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] bg-clip-text text-transparent">
              Find Your Perfect Match
            </h2>
            <p className="text-gray-400 text-sm">
              Discover meaningful connections in the Nordics
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/4">
              <AdFilters
                selectedCountry={selectedCountry}
                setSelectedCountry={handleCountryChange}
                selectedSeeker={selectedSeeker}
                selectedLookingFor={selectedLookingFor}
                setSelectedSeeker={setSelectedSeeker}
                setSelectedLookingFor={setSelectedLookingFor}
                searchCategories={searchCategories}
                countries={countries}
                filterOptions={filterOptions}
                setFilterOptions={setFilterOptions}
              />
            </div>

            <div className="lg:w-3/4">
              <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
                <CountrySelect
                  selectedCountry={selectedCountry}
                  setSelectedCountry={handleCountryChange}
                  countries={countries}
                />
                <Button className="bg-gradient-to-r from-[#9b87f5] to-[#7E69AB] hover:from-[#7E69AB] hover:to-[#9b87f5] text-white border-none transition-all duration-300">
                  Post an Ad
                </Button>
              </div>
              <AdList ads={ads} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
