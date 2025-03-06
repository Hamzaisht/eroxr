
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@supabase/auth-helpers-react";
import { UseAdsQueryOptions } from "./useAdsQueryTypes";
import { buildAdsQuery, fetchPendingUserAds } from "../utils/adQueryBuilder";
import { transformRawAds } from "../utils/adTransformers";

export const useAdsQuery = (options: UseAdsQueryOptions = {}) => {
  const { 
    verifiedOnly = false,
    premiumOnly = false, 
    filterOptions = {}, 
    includeMyPendingAds = true,
    skipModeration = false,
    userId = undefined
  } = options;
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const session = useSession();
  const currentUserId = session?.user?.id;

  // For debugging
  console.log("useAdsQuery - currentUserId:", currentUserId);
  console.log("useAdsQuery - options:", options);

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
    queryKey: ["dating_ads", verifiedOnly, premiumOnly, filterOptions, includeMyPendingAds, skipModeration, currentUserId, userId],
    queryFn: async () => {
      console.log("Query executing with options:", { 
        verifiedOnly, premiumOnly, filterOptions, 
        includeMyPendingAds, skipModeration, currentUserId, userId 
      });
      
      // Build and execute the main query
      const adsQuery = buildAdsQuery(supabase, options, currentUserId);
      const { data: fetchedAds, error: fetchError } = await adsQuery.order("created_at", { ascending: false });
      
      if (fetchError) {
        console.error("Error fetching ads:", fetchError);
        throw fetchError;
      }
      
      console.log("Fetched ads:", fetchedAds?.length, fetchedAds);
      
      let allAds = fetchedAds || [];
      
      // If we're on the main page and the user is logged in, include their pending ads separately
      if (includeMyPendingAds && currentUserId && !userId) {
        console.log("Fetching user's pending ads");
        const pendingAds = await fetchPendingUserAds(supabase, currentUserId);
        
        if (pendingAds && pendingAds.length > 0) {
          console.log("User's pending ads:", pendingAds.length, pendingAds);
          allAds = [...allAds, ...pendingAds];
        }
      }
      
      // Transform the raw data to DatingAd format
      return transformRawAds(allAds);
    },
    staleTime: 0,
  });
};

// Export the useQuery hook as well for direct access
useAdsQuery.useQuery = useQuery;
