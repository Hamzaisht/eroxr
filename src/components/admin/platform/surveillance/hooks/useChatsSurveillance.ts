
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../types";
import { useDebounce } from "@/hooks/use-debounce";

// Define a type for profile data
type ProfileData = {
  username?: string;
  avatar_url?: string;
  id_verification_status?: string;
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
  message_source?: string;
};

export function useChatsSurveillance() {
  const session = useSession();
  const { toast } = useToast();
  
  const fetchChats = useCallback(async (): Promise<LiveSession[]> => {
    if (!session?.user?.id) return [];
    
    try {
      // Get recent messages - last 60 mins to capture more data
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
          message_source,
          viewed_at,
          original_content,
          sender:profiles!direct_messages_sender_id_fkey (
            username, 
            avatar_url,
            id_verification_status
          ),
          receiver:profiles!direct_messages_recipient_id_fkey (
            username, 
            avatar_url,
            id_verification_status
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
            : `Message from @${senderUsername} to @${recipientUsername}`,
          // Additional metadata for moderation
          metadata: {
            message_source: message.message_source || 'regular',
            viewed_at: message.viewed_at,
            original_content: message.original_content,
            sender_verification: message.sender?.id_verification_status || 'unknown',
            recipient_verification: message.receiver?.id_verification_status || 'unknown'
          }
        };
      });
    } catch (error) {
      console.error("Error in fetchChats:", error);
      toast({
        title: "Error",
        description: "Could not load chat data",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);
  
  return { fetchChats };
}
