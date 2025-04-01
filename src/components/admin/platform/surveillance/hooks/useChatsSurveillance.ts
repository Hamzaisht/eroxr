
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useChatsSurveillance() {
  const { toast } = useToast();
  const session = useSession();

  const fetchChats = useCallback(async () => {
    if (!session?.user?.id) return [];
    
    try {
      const { data: chats, error: chatsError } = await supabase
        .from('direct_messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          created_at,
          message_type,
          content,
          media_url,
          video_url,
          sender:sender_id(username, avatar_url),
          recipient:recipient_id(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);
        
      if (chatsError) throw chatsError;
      
      const uniqueChats = new Map();
      chats.forEach(chat => {
        const chatKey = `${chat.sender_id}:${chat.recipient_id}`;
        if (!uniqueChats.has(chatKey)) {
          uniqueChats.set(chatKey, {
            id: chatKey,
            type: 'chat' as const,
            user_id: chat.sender_id,
            username: chat.sender && chat.sender[0] ? chat.sender[0].username || 'Unknown' : 'Unknown',
            avatar_url: chat.sender && chat.sender[0] ? chat.sender[0].avatar_url || '' : '',
            recipient_id: chat.recipient_id,
            recipient_username: chat.recipient && chat.recipient[0] ? chat.recipient[0].username || 'Unknown' : 'Unknown',
            recipient_avatar: chat.recipient && chat.recipient[0] ? chat.recipient[0].avatar_url || '' : '',
            started_at: chat.created_at,
            status: 'active',
            content: chat.content,
            media_url: chat.media_url,
            video_url: chat.video_url,
            content_type: chat.message_type,
            created_at: chat.created_at,
          });
        }
      });
      
      return Array.from(uniqueChats.values());
    } catch (error) {
      console.error("Error fetching chats:", error);
      toast({
        title: "Error",
        description: "Could not load live chats",
        variant: "destructive"
      });
      return [];
    }
  }, [session?.user?.id, toast]);

  return { fetchChats };
}
