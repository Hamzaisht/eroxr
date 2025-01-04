import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, User, Calendar, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type DatingAd = {
  id: string;
  title: string;
  description: string;
  relationship_status: "single" | "couple" | "other";
  looking_for: string[];
  country: string;
  city: string;
  age_range: { lower: number; upper: number };
  created_at: string;
};

export const PromotedAds = () => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const { data: ads, isLoading } = useQuery({
    queryKey: ["dating-ads", selectedCountry, selectedStatus],
    queryFn: async () => {
      let query = supabase
        .from("dating_ads")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (selectedCountry) {
        query = query.eq("country", selectedCountry);
      }
      if (selectedStatus) {
        query = query.eq("relationship_status", selectedStatus);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as DatingAd[];
    },
  });

  const countries = ["denmark", "finland", "iceland", "norway", "sweden"];
  const statuses = ["single", "couple", "other"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#221F26]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Dating Ads
            </h2>
            <p className="text-gray-400">
              Find your perfect match in the Nordics
            </p>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                className="pl-10 pr-4 py-2 bg-[#403E43] text-white border border-[#8A898C] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedCountry || ""}
                onChange={(e) => setSelectedCountry(e.target.value || null)}
              >
                <option value="">All Countries</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country.charAt(0).toUpperCase() + country.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <select
              className="px-4 py-2 bg-[#403E43] text-white border border-[#8A898C] rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus || ""}
              onChange={(e) => setSelectedStatus(e.target.value || null)}
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <Button className="bg-[#1EAEDB] hover:bg-[#33C3F0] text-white">
              Post an Ad
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads?.map((ad) => (
            <Card
              key={ad.id}
              className="bg-[#403E43] border-none text-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-[#1EAEDB]">
                      {ad.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="capitalize bg-[#221F26] text-[#1EAEDB]"
                    >
                      {ad.relationship_status}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{ad.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <MapPin className="h-4 w-4 text-[#1EAEDB]" />
                    {ad.city}, {ad.country}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <User className="h-4 w-4 text-[#1EAEDB]" />
                    Looking for: {ad.looking_for.join(", ")}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="h-4 w-4 text-[#1EAEDB]" />
                    Age range: {ad.age_range.lower} - {ad.age_range.upper}
                  </div>
                </div>
                <Button className="w-full bg-[#1EAEDB] hover:bg-[#33C3F0]">
                  <Heart className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};