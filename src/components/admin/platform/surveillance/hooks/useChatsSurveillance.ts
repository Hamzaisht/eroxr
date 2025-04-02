
import { useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "../types";
import { Profile } from "@/integrations/supabase/types/profile";

export function useChatsSurveillance() {
  const session = useSession();
  const { toast } = useToast();
  
  const fetchChats = useCallback(async (): Promise<LiveSession[]> => {
    if (!session?.user?.id) return [];
    
    try {
      // Get recent messages - last 30 mins to capture recent conversations
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
          sender:sender_id(id, username, avatar_url),
          recipient:recipient_id(id, username, avatar_url)
        `)
        .gte('created_at', new Date(Date.now() - 30 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(30);
      
      if (error) {
        console.error("Error fetching chat data:", error);
        throw new Error("Failed to load chat data");
      }
      
      console.log("Chat data fetched:", data?.length || 0, "messages");
      console.log("Sample message:", data?.[0]);
      
      if (!data || data.length === 0) return [];
      
      // Transform data to match LiveSession format
      return data.map(message => {
        // Ensure media_url is always an array
        const mediaUrls = Array.isArray(message.media_url) ? message.media_url : 
                          message.media_url ? [message.media_url] : [];
        
        // Correctly type the sender and recipient
        const sender = message.sender as Profile | null;
        const recipient = message.recipient as Profile | null;
        
        return {
          id: message.id,
          type: 'chat' as const,
          user_id: message.sender_id || '',
          username: sender?.username || 'Unknown',
          avatar_url: sender?.avatar_url || null,
          sender_username: sender?.username || 'Unknown',
          recipient_username: recipient?.username || 'Unknown',
          recipient_id: message.recipient_id || '',
          started_at: message.created_at || new Date().toISOString(),
          created_at: message.created_at,
          content: message.content || '',
          content_type: message.message_type || '',
          media_url: mediaUrls,
          video_url: message.video_url,
          status: 'active',
          sender_profiles: {
            username: sender?.username || 'Unknown',
            avatar_url: sender?.avatar_url || null
          },
          receiver_profiles: {
            username: recipient?.username || 'Unknown',
            avatar_url: recipient?.avatar_url || null
          },
          title: `Message from @${sender?.username || 'Unknown'} to @${recipient?.username || 'Unknown'}`,
          // Additional metadata for moderation
          metadata: {
            message_source: message.message_source || 'regular',
            viewed_at: message.viewed_at,
            original_content: message.original_content
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
