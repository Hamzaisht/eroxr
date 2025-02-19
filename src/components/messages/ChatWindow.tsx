
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { SnapCamera } from "./chat/SnapCamera";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useChatActions } from "./chat/ChatActions";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  
  // Add real-time subscription for the current chat
  useRealtimeMessages(recipientId);

  // Get chat actions
  const { isUploading, handleSendMessage, handleMediaSelect, handleSnapCapture } = useChatActions({
    recipientId
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['chat', session?.user?.id, recipientId],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${session?.user?.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session?.user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id && !!recipientId,
    staleTime: 0,
    gcTime: 0,
  });

  const { data: recipientProfile } = useQuery({
    queryKey: ['profile', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', recipientId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!recipientId,
  });

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

  return (
    <div className="flex flex-col h-full bg-luxury-dark">
      <ChatHeader
        recipientProfile={recipientProfile}
        recipientId={recipientId}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onToggleDetails={onToggleDetails}
      />
      
      <MessageList
        messages={messages}
        currentUserId={session?.user?.id}
        recipientProfile={recipientProfile}
      />

      <MessageInput
        onSendMessage={handleSendMessage}
        onMediaSelect={handleMediaSelect}
        onSnapStart={() => setShowCamera(true)}
        isLoading={isUploading}
      />

      {showCamera && (
        <SnapCamera
          onCapture={handleSnapCapture}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
};
