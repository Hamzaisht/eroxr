
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../../user-analytics/types";

export function useChatsSurveillance() {
  const session = useSession();
  
  const fetchChats = useCallback(async (): Promise<LiveSession[]> => {
    if (!session?.user?.id) return [];
    
    try {
      // Get recent messages - last 60 mins to capture more data
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          message_type,
          content,
          created_at,
          media_url,
          video_url,
          sender:sender_id (username, avatar_url),
          receiver:recipient_id (username, avatar_url)
        `)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) {
        console.error("Error fetching chat data:", error);
        throw new Error("Failed to load chat data");
      }
      
      console.log("Chat data fetched:", data?.length || 0, "messages");
      
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
        sender_profiles: {
          username: message.sender?.[0]?.username || "Unknown",
          avatar_url: message.sender?.[0]?.avatar_url || null
        },
        receiver_profiles: {
          username: message.receiver?.[0]?.username || "Unknown", 
          avatar_url: message.receiver?.[0]?.avatar_url || null
        },
        media_url: message.media_url || [],
        video_url: message.video_url
      }));
    } catch (error) {
      console.error("Error in fetchChats:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  return { fetchChats };
}
