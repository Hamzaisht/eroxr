import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, User, Calendar } from "lucide-react";
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Dating Ads</h2>
            <p className="text-muted-foreground">
              Find your perfect match in the Nordics
            </p>
          </div>
          <Button>Post an Ad</Button>
        </div>

        <div className="flex gap-4 mb-8">
          <select
            className="border rounded-md p-2"
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

          <select
            className="border rounded-md p-2"
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
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads?.map((ad) => (
            <Card key={ad.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold mb-2">{ad.title}</h3>
                  <Badge variant="secondary" className="capitalize">
                    {ad.relationship_status}
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">{ad.description}</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {ad.city}, {ad.country}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Looking for: {ad.looking_for.join(", ")}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Age range: {ad.age_range.lower} - {ad.age_range.upper}
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="w-full">
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