import { useState, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useVideoRecording } from "./useVideoRecording";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const session = useSession();
  const { toast } = useToast();
  const { isRecording, startRecording, stopRecording } = useVideoRecording(recipientId, () => {
    toast({
      title: "Success",
      description: "Video message sent successfully",
    });
  });

  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id) return;

    const { error } = await supabase
      .from('direct_messages')
      .insert([{
        sender_id: session.user.id,
        recipient_id: recipientId,
        content,
        message_type: 'text'
      }]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const handleMediaSelect = async (files: FileList) => {
    if (!session?.user?.id) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('messages')
        .upload(fileName, file);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Failed to upload media",
          variant: "destructive",
        });
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('messages')
        .getPublicUrl(fileName);

      const { error: messageError } = await supabase
        .from('direct_messages')
        .insert([{
          sender_id: session.user.id,
          recipient_id: recipientId,
          media_url: [publicUrl],
          message_type: file.type.startsWith('image/') ? 'image' : 'video'
        }]);

      if (messageError) {
        toast({
          title: "Error",
          description: "Failed to send media message",
          variant: "destructive",
        });
      }
    }
  };

  const handleSnapStart = () => {
    // Start camera preview
    // This will be implemented in a separate component
  };

  const handleSnapEnd = () => {
    // Stop camera preview and send snap
    // This will be implemented in a separate component
  };

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`sender_id.eq.${session?.user?.id},recipient_id.eq.${session?.user?.id}`)
        .order('created_at', { ascending: true });

      if (!error && data) {
        setMessages(data);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: `sender_id=eq.${session?.user?.id},recipient_id=eq.${recipientId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as DirectMessage]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, recipientId]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === session?.user?.id}
            currentUserId={session?.user?.id}
          />
        ))}
      </div>
      <MessageInput
        onSendMessage={handleSendMessage}
        onStartRecording={startRecording}
        onStopRecording={stopRecording}
        isRecording={isRecording}
        onMediaSelect={handleMediaSelect}
        onSnapStart={handleSnapStart}
        onSnapEnd={handleSnapEnd}
      />
    </div>
  );
};