
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAdsQuery } from "@/components/ads/hooks/useAdsQuery";
import { FilterOptions } from "@/components/ads/types/dating";
import { DatingAd } from "@/components/ads/types/dating";

export function useDatingAds(
  filterOptions: FilterOptions,
  selectedCountry: any,
  selectedCity: string | null,
  selectedSeeker: string | null,
  selectedLookingFor: string[] | null,
  selectedTag: string | null,
  setDatingAds: (ads: DatingAd[] | undefined) => void,
  setIsLoading: (v: boolean) => void
) {
  const { toast } = useToast();

  const {
    data: queryAds,
    isLoading: queryLoading,
    error: queryError,
  } = useAdsQuery({
    verifiedOnly: filterOptions.verifiedOnly,
    premiumOnly: filterOptions.premiumOnly,
    filterOptions: {
      ...filterOptions,
      country: selectedCountry,
      city: selectedCity,
      relationship_status: selectedSeeker,
      looking_for: selectedLookingFor,
      tags: selectedTag ? [selectedTag] : undefined,
    },
  });

  useEffect(() => {
    if (queryAds) {
      setDatingAds(queryAds);
      setIsLoading(false);
    } else if (queryError) {
      console.error("Error fetching ads:", queryError);
      toast({
        title: "Failed to load profiles",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    } else {
      setIsLoading(queryLoading);
    }
  }, [queryAds, queryLoading, queryError, toast, setDatingAds, setIsLoading]);
}
