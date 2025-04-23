
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatInput } from "./chat/ChatInput";
import { useRealtimeMessages } from "@/hooks";
import { Loader2, ChevronLeft } from "lucide-react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const session = useSession();
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('connected');
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  useRealtimeMessages(recipientId);
  
  const { data: recipientProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', recipientId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, status')
        .eq('id', recipientId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!recipientId
  });
  
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['direct-messages', session?.user?.id, recipientId],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session.user.id})`)
        .order('created_at', { ascending: true });
        
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !!recipientId,
    gcTime: 0,
    staleTime: 0
  });
  
  const isLoading = profileLoading || messagesLoading;
  
  // Subscribe to typing indicators
  useEffect(() => {
    if (!recipientId || !session?.user?.id) return;
    
    const channel = supabase.channel('typing-status')
      .on('broadcast', { event: 'typing' }, (payload) => {
        // Check if this typing indicator is from the current recipient to the current user
        if (payload.payload.user_id === recipientId && 
            payload.payload.recipient_id === session.user.id) {
          setIsTyping(payload.payload.is_typing);
          
          // Clear any existing timeout
          if (typingTimeout) {
            clearTimeout(typingTimeout);
          }
          
          // Set a fallback timeout to clear the typing indicator
          if (payload.payload.is_typing) {
            const timeout = setTimeout(() => {
              setIsTyping(false);
            }, 5000);
            setTypingTimeout(timeout);
          }
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
        } else if (status === 'CLOSED') {
          setConnectionStatus('disconnected');
        }
      });
    
    // Monitor connection status
    const connectionMonitor = setInterval(() => {
      if (connectionStatus === 'disconnected') {
        channel.subscribe();
        setConnectionStatus('reconnecting');
      }
    }, 5000);
    
    return () => {
      supabase.removeChannel(channel);
      clearInterval(connectionMonitor);
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [recipientId, session?.user?.id, typingTimeout, connectionStatus]);
  
  // Monitor unread messages and mark them as seen
  useEffect(() => {
    if (!session?.user?.id || !recipientId || !messages?.length) return;
    
    const unreadMessages = messages.filter(
      msg => msg.recipient_id === session.user.id && !msg.viewed_at
    );
    
    if (unreadMessages.length > 0) {
      // Mark messages as seen
      const updatePromises = unreadMessages.map(msg => 
        supabase
          .from('direct_messages')
          .update({ 
            viewed_at: new Date().toISOString(),
            delivery_status: 'seen'
          })
          .eq('id', msg.id)
      );
      
      Promise.all(updatePromises)
        .then(() => {
          // Invalidate queries to update UI
          queryClient.invalidateQueries({ queryKey: ['direct-messages'] });
        })
        .catch(err => {
          console.error("Error marking messages as seen:", err);
        });
    }
  }, [messages, recipientId, session?.user?.id, queryClient]);
  
  const simulateTypingIndicator = () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    setIsTyping(true);
    
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
    
    setTypingTimeout(timeout);
  };
  
  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id || !content.trim()) return;
    
    try {
      const message = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        content: content.trim(),
        message_type: 'text',
        delivery_status: 'sent',
        created_at: new Date().toISOString(),
      };
      
      await supabase.from('direct_messages').insert(message);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };
  
  const handleGoBack = () => {
    navigate('/messages');
  };
  
  const handleVoiceCall = () => {
    toast({
      description: "Voice call feature will be implemented soon"
    });
  };
  
  const handleVideoCall = () => {
    toast({
      description: "Video call feature will be implemented soon"
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      {connectionStatus === 'reconnecting' && (
        <div className="absolute top-0 left-0 right-0 bg-amber-500/80 text-black px-4 py-1 text-xs text-center">
          Reconnecting...
        </div>
      )}
      
      {connectionStatus === 'disconnected' && (
        <div className="absolute top-0 left-0 right-0 bg-red-500/80 text-white px-4 py-1 text-xs text-center">
          Disconnected. Trying to reconnect...
        </div>
      )}
      
      {recipientProfile && (
        <ChatHeader 
          recipientProfile={recipientProfile} 
          recipientId={recipientId}
          onVoiceCall={handleVoiceCall}
          onVideoCall={handleVideoCall}
          onToggleDetails={onToggleDetails}
          isTyping={isTyping}
          onBack={isMobile ? handleGoBack : undefined}
        />
      )}
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-white/50" />
        </div>
      ) : (
        <ChatMessageList
          messages={messages || []}
          currentUserId={session?.user?.id}
          recipientProfile={recipientProfile}
          isTyping={isTyping}
        />
      )}
      
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onTyping={simulateTypingIndicator}
        recipientId={recipientId}
      />
    </div>
  );
};
