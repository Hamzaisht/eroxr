
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

/**
 * Fetches and counts messages for each ad - optimized to use a single query
 */
export const fetchMessageCounts = async (adIds: string[]): Promise<Record<string, number>> => {
  if (!adIds.length) return {};
  
  // Initialize counts object for all requested ads (to ensure we return values for all)
  const messageCounts: Record<string, number> = {};
  adIds.forEach(id => {
    messageCounts[id] = 0;
  });
  
  try {
    const { data: messages, error: msgError } = await supabase
      .from('direct_messages')
      .select('id, content, message_type')
      .eq('message_type', 'ad_message');
    
    if (msgError) {
      console.error("Error fetching messages:", msgError);
      return messageCounts;
    }
    
    if (!messages || !messages.length) {
      return messageCounts;
    }
    
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
      }
    });
    
    return messageCounts;
  } catch (error) {
    console.error("Error in message counting process:", error);
    return messageCounts;
  }
};

/**
 * Hook to get message counts with caching
 */
export const useMessageCounts = (adIds: string[]) => {
  const queryClient = useQueryClient();
  
  // Setup realtime subscription for messages
  useEffect(() => {
    const channel = supabase
      .channel('public:direct_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: "message_type=eq.ad_message"
        },
        () => {
          // Invalidate the query when messages change
          queryClient.invalidateQueries({ queryKey: ['message_counts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['message_counts', adIds],
    queryFn: () => fetchMessageCounts(adIds),
    staleTime: 60000, // 1 minute
    enabled: adIds.length > 0
  });
};

/**
 * Applies message counts to the ads
 */
export const applyMessageCounts = (ads: any[], messageCounts: Record<string, number>) => {
  return ads.map(ad => ({
    ...ad,
    message_count: messageCounts[ad.id] || 0
  }));
};
