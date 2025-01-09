import { useState, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { MessageInput } from "./MessageInput";
import { useVideoRecording } from "./useVideoRecording";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DirectMessage } from "@/integrations/supabase/types/message";
import { Button } from "@/components/ui/button";
import { PhoneCall, Video } from "lucide-react";
import { AvailabilityIndicator } from "@/components/ui/availability-indicator";
import { usePresence } from "@/components/profile/avatar/usePresence";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [recipientProfile, setRecipientProfile] = useState<any>(null);
  const session = useSession();
  const { toast } = useToast();
  const { isRecording, startRecording, stopRecording } = useVideoRecording(recipientId, () => {
    toast({
      title: "Success",
      description: "Video message sent successfully",
    });
  });

  // Get recipient's presence status
  const { availability, lastActive } = usePresence(recipientId, false);

  const handleVoiceCall = () => {
    toast({
      title: "Starting voice call...",
      description: "This feature is coming soon!",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Starting video call...",
      description: "This feature is coming soon!",
    });
  };

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
    const fetchRecipientProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();

      if (!error && data) {
        setRecipientProfile(data);
      }
    };

    fetchRecipientProfile();
  }, [recipientId]);

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
      {/* Header with profile, status and call buttons */}
      <div className="flex items-center justify-between p-4 border-b border-luxury-neutral/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={recipientProfile?.avatar_url} />
              <AvatarFallback>{recipientProfile?.username?.[0]?.toUpperCase() || '?'}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1">
              <AvailabilityIndicator status={availability} size={10} />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{recipientProfile?.username}</span>
            <span className="text-xs text-luxury-neutral/70">
              {availability === 'offline' && lastActive 
                ? `Last seen ${formatDistanceToNow(new Date(lastActive), { addSuffix: true })}` 
                : availability}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-luxury-neutral/10"
            onClick={handleVoiceCall}
          >
            <PhoneCall className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-luxury-neutral/10"
            onClick={handleVideoCall}
          >
            <Video className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwnMessage={message.sender_id === session?.user?.id}
            currentUserId={session?.user?.id}
            profile={recipientProfile}
          />
        ))}
      </div>

      {/* Input area */}
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
