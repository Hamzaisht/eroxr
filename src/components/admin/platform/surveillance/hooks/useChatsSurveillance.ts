
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../../user-analytics/types";
import { WithProfile } from "@/integrations/supabase/types/profile";

// Define a type for profile data
type ProfileData = {
  username?: string;
  avatar_url?: string;
};

// Define the direct message type with proper typing
type DirectMessage = {
  id: string;
  sender_id: string;
  recipient_id: string;
  message_type: string;
  content: string;
  created_at: string;
  media_url?: string[] | null;
  video_url?: string | null;
  sender?: ProfileData;
  receiver?: ProfileData;
};

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
        .limit(100) as unknown as { data: DirectMessage[]; error: any };
      
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
        
        // Safely access profile data with proper fallbacks
        const senderUsername = message.sender?.username || "Unknown";
        const senderAvatar = message.sender?.avatar_url || null;
        const recipientUsername = message.receiver?.username || "Unknown";
        const recipientAvatar = message.receiver?.avatar_url || null;
        
        // Ensure started_at is always present
        const startedAt = message.created_at || new Date().toISOString();
        
        // Ensure media_url is always an array
        const mediaUrls = Array.isArray(message.media_url) ? message.media_url : 
                          message.media_url ? [message.media_url] : [];
        
        return {
          id: message.id,
          type: 'chat' as const,
          user_id: message.sender_id,
          username: senderUsername,
          avatar_url: senderAvatar,
          sender_username: senderUsername,
          recipient_username: recipientUsername,
          started_at: startedAt, // Ensure required field is present
          content: message.content,
          content_type: message.message_type,
          media_url: mediaUrls, // Always use an array
          video_url: message.video_url,
          sender_profiles: {
            username: senderUsername,
            avatar_url: senderAvatar
          },
          receiver_profiles: {
            username: recipientUsername,
            avatar_url: recipientAvatar
          },
          about_me: isSelfMessage ? "Note to self" : undefined,
          title: isSelfMessage 
            ? `Self message from @${senderUsername}` 
            : `Message from @${senderUsername} to @${recipientUsername}`
        };
      });
    } catch (error) {
      console.error("Error in fetchChats:", error);
      return [];
    }
  }, [session?.user?.id]);
  
  return { fetchChats };
}
