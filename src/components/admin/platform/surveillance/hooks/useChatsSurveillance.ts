
import { useCallback, useState, useEffect } from "react";
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
          sender:profiles!direct_messages_sender_id_fkey(username, avatar_url),
          recipient:profiles!direct_messages_recipient_id_fkey(username, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(30);
        
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

      // Process chats into conversation groups (unique sender-recipient pairs)
      const uniqueChats = new Map();
      
      chats?.forEach(chat => {
        // Create a unique key for each conversation pair (sorted to handle both directions)
        const participants = [chat.sender_id, chat.recipient_id].sort().join(':');
        
        // Only add this conversation if we haven't seen it yet
        if (!uniqueChats.has(participants)) {
          const sender = chat.sender || {};
          const recipient = chat.recipient || {};
          
          uniqueChats.set(participants, {
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
            },
            created_at: chat.created_at
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

  // Set up realtime subscription for new messages
  useEffect(() => {
    const channel = supabase
      .channel('chat-surveillance')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages'
      }, () => {
        // Refresh data when new messages arrive
        fetchChatSessions();
      })
      .subscribe();

    // Initial fetch
    fetchChatSessions();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchChatSessions]);

  return {
    isLoading,
    error,
    sessions,
    fetchChatSessions,
  };
}
