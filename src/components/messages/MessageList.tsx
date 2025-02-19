
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessagePreview } from "./MessagePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MessageListProps {
  onSelectUser: (userId: string) => void;
  onNewMessage: () => void;
}

export const MessageList = ({ onSelectUser, onNewMessage }: MessageListProps) => {
  const session = useSession();
  useRealtimeMessages(); // Subscribe to all message updates

  const { data: messages, error } = useQuery({
    queryKey: ['messages', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey (
            username,
            avatar_url,
            status
          ),
          recipient:profiles!direct_messages_recipient_id_fkey (
            username,
            avatar_url,
            status
          )
        `)
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const conversationsMap = new Map();
      
      data.forEach(message => {
        const otherUserId = message.sender_id === session.user.id
          ? message.recipient_id
          : message.sender_id;
          
        if (!conversationsMap.has(otherUserId)) {
          conversationsMap.set(otherUserId, message);
        }
      });

      return Array.from(conversationsMap.values());
    },
    enabled: !!session?.user?.id,
    gcTime: 0, // Using gcTime instead of cacheTime
    staleTime: 0
  });

  if (error) {
    console.error('Error fetching messages:', error);
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/5">
        <Button
          onClick={onNewMessage}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Message
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {messages?.map((message) => (
            <MessagePreview
              key={message.id}
              message={message}
              currentUserId={session?.user?.id}
              onClick={() => {
                const otherUserId = message.sender_id === session?.user?.id
                  ? message.recipient_id
                  : message.sender_id;
                onSelectUser(otherUserId || '');
              }}
            />
          ))}
          {!messages?.length && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-white/50 mb-4">No messages yet</p>
              <Button
                onClick={onNewMessage}
                variant="outline"
                className="border-white/10 hover:bg-white/5"
              >
                Start a conversation
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
