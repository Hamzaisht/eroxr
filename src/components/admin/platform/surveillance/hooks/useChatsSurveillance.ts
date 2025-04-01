
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../../user-analytics/types";

export function useChatsSurveillance() {
  const session = useSession();
  
  const fetchChats = useCallback(async (): Promise<LiveSession[]> => {
    if (!session?.user?.id) return [];
    
    try {
      // Get recent messages - last 30 mins
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          receiver_id,
          message_type,
          content,
          created_at,
          media_url,
          sender:sender_id (username, avatar_url),
          receiver:receiver_id (username, avatar_url)
        `)
        .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error("Error fetching chat data:", error);
        throw new Error("Failed to load chat data");
      }
      
      if (!data) return [];
      
      // Transform data to match LiveSession format
      return data.map(message => ({
        id: message.id,
        type: 'chat' as const,
        user_id: message.sender_id,
        username: message.sender?.[0]?.username || "Unknown",
        avatar_url: message.sender?.[0]?.avatar_url || null,
        sender_username: message.sender?.[0]?.username || "Unknown",
        recipient_username: message.receiver?.[0]?.username || "Unknown",
        started_at: message.created_at,
        content: message.content,
        content_type: message.message_type,
        sender_profiles: message.sender?.[0],
        receiver_profiles: message.receiver?.[0]
      }));
    } catch (error) {
      console.error("Error in fetchChats:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  return { fetchChats };
}
