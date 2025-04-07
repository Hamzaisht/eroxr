
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
      const { data: messages, error: messagesError } = await supabase
        .from('direct_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          media_url,
          message_type,
          created_at,
          updated_at,
          sender:sender_id(username, avatar_url),
          recipient:recipient_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (messagesError) {
        console.error("Error fetching chat sessions:", messagesError);
        return [];
      }
      
      return (messages || []).map((msg: any) => ({
        id: msg.id,
        type: 'chat' as const,
        user_id: msg.sender_id,
        username: msg.sender?.username || 'Unknown',
        avatar_url: msg.sender?.avatar_url || null,
        created_at: msg.created_at,
        content: msg.content,
        media_url: msg.media_url || [],
        message_type: msg.message_type || 'text',
        status: 'active',
        recipient_id: msg.recipient_id,
        recipient_username: msg.recipient?.username || 'Unknown',
        recipient_avatar: msg.recipient?.avatar_url || null,
        content_type: 'message'
      }));
    } catch (error) {
      console.error("Error fetching chat sessions:", error);
      toast({
        title: "Error",
        description: "Could not load chat sessions",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);

  return { fetchChatSessions };
}
