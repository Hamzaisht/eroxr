
import { useCallback, useState } from "react";
import { LiveSession } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useChatsSurveillance() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const { toast } = useToast();

  const fetchChatSessions = useCallback(async (): Promise<LiveSession[]> => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch real direct messages from Supabase
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
        
      if (chatsError) {
        console.error("Error fetching chat sessions:", chatsError);
        setError('Failed to fetch chat sessions');
        toast({
          title: "Error",
          description: "Failed to fetch chat sessions",
          variant: "destructive"
        });
        return [];
      }

      // Process chats into conversation groups
      const uniqueChats = new Map();
      
      chats.forEach(chat => {
        const chatKey = `${chat.sender_id}:${chat.recipient_id}`;
        const reverseKey = `${chat.recipient_id}:${chat.sender_id}`;
        
        // Only add this conversation if we haven't seen it yet
        if (!uniqueChats.has(chatKey) && !uniqueChats.has(reverseKey)) {
          const sender = chat.sender?.[0] || {};
          const recipient = chat.recipient?.[0] || {};
          
          uniqueChats.set(chatKey, {
            id: chat.id,
            type: 'chat',
            user_id: chat.sender_id,
            username: sender.username || 'Unknown',
            avatar_url: sender.avatar_url || null,
            started_at: chat.created_at,
            status: 'active',
            title: `Chat between ${sender.username || 'Unknown'} and ${recipient.username || 'Unknown'}`,
            content: chat.content || "No content",
            media_url: Array.isArray(chat.media_url) ? chat.media_url : chat.media_url ? [chat.media_url] : [],
            recipient_id: chat.recipient_id,
            recipient_username: recipient.username || 'Unknown',
            sender_username: sender.username || 'Unknown',
            sender_profiles: {
              username: sender.username || 'Unknown',
              avatar_url: sender.avatar_url || null
            },
            receiver_profiles: {
              username: recipient.username || 'Unknown',
              avatar_url: recipient.avatar_url || null
            }
          });
        }
      });

      const chatSessions = Array.from(uniqueChats.values());
      setSessions(chatSessions);
      return chatSessions;
    } catch (err) {
      console.error("Error fetching chat sessions:", err);
      setError('An error occurred while fetching chat data');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    isLoading,
    error,
    sessions,
    fetchChatSessions,
  };
}
