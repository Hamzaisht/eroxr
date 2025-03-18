
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches and counts messages for each ad
 */
export const fetchMessageCounts = async (adIds: string[]): Promise<Record<string, number>> => {
  if (!adIds.length) return {};
  
  try {
    const { data: messages, error: msgError } = await supabase
      .from('direct_messages')
      .select('id, content, message_type')
      .eq('message_type', 'ad_message');
    
    if (msgError) {
      console.error("Error fetching messages:", msgError);
      return {};
    }
    
    if (!messages) {
      return {};
    }
    
    console.log("Retrieved messages for counting:", messages.length);
    
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
    
    return messageCounts;
  } catch (error) {
    console.error("Error in message counting process:", error);
    return {};
  }
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
