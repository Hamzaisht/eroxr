

import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./chat/ChatHeader";
import { MessageList } from "./chat/MessageList";
import { SnapCamera } from "./chat/SnapCamera";
import { VideoCallDialog } from "./call/VideoCallDialog";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useChatActions } from "./chat/ChatActions";
import { PenSquare } from "lucide-react";
import { useGhostMode } from "@/hooks/useGhostMode";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const [showCamera, setShowCamera] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const { isGhostMode } = useGhostMode();
  
  useRealtimeMessages(recipientId);
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

  useEffect(() => {
    // Skip presence updates and typing indicators if in ghost mode
    if (isGhostMode) return;
    
    const channel = supabase.channel('typing-status')
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id === recipientId && payload.recipient_id === session?.user?.id) {
          setIsTyping(payload.is_typing);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, session?.user?.id, isGhostMode]);

  const handleVoiceCall = () => {
    setIsVideoCall(false);
    setShowCall(true);
  };

  const handleVideoCall = () => {
    setIsVideoCall(true);
    setShowCall(true);
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
      
      <div className="flex-1 overflow-y-auto">
        <MessageList
          messages={messages}
          currentUserId={session?.user?.id}
          recipientProfile={recipientProfile}
        />
        {isTyping && (
          <div className="flex items-center gap-2 px-4 py-2 text-sm text-luxury-neutral/60">
            <PenSquare className="h-4 w-4 animate-pulse" />
            <span>{recipientProfile?.username} is typing...</span>
          </div>
        )}
      </div>

      <MessageInput
        onSendMessage={handleSendMessage}
        onMediaSelect={handleMediaSelect}
        onSnapStart={() => setShowCamera(true)}
        isLoading={isUploading}
        recipientId={recipientId}
      />

      {showCamera && (
        <SnapCamera
          onCapture={handleSnapCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      {showCall && (
        <VideoCallDialog
          isOpen={showCall}
          onClose={() => setShowCall(false)}
          recipientId={recipientId}
          recipientProfile={recipientProfile}
          isVideoEnabled={isVideoCall}
        />
      )}
    </div>
  );
};

