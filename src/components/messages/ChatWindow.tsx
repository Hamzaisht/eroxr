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
import { useRealtimeMessages, useTypingIndicator } from "@/hooks";
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

  const handleSnapCapture = async (blob: Blob) => {
    try {
      // Convert blob to data URL for proper handling
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      
      reader.onloadend = async () => {
        const dataURL = reader.result as string;
        
        // Continue with the existing logic using dataURL
        if (!session?.user?.id || !recipientId) return;
    
        setIsUploading(true);
    
        // Upload to storage
        const userId = session.user.id;
        const fileName = `snap_${Date.now()}.jpg`;
        const path = `${userId}/messages/${fileName}`;
    
        const { data, error } = await supabase.storage
          .from('messages')
          .upload(path, dataURLToBlob(dataURL), {
            contentType: 'image/jpeg',
          });
    
        if (error) {
          console.error('Error uploading snap:', error);
          toast({
            title: 'Upload failed',
            description: 'Failed to upload snap. Please try again.',
            variant: 'destructive',
          });
          setIsUploading(false);
          return;
        }
    
        // Get public URL
        const { data: publicURL } = supabase.storage
          .from('messages')
          .getPublicUrl(path);
    
        if (publicURL && publicURL.publicUrl) {
          await handleSendMessage({
            media: [publicURL.publicUrl],
            message: '',
            messageType: 'snap',
          });
        }
    
        setIsUploading(false);
      };
    } catch (error) {
      console.error('Error processing snap:', error);
      toast({
        title: 'Snap failed',
        description: 'Failed to process snap. Please try again.',
        variant: 'destructive',
      });
      setIsUploading(false);
    }
  };

  const dataURLToBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  };

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
