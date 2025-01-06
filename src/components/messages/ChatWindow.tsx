import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageInput } from "./MessageInput";
import { MessageBubble } from "./MessageBubble";
import { useVideoRecording } from "./useVideoRecording";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails?: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: messages } = useQuery({
    queryKey: ['chat', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:profiles!direct_messages_sender_id_fkey(username, avatar_url)
        `)
        .or(`and(sender_id.eq.${session?.user?.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session?.user?.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching chat messages:', error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id && !!recipientId,
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert([
          {
            sender_id: session?.user?.id,
            recipient_id: recipientId,
            content,
          },
        ])
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat', recipientId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });

  const { isRecording, startRecording, stopRecording } = useVideoRecording(
    recipientId,
    () => {
      queryClient.invalidateQueries({ queryKey: ['chat', recipientId] });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    }
  );

  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages?.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwnMessage={msg.sender_id === session?.user?.id}
              currentUserId={session?.user?.id}
            />
          ))}
        </div>
      </ScrollArea>
      <MessageInput
        onSendMessage={(message) => sendMessage.mutate(message)}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        isRecording={isRecording}
      />
    </div>
  );
};