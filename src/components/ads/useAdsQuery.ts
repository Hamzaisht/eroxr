
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DatingAd } from "./types/dating";

interface UseAdsQueryOptions {
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
  filterOptions?: any;
}

// Define the type for raw data from Supabase
type RawDatingAd = Omit<DatingAd, 'age_range'> & {
  age_range: string;
  profiles?: {
    id_verification_status?: string;
    is_paying_customer?: boolean;
  };
};

export const useAdsQuery = (options: UseAdsQueryOptions = {}) => {
  const { verifiedOnly = true, premiumOnly = false, filterOptions = {} } = options;
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel('public:dating_ads')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dating_ads'
        },
        (payload) => {
          console.log("Received dating ad update:", payload);
          queryClient.invalidateQueries({ queryKey: ["dating_ads"] });

          if (payload.eventType === 'INSERT') {
            toast({
              title: "New dating ad",
              description: "Someone just posted a new dating ad!",
              duration: 3000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  return useQuery({
    queryKey: ["dating_ads", verifiedOnly, premiumOnly, filterOptions],
    queryFn: async () => {
      let query = supabase
        .from("dating_ads")
        .select(`
          *,
          profiles!dating_ads_user_id_fkey(
            is_paying_customer,
            id_verification_status
          )
        `)
        .eq("is_active", true)
        .eq("moderation_status", "approved");
      
      // Only return verified profiles if requested
      if (verifiedOnly) {
        query = query.eq("profiles.id_verification_status", "verified");
      }
      
      // Only return premium profiles if requested
      if (premiumOnly) {
        query = query.eq("profiles.is_paying_customer", true);
      }
      
      // Apply any additional filters from filterOptions
      if (filterOptions.country) {
        query = query.eq("country", filterOptions.country);
      }
      
      if (filterOptions.userType) {
        query = query.eq("user_type", filterOptions.userType);
      }
      
      if (filterOptions.minAge && filterOptions.maxAge) {
        // Using PostgreSQL's range operators for age filtering
        query = query.overlaps("age_range", `[${filterOptions.minAge},${filterOptions.maxAge}]`);
      }
      
      // Order by most recent first
      query = query.order("created_at", { ascending: false });
      
      const { data, error } = await query;

      if (error) throw error;
      
      // Transform data to match DatingAd type with proper age_range conversion
      return (data as RawDatingAd[] || []).map(ad => {
        // Parse age_range from string to object if necessary
        const ageRange = typeof ad.age_range === 'string' 
          ? { 
              lower: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[0]),
              upper: parseInt(ad.age_range.replace(/[\[\]\(\)]/g, '').split(',')[1])
            }
          : ad.age_range;
        
        return {
          ...ad,
          age_range: ageRange,
          isUserVerified: ad.profiles?.id_verification_status === 'verified',
          isUserPremium: ad.profiles?.is_paying_customer === true,
          is_verified: ad.profiles?.id_verification_status === 'verified',
          is_premium: ad.profiles?.is_paying_customer === true
        } as DatingAd;
      });
    },
    staleTime: 0,
  });
};

// Export the useQuery hook as well for direct access
useAdsQuery.useQuery = useQuery;
