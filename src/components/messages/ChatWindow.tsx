
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
import { useRealtimeMessages } from "@/hooks"; // Updated import
import { useChatActions } from "./chat/ChatActions";
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
  const [deliveryStatus, setDeliveryStatus] = useState<Record<string, 'sent' | 'delivered' | 'seen'>>({});
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
      
      const receivedMessages = (data || []).filter(
        msg => msg.recipient_id === session.user.id && !msg.viewed_at
      );
      
      if (receivedMessages.length > 0) {
        await supabase.from('direct_messages')
          .update({ 
            delivery_status: 'delivered',
            viewed_at: document.visibilityState === 'visible' ? new Date().toISOString() : null 
          })
          .in('id', receivedMessages.map(msg => msg.id));
      }
      
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
    if (isGhostMode) return;
    
    const channel = supabase.channel('typing-status')
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id === recipientId && payload.recipient_id === session?.user?.id) {
          setIsTyping(payload.is_typing);
          
          // Auto-clear typing indicator after 5 seconds in case the event is missed
          if (payload.is_typing) {
            setTimeout(() => setIsTyping(false), 5000);
          }
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

  const handleVisibilityChange = async () => {
    if (document.visibilityState === 'visible' && session?.user?.id) {
      const unviewedMessages = messages.filter(
        msg => msg.recipient_id === session.user.id && 
        (msg.delivery_status === 'delivered' || !msg.viewed_at)
      );
      
      if (unviewedMessages.length > 0) {
        await supabase.from('direct_messages')
          .update({ 
            delivery_status: 'seen',
            viewed_at: new Date().toISOString()
          })
          .in('id', unviewedMessages.map(msg => msg.id));
      }
    }
  };

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    if (messages.length > 0 && session?.user?.id) {
      handleVisibilityChange();
    }
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [messages, session?.user?.id]);

  // Track online presence via channels
  useEffect(() => {
    if (!session?.user?.id || isGhostMode) return;
    
    const presenceChannel = supabase.channel('online-presence');
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const presenceState = presenceChannel.presenceState();
        console.log('Online users:', presenceState);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString(),
            status: 'online'
          });
        }
      });
      
    return () => {
      presenceChannel.untrack().then(() => {
        supabase.removeChannel(presenceChannel);
      });
    };
  }, [session?.user?.id, isGhostMode]);

  return (
    <div className="flex flex-col h-full bg-luxury-dark">
      <ChatHeader
        recipientProfile={recipientProfile}
        recipientId={recipientId}
        onVoiceCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onToggleDetails={onToggleDetails}
        isTyping={isTyping}
      />
      
      <MessageList
        messages={messages}
        currentUserId={session?.user?.id}
        recipientProfile={recipientProfile}
        isTyping={isTyping}
      />

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
