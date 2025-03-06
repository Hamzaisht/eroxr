
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DatingAd } from "./types/dating";
import { useSession } from "@supabase/auth-helpers-react";

interface UseAdsQueryOptions {
  verifiedOnly?: boolean;
  premiumOnly?: boolean;
  filterOptions?: any;
  includeMyPendingAds?: boolean;
  skipModeration?: boolean; // Added to bypass moderation for verified users
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
  const { 
    verifiedOnly = false, // Changed default to false
    premiumOnly = false, 
    filterOptions = {}, 
    includeMyPendingAds = true,
    skipModeration = false // For verified users
  } = options;
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();
  const currentUserId = session?.user?.id;

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
    queryKey: ["dating_ads", verifiedOnly, premiumOnly, filterOptions, includeMyPendingAds, skipModeration, currentUserId],
    queryFn: async () => {
      console.log("Query executing with options:", { 
        verifiedOnly, premiumOnly, filterOptions, 
        includeMyPendingAds, skipModeration, currentUserId 
      });
      
      // 1. First query: Get all approved ads (with filters)
      let approvedAdsQuery = supabase
        .from("dating_ads")
        .select(`
          *,
          profiles!dating_ads_user_id_fkey(
            is_paying_customer,
            id_verification_status
          )
        `)
        .eq("is_active", true);
      
      // Only apply moderation filter for public ads
      if (!skipModeration) {
        approvedAdsQuery = approvedAdsQuery.eq("moderation_status", "approved");
      }
      
      // Only return verified profiles if requested
      if (verifiedOnly) {
        approvedAdsQuery = approvedAdsQuery.eq("profiles.id_verification_status", "verified");
      }
      
      // Only return premium profiles if requested
      if (premiumOnly) {
        approvedAdsQuery = approvedAdsQuery.eq("profiles.is_paying_customer", true);
      }
      
      // Apply any additional filters from filterOptions
      if (filterOptions.country) {
        approvedAdsQuery = approvedAdsQuery.eq("country", filterOptions.country);
      }
      
      if (filterOptions.userType) {
        approvedAdsQuery = approvedAdsQuery.eq("user_type", filterOptions.userType);
      }
      
      if (filterOptions.minAge && filterOptions.maxAge) {
        // Using PostgreSQL's range operators for age filtering
        approvedAdsQuery = approvedAdsQuery.overlaps("age_range", `[${filterOptions.minAge},${filterOptions.maxAge}]`);
      }
      
      // Get approved ads
      const { data: approvedAds, error: approvedError } = await approvedAdsQuery.order("created_at", { ascending: false });
      
      if (approvedError) throw approvedError;
      
      console.log("Approved ads query result:", approvedAds);
      
      // 2. Second query: Get the user's own pending ads if they're logged in and option is enabled
      let myPendingAds: RawDatingAd[] = [];
      
      if (includeMyPendingAds && currentUserId) {
        const { data: pendingAds, error: pendingError } = await supabase
          .from("dating_ads")
          .select(`
            *,
            profiles!dating_ads_user_id_fkey(
              is_paying_customer,
              id_verification_status
            )
          `)
          .eq("is_active", true)
          .eq("moderation_status", "pending")
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });
          
        if (!pendingError && pendingAds) {
          myPendingAds = pendingAds as RawDatingAd[];
          console.log("User's pending ads:", myPendingAds);
        }
      }
      
      // 3. If verified/premium users, get their own ads separately
      let myAds: RawDatingAd[] = [];
      
      if (currentUserId && skipModeration) {
        const { data: userAds, error: userAdsError } = await supabase
          .from("dating_ads")
          .select(`
            *,
            profiles!dating_ads_user_id_fkey(
              is_paying_customer,
              id_verification_status
            )
          `)
          .eq("is_active", true)
          .eq("user_id", currentUserId)
          .order("created_at", { ascending: false });
          
        if (!userAdsError && userAds) {
          myAds = userAds as RawDatingAd[];
          console.log("User's own ads:", myAds);
        }
      }
      
      // Combine all results
      const allAds = [...(approvedAds || []), ...myPendingAds, ...myAds];
      
      // Remove duplicates (user's own ads might be in both approved and myAds)
      const uniqueAds = Array.from(new Map(allAds.map(ad => [ad.id, ad])).values());
      
      console.log("Total unique ads to display:", uniqueAds.length);
      
      // Transform data to match DatingAd type with proper age_range conversion
      return uniqueAds.map(ad => {
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
