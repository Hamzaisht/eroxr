
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../types";

export function useChatsSurveillance() {
  const { toast } = useToast();
  const session = useSession();

  const fetchChatSessions = useCallback(async () => {
    if (!session?.user?.id) return [];
    
    try {
      const { data: chats, error: chatsError } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:sender_id(
            profiles:id(username, avatar_url)
          ),
          recipient:recipient_id(
            profiles:id(username, avatar_url)
          )
        `)
        .eq('is_expired', false)
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (chatsError) {
        console.error("Error fetching chat sessions:", chatsError);
        return [];
      }
      
      return (chats || []).map((chat: any) => {
        // Safely access nested profile data with proper type checking
        const senderProfile = chat.sender?.profiles?.[0] || {};
        const recipientProfile = chat.recipient?.profiles?.[0] || {};
        
        // Extract username and avatar with null checks
        const senderUsername = senderProfile?.username || 'Unknown';
        const senderAvatar = senderProfile?.avatar_url;
        
        const recipientUsername = recipientProfile?.username || 'Unknown';
        const recipientAvatar = recipientProfile?.avatar_url;
        
        // Determine display data based on message direction
        let displayUsername, displayAvatar;
        
        // For special case where admin is viewing a message they sent
        if (chat.sender_id === session.user.id) {
          displayUsername = `${senderUsername} → ${recipientUsername}`;
          displayAvatar = senderAvatar;
        } else {
          displayUsername = senderUsername;
          displayAvatar = senderAvatar;
        }
        
        return {
          id: chat.id,
          type: 'chat' as const,
          user_id: chat.sender_id,
          username: displayUsername,
          avatar_url: displayAvatar,
          created_at: chat.created_at,
          content: chat.content,
          media_url: chat.media_url || [],
          recipient_id: chat.recipient_id,
          recipient_username: recipientUsername,
          sender_username: senderUsername,
          status: chat.viewed_at ? 'read' : 'unread',
          content_type: chat.message_type,
          message_type: chat.message_source
        };
      });
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      toast({
        title: "Error",
        description: "Could not load active chats",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);

  return { fetchChatSessions };
}
