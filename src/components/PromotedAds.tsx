import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdFilters } from "./ads/AdFilters";
import { AdList } from "./ads/AdList";
import { CountrySelect } from "./ads/CountrySelect";
import { type SearchCategory } from "./ads/types";

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

export const PromotedAds = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedSeeker, setSelectedSeeker] = useState<string | null>(null);
  const [selectedLookingFor, setSelectedLookingFor] = useState<string | null>(
    null
  );

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
      return data;
    },
  });

  return (
    <section className="py-16 bg-[#221F26]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#1EAEDB] to-[#33C3F0] bg-clip-text text-transparent">
              Body Ads
            </h2>
            <p className="text-gray-400">Find your perfect match in the Nordics</p>
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

          <div className="flex flex-wrap gap-4 items-center justify-center md:justify-end">
            <CountrySelect
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              countries={countries}
            />
            <Button className="bg-[#1EAEDB] hover:bg-[#33C3F0] text-white">
              Post an Ad
            </Button>
          </div>

          <AdList ads={ads} isLoading={isLoading} />
        </div>
      </div>
    </section>
  );
};