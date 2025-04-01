
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
      // Added logging to debug the issue
      console.log("Fetching chats for surveillance...");
      
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
          sender:profiles!direct_messages_sender_id_fkey (
            username, 
            avatar_url
          ),
          receiver:profiles!direct_messages_recipient_id_fkey (
            username, 
            avatar_url
          )
        `)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100); // Increased limit to make sure we capture all recent messages
      
      if (error) {
        console.error("Error fetching chat data:", error);
        throw new Error("Failed to load chat data");
      }
      
      console.log("Chat data fetched:", data?.length || 0, "messages");
      console.log("Sample message data:", data?.[0] || "No messages found");
      
      if (!data || data.length === 0) return [];
      
      // Transform data to match LiveSession format
      return data.map(message => {
        // Handle case where sender and receiver are the same user
        const isSelfMessage = message.sender_id === message.recipient_id;
        
        return {
          id: message.id,
          type: 'chat' as const,
          user_id: message.sender_id,
          username: message.sender?.username || "Unknown",
          avatar_url: message.sender?.avatar_url || null,
          sender_username: message.sender?.username || "Unknown",
          recipient_username: message.receiver?.username || "Unknown",
          started_at: message.created_at,
          content: message.content,
          content_type: message.message_type,
          media_url: message.media_url || [],
          video_url: message.video_url,
          sender_profiles: {
            username: message.sender?.username || "Unknown",
            avatar_url: message.sender?.avatar_url || null
          },
          receiver_profiles: {
            username: message.receiver?.username || "Unknown", 
            avatar_url: message.receiver?.avatar_url || null
          },
          about_me: isSelfMessage ? "Note to self" : undefined,
          title: isSelfMessage 
            ? `Self message from @${message.sender?.username || "Unknown"}` 
            : `Message from @${message.sender?.username || "Unknown"} to @${message.receiver?.username || "Unknown"}`
        };
      });
    } catch (error) {
      console.error("Error in fetchChats:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  return { fetchChats };
}
