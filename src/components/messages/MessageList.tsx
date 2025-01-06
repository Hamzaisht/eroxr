import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessagePreview } from "./MessagePreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useMessageSubscription } from "@/hooks/useMessageSubscription";

interface MessageListProps {
  onSelectUser: (userId: string) => void;
}

export const MessageList = ({ onSelectUser }: MessageListProps) => {
  const session = useSession();
  useMessageSubscription(session?.user?.id);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey(username, avatar_url),
          recipient:profiles!direct_messages_recipient_id_fkey(username, avatar_url)
        `)
        .or(`sender_id.eq.${session?.user?.id},recipient_id.eq.${session?.user?.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-4 p-4">
        {messages?.map((message) => (
          <div key={message.id} onClick={() => {
            const otherUserId = message.sender_id === session?.user?.id 
              ? message.recipient_id 
              : message.sender_id;
            onSelectUser(otherUserId);
          }}>
            <MessagePreview 
              message={message}
              currentUserId={session?.user?.id}
            />
          </div>
        ))}
        {messages?.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No messages yet
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
