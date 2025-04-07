
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';

export const useRealtimeMessages = (recipientId?: string) => {
  const queryClient = useQueryClient();
  const session = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    // Set up real-time subscription to direct messages
    const messageChannel = supabase
      .channel('messages-subscription')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: recipientId 
            ? `recipient_id=eq.${recipientId} OR sender_id=eq.${recipientId}`
            : undefined
        },
        (payload) => {
          // Immediately update the messages in the cache
          queryClient.invalidateQueries({ queryKey: ['chat'] });
        }
      )
      .subscribe();

    // Set up real-time subscription to typing status
    const typingChannel = supabase.channel('typing-status')
      .on('broadcast', { event: 'typing' }, () => {
        // This will be handled in the ChatWindow component
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [recipientId, queryClient, session?.user?.id]);
};

export const useTypingIndicator = (recipientId: string) => {
  const session = useSession();
  
  const sendTypingStatus = (isTyping: boolean) => {
    if (!session?.user?.id || !recipientId) return;
    
    const channel = supabase.channel('typing-status');
    channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: { 
        user_id: session.user.id, 
        recipient_id: recipientId,
        is_typing: isTyping 
      }
    });
  };
  
  return { sendTypingStatus };
};
