
import { useState, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./chat/ChatHeader";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatInput } from "./chat/ChatInput";
import { useRealtimeMessages } from "@/hooks";
import { Loader2 } from "lucide-react";

interface ChatWindowProps {
  recipientId: string;
  onToggleDetails: () => void;
}

export const ChatWindow = ({ recipientId, onToggleDetails }: ChatWindowProps) => {
  const session = useSession();
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // Subscribe to realtime messages
  useRealtimeMessages();
  
  // Fetch recipient profile
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
  
  // Fetch messages between current user and recipient
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
    gcTime: 0, // Using gcTime instead of cacheTime
    staleTime: 0
  });
  
  const isLoading = profileLoading || messagesLoading;
  
  // Simple typing indicator simulation
  const simulateTypingIndicator = () => {
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Show typing indicator
    setIsTyping(true);
    
    // Hide typing indicator after 3 seconds
    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
    
    setTypingTimeout(timeout);
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);
  
  // Handle sending a message
  const handleSendMessage = async (content: string) => {
    if (!session?.user?.id || !content.trim()) return;
    
    try {
      const message = {
        sender_id: session.user.id,
        recipient_id: recipientId,
        content: content.trim(),
        is_read: false,
      };
      
      await supabase.from('direct_messages').insert(message);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Chat Header */}
      {recipientProfile && (
        <ChatHeader 
          profile={recipientProfile} 
          onToggleDetails={onToggleDetails}
        />
      )}
      
      {/* Messages */}
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
      
      {/* Message Input */}
      <ChatInput 
        onSendMessage={handleSendMessage} 
        onTyping={simulateTypingIndicator}
      />
    </div>
  );
};
