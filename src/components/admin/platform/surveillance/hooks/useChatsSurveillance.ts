
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../types";

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
          original_content
        `)
        .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(100);
      
      if (error) {
        console.error("Error fetching chat data:", error);
        throw new Error("Failed to load chat data");
      }
      
      console.log("Chat data fetched:", data?.length || 0, "messages");
      
      if (!data || data.length === 0) return [];
      
      // Get all user IDs from chat messages
      const userIds = new Set<string>();
      data.forEach(message => {
        if (message.sender_id) userIds.add(message.sender_id);
        if (message.recipient_id) userIds.add(message.recipient_id);
      });
      
      // Fetch profiles for all users involved in chats
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, id_verification_status')
        .in('id', Array.from(userIds));
      
      if (profilesError) {
        console.warn("Could not fetch profiles for chat users:", profilesError);
      }
      
      // Create a lookup map for profiles
      const profilesMap = (profiles || []).reduce((acc, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
      
      // Transform data to match LiveSession format
      return data.map(message => {
        // Handle case where sender and receiver are the same user
        const isSelfMessage = message.sender_id === message.recipient_id;
        
        // Get profile data from the map
        const senderProfile = message.sender_id ? profilesMap[message.sender_id] : null;
        const recipientProfile = message.recipient_id ? profilesMap[message.recipient_id] : null;
        
        // Extract usernames with fallbacks
        const senderUsername = senderProfile?.username || "Unknown";
        const senderAvatar = senderProfile?.avatar_url || null;
        const recipientUsername = recipientProfile?.username || "Unknown";
        const recipientAvatar = recipientProfile?.avatar_url || null;
        
        // Ensure started_at is always present
        const startedAt = message.created_at || new Date().toISOString();
        
        // Ensure media_url is always an array
        const mediaUrls = Array.isArray(message.media_url) ? message.media_url : 
                          message.media_url ? [message.media_url] : [];
        
        return {
          id: message.id,
          type: 'chat' as const,
          user_id: message.sender_id || '',
          username: senderUsername,
          avatar_url: senderAvatar,
          sender_username: senderUsername,
          recipient_username: recipientUsername,
          started_at: startedAt,
          content: message.content || '',
          content_type: message.message_type || '',
          media_url: mediaUrls,
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
            sender_verification: senderProfile?.id_verification_status || 'unknown',
            recipient_verification: recipientProfile?.id_verification_status || 'unknown'
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
