
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { UseAdsQueryOptions } from "./useAdsQueryTypes";
import { buildAdsQuery, fetchPendingUserAds } from "../utils/adQueryBuilder";
import { transformRawAds } from "../utils/adTransformers";
import { fetchMessageCounts } from "./useMessageCounter";

export const useAdsQuery = (options: UseAdsQueryOptions = {}) => {
  const { 
    verifiedOnly = false,
    premiumOnly = false, 
    filterOptions = {}, 
    includeMyPendingAds = true,
    skipModeration = true,
    userId = undefined,
    includeMsgCount = true,
  } = options;
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();
  const currentUserId = session?.user?.id;

  // Set up realtime subscription for dating ads
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
    queryKey: ["dating_ads", verifiedOnly, premiumOnly, filterOptions, includeMyPendingAds, skipModeration, currentUserId, userId, includeMsgCount],
    queryFn: async () => {
      // Build and execute the main query
      const adsQuery = buildAdsQuery(supabase, options, currentUserId);
      const { data: fetchedAds, error: fetchError } = await adsQuery.order("created_at", { ascending: false });
      
      if (fetchError) {
        console.error("Error fetching ads:", fetchError);
        throw fetchError;
      }
      
      let allAds = fetchedAds || [];
      
      // If we're on the main page and the user is logged in, include their pending ads separately
      if (includeMyPendingAds && currentUserId && !userId) {
        const pendingAds = await fetchPendingUserAds(supabase, currentUserId);
        
        if (pendingAds && pendingAds.length > 0) {
          // Filter out duplicates
          const pendingAdIds = new Set(pendingAds.map(ad => ad.id));
          const filteredFetchedAds = allAds.filter(ad => !pendingAdIds.has(ad.id));
          allAds = [...filteredFetchedAds, ...pendingAds];
        }
      }
      
      // If includeMsgCount is true, fetch message counts for ALL ads at once - optimization to avoid N+1
      if (includeMsgCount && allAds.length > 0) {
        const adIds = allAds.map(ad => ad.id);
        try {
          // This now uses the optimized batch function instead of processing each message individually
          const messageCounts = await fetchMessageCounts(adIds);
          
          // Apply counts to ads
          allAds = allAds.map(ad => ({
            ...ad,
            message_count: messageCounts[ad.id] || 0
          }));
        } catch (error) {
          console.error("Error in message counting process:", error);
        }
      }
      
      // Transform the raw data to DatingAd format
      return transformRawAds(allAds);
    },
    staleTime: 60000, // 1 minute stale time to prevent frequent refetches
  });
};

// Export the useQuery hook as well for direct access
useAdsQuery.useQuery = useQuery;
