import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessagePreview } from "./MessagePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface MessageListProps {
  onSelectUser: (userId: string) => void;
}

export const MessageList = ({ onSelectUser }: MessageListProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!session?.user?.id) return;

    const channel = supabase
      .channel('public:direct_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${session.user.id}`
        },
        (payload) => {
          console.log("Received message update:", payload);
          queryClient.invalidateQueries({ queryKey: ['messages', session.user.id] });

          if (payload.eventType === 'INSERT') {
            toast({
              title: "New message",
              description: "You have received a new message!",
              duration: 3000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient, toast]);

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
            avatar_url
          ),
          recipient:profiles!direct_messages_recipient_id_fkey (
            username,
            avatar_url
          )
        `)
        .or(`sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!session?.user?.id,
    staleTime: 0,
  });

  if (error) {
    console.error('Error fetching messages:', error);
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-2 p-4">
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
          <p className="text-center text-muted-foreground py-8">
            No messages yet. Start a conversation!
          </p>
        )}
      </div>
    </ScrollArea>
  );
};