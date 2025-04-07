
import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import { useMessageAudit } from './useMessageAudit';

/**
 * Hook to subscribe to realtime message updates and sync with query cache
 * @param recipientId Optional: Specific recipient to filter updates for
 */
export const useRealtimeMessages = (recipientId?: string) => {
  const queryClient = useQueryClient();
  const session = useSession();
  const userId = session?.user?.id;
  const { logMessageActivity } = useMessageAudit();

  useEffect(() => {
    if (!userId) return;

    // Prepare filter based on whether we want all messages or just ones with a specific recipient
    const filter = recipientId 
      ? `(sender_id=eq.${userId} AND recipient_id=eq.${recipientId}) OR (sender_id=eq.${recipientId} AND recipient_id=eq.${userId})`
      : `recipient_id=eq.${userId} OR sender_id=eq.${userId}`;
    
    // Subscribe to all relevant message changes
    const channel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'direct_messages',
          filter: filter,
        },
        (payload) => {
          // Log activity for audit purposes
          const eventType = payload.eventType;
          const messageData = payload.new || payload.old;
          
          if (messageData) {
            logMessageActivity(`${eventType.toLowerCase()}`, messageData);
          }
          
          // Update query cache based on the event type
          const isSpecificChat = !!recipientId;
          const chatQueryKey = isSpecificChat 
            ? ['chat', userId, recipientId]
            : ['messages', userId];
          
          // Invalidate the relevant queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: chatQueryKey });
          
          if (!isSpecificChat) {
            // Also invalidate general messages list if this is not a specific chat update
            queryClient.invalidateQueries({ queryKey: ['messages'] });
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, recipientId, queryClient, logMessageActivity]);

  // Send typing status to other users
  const sendTypingStatus = useCallback((isTyping: boolean, targetRecipientId?: string) => {
    if (!userId || !targetRecipientId) return;
    
    supabase.channel('typing-status')
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: userId,
          recipient_id: targetRecipientId,
          is_typing: isTyping,
          timestamp: new Date().toISOString()
        }
      })
      .catch(error => {
        console.error('Error sending typing status:', error);
      });
  }, [userId]);

  return { sendTypingStatus };
};

// Export other hooks individually instead of re-exporting them here
