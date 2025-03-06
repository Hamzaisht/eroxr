
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
    skipModeration = true, // Always skip moderation checks
    userId = undefined,
    includeMsgCount = true, // New option to include message counts
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
    queryKey: ["dating_ads", verifiedOnly, premiumOnly, filterOptions, includeMyPendingAds, skipModeration, currentUserId, userId, includeMsgCount],
    queryFn: async () => {
      console.log("Query executing with options:", { 
        verifiedOnly, premiumOnly, filterOptions, 
        includeMyPendingAds, skipModeration, currentUserId, userId, includeMsgCount
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
          // Filter out duplicates
          const pendingAdIds = new Set(pendingAds.map(ad => ad.id));
          const filteredFetchedAds = allAds.filter(ad => !pendingAdIds.has(ad.id));
          allAds = [...filteredFetchedAds, ...pendingAds];
        }
      }
      
      // If includeMsgCount is true, fetch message counts for each ad
      if (includeMsgCount && allAds.length > 0) {
        const adIds = allAds.map(ad => ad.id);
        
        try {
          // Simplify the approach to avoid TypeScript and parsing errors
          const { data: messages, error: msgError } = await supabase
            .from('direct_messages')
            .select('id, content, message_type')
            .eq('message_type', 'ad_message');
          
          if (!msgError && messages) {
            console.log("Retrieved messages:", messages.length);
            
            // Count messages per ad
            const messageCounts: Record<string, number> = {};
            
            // Process each message and track the count per ad
            messages.forEach(msg => {
              try {
                // Safety check for content being a string that can be parsed
                if (typeof msg.content === 'string') {
                  const contentObj = JSON.parse(msg.content);
                  const adId = contentObj?.ad_id;
                  
                  // If we found an ad_id and it's in our list of ads
                  if (adId && adIds.includes(adId)) {
                    messageCounts[adId] = (messageCounts[adId] || 0) + 1;
                  }
                }
              } catch (error) {
                // Silently handle parse errors for individual messages
                console.log("Failed to parse message content", error);
              }
            });
            
            // Now apply the counts to each ad
            allAds = allAds.map(ad => ({
              ...ad,
              message_count: messageCounts[ad.id] || 0
            }));
          } else if (msgError) {
            console.error("Error fetching messages:", msgError);
          }
        } catch (error) {
          console.error("Error in message counting process:", error);
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
