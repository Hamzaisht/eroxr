
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessageList } from './chat/ChatMessageList';
import { DirectMessage } from '@/integrations/supabase/types/message';
import { ConnectionIndicator } from './chat/ConnectionIndicator';
import { ErrorComponent } from '@/components/ErrorComponent';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { useChatActions } from './chat/ChatActions';

interface ChatWindowProps {
  recipient: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  onToggleDetails: () => void;
  onClose: () => void;
}

export const ChatWindow = ({ recipient, onToggleDetails, onClose }: ChatWindowProps) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { isTyping, connectionStatus, markAllAsSeen, sendTypingStatus } = useRealtimeChat(recipient.id);
  const { handleSendMessage, resendMessage, isUploading } = useChatActions({ recipientId: recipient.id });
  const [sendError, setSendError] = useState<string | null>(null);
  
  // Get chat messages
  const { 
    data: messages = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['chat', session?.user?.id, recipient.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      try {
        console.log('Fetching messages for chat with:', recipient.username);
        const { data, error } = await supabase
          .from('direct_messages')
          .select('*')
          .or(`and(sender_id.eq.${session.user.id},recipient_id.eq.${recipient.id}),and(sender_id.eq.${recipient.id},recipient_id.eq.${session.user.id})`)
          .order('created_at', { ascending: true });
          
        if (error) throw error;
        
        console.log('Fetched messages:', data?.length || 0);
        return data as DirectMessage[];
      } catch (err) {
        console.error('Error fetching messages:', err);
        throw err;
      }
    },
    enabled: !!session?.user?.id && !!recipient.id,
    refetchOnWindowFocus: true,
    staleTime: 30000, // 30 seconds
  });

  // Mark messages as seen when user views them
  useEffect(() => {
    if (messages && messages.length > 0) {
      // Mark messages as seen after a short delay
      const timer = setTimeout(() => {
        console.log('Marking messages as seen');
        markAllAsSeen();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [messages, markAllAsSeen]);
  
  const handleSend = async (content: string) => {
    setSendError(null);
    console.log('Sending message:', content.substring(0, 20) + '...');
    
    try {
      const result = await handleSendMessage(content);
      if (!result?.success) {
        setSendError(result?.error || 'Failed to send message');
      }
    } catch (error: any) {
      console.error('Error in send handler:', error);
      setSendError(error.message || 'Failed to send message');
    }
  };

  const handleTyping = () => {
    sendTypingStatus(true);
  };
  
  const handleRetry = async (message: DirectMessage) => {
    try {
      setSendError(null);
      console.log('Retrying message:', message.id);
      const result = await resendMessage(message);
      return result.success;
    } catch (error: any) {
      console.error('Error resending message:', error);
      setSendError(error.message || 'Failed to resend message');
      return false;
    }
  };
  
  // Convert recipient object to profile format expected by ChatMessageList
  const recipientProfile = {
    username: recipient.username,
    avatar_url: recipient.avatar_url,
    online_status: 'unknown' // This would ideally come from a real-time presence system
  };
  
  return (
    <div className="flex flex-col h-full bg-luxury-dark">
      {/* Header */}
      <ChatHeader 
        username={recipient.username}
        avatarUrl={recipient.avatar_url}
        onInfoClick={onToggleDetails} 
        onBack={onClose}
      />
      
      {/* Connection status indicator */}
      {connectionStatus !== 'connected' && (
        <ConnectionIndicator 
          status={connectionStatus} 
          className="mx-4 mt-2" 
        />
      )}
      
      {/* Error display */}
      {sendError && (
        <div className="mx-4 mt-2">
          <ErrorComponent 
            message={sendError} 
            onRetry={() => setSendError(null)} 
          />
        </div>
      )}
      
      {/* Messages */}
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-luxury-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-luxury-neutral/80">Loading messages...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="flex-1 flex items-center justify-center p-4">
          <ErrorComponent 
            message={(error as Error)?.message || "Failed to load messages"}
            onRetry={() => refetch()}
          />
        </div>
      ) : (
        <ChatMessageList
          messages={messages}
          currentUserId={session?.user?.id || ''}
          recipientProfile={recipientProfile}
          isTyping={isTyping}
          onRetry={handleRetry}
        />
      )}
      
      {/* Input Area */}
      <div className="p-3 border-t border-luxury-neutral/20">
        <ChatInput 
          onSendMessage={handleSend} 
          onTyping={handleTyping} 
          recipientId={recipient.id} 
          onMessageError={setSendError}
        />
      </div>
    </div>
  );
};
