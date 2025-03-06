
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
  userId?: string; // Added to fetch ads for a specific user
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
    verifiedOnly = false,
    premiumOnly = false, 
    filterOptions = {}, 
    includeMyPendingAds = true,
    skipModeration = false, // For verified users
    userId = undefined // For fetching specific user's ads
  } = options;
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();
  const currentUserId = session?.user?.id;

  // For debugging
  console.log("useAdsQuery - currentUserId:", currentUserId);
  console.log("useAdsQuery - options:", options);

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
    queryKey: ["dating_ads", verifiedOnly, premiumOnly, filterOptions, includeMyPendingAds, skipModeration, currentUserId, userId],
    queryFn: async () => {
      console.log("Query executing with options:", { 
        verifiedOnly, premiumOnly, filterOptions, 
        includeMyPendingAds, skipModeration, currentUserId, userId 
      });
      
      // Main query to get dating ads
      let adsQuery = supabase
        .from("dating_ads")
        .select(`
          *,
          profiles!dating_ads_user_id_fkey(
            is_paying_customer,
            id_verification_status
          )
        `)
        .eq("is_active", true);
      
      // If fetching for a specific profile
      if (userId) {
        console.log("Fetching ads for specific user ID:", userId);
        adsQuery = adsQuery.eq("user_id", userId);
        // When viewing someone's profile, we should only see their approved ads
        // unless it's our own profile
        if (userId !== currentUserId) {
          adsQuery = adsQuery.eq("moderation_status", "approved");
        }
      } else {
        // For the main dating page
        
        // 1. If the user is neither verified nor premium, only show approved ads
        if (!skipModeration) {
          adsQuery = adsQuery.eq("moderation_status", "approved");
        }
        
        // Only return verified profiles if requested
        if (verifiedOnly) {
          adsQuery = adsQuery.eq("profiles.id_verification_status", "verified");
        }
        
        // Only return premium profiles if requested
        if (premiumOnly) {
          adsQuery = adsQuery.eq("profiles.is_paying_customer", true);
        }
        
        // Apply any additional filters from filterOptions
        if (filterOptions.country) {
          adsQuery = adsQuery.eq("country", filterOptions.country);
        }
        
        if (filterOptions.userType) {
          adsQuery = adsQuery.eq("user_type", filterOptions.userType);
        }
        
        if (filterOptions.minAge && filterOptions.maxAge) {
          // Using PostgreSQL's range operators for age filtering
          adsQuery = adsQuery.overlaps("age_range", `[${filterOptions.minAge},${filterOptions.maxAge}]`);
        }
      }
      
      // Execute the main query
      const { data: fetchedAds, error: fetchError } = await adsQuery.order("created_at", { ascending: false });
      
      if (fetchError) {
        console.error("Error fetching ads:", fetchError);
        throw fetchError;
      }
      
      console.log("Fetched ads:", fetchedAds?.length, fetchedAds);
      
      let allAds = fetchedAds || [];
      
      // 2. If we're on the main page and the user is logged in, include their pending ads separately
      if (includeMyPendingAds && currentUserId && !userId) {
        console.log("Fetching user's pending ads");
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
          
        if (!pendingError && pendingAds && pendingAds.length > 0) {
          console.log("User's pending ads:", pendingAds.length, pendingAds);
          allAds = [...allAds, ...pendingAds];
        }
      }
      
      // Remove duplicates (when merging results)
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
