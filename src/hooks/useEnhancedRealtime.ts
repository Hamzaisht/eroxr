
import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { DirectMessage } from '@/integrations/supabase/types/message';

type TypingStatus = {
  [userId: string]: boolean;
};

export function useEnhancedRealtime(recipientId?: string) {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [typingUsers, setTypingUsers] = useState<TypingStatus>({});
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  
  // Listen for typing indicators
  useEffect(() => {
    if (!session?.user?.id || !recipientId) return;
    
    const channel = supabase
      .channel(`typing:${session.user.id}:${recipientId}`)
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload && payload.payload.user_id === recipientId) {
          setTypingUsers(prev => ({
            ...prev,
            [recipientId]: payload.payload.is_typing
          }));
          
          // Auto-clear typing indicator after 3 seconds
          setTimeout(() => {
            setTypingUsers(prev => ({
              ...prev,
              [recipientId]: false
            }));
          }, 3000);
        }
      })
      .subscribe((status) => {
        console.log(`Typing channel status: ${status}`);
        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
        } else if (status === 'CHANNEL_ERROR') {
          setConnectionStatus('disconnected');
        } else {
          setConnectionStatus('connecting');
        }
      });
      
    return () => {
      channel.unsubscribe();
    };
  }, [session?.user?.id, recipientId]);
  
  // Enhanced message listener with error handling
  useEffect(() => {
    if (!session?.user?.id) return;
    
    let retryCount = 0;
    const maxRetries = 3;
    
    const setupMessageChannel = () => {
      // Listen for any new messages that involve the current user
      const messageChannel = supabase
        .channel('enhanced-messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: recipientId 
            ? `or(and(recipient_id=eq.${session.user.id},sender_id=eq.${recipientId}),and(sender_id=eq.${session.user.id},recipient_id=eq.${recipientId}))`
            : `or(recipient_id=eq.${session.user.id},sender_id=eq.${session.user.id})`
        }, (payload) => {
          // Process new message
          const newMessage = payload.new as DirectMessage;
          
          // Invalidate messages queries
          if (recipientId && (newMessage.sender_id === recipientId || newMessage.recipient_id === recipientId)) {
            queryClient.invalidateQueries({
              queryKey: ['chat', session.user.id, recipientId]
            });
          }
          
          // Show notification for received messages
          if (newMessage.sender_id === recipientId && newMessage.recipient_id === session.user.id) {
            // Mark as delivered
            markAsDelivered(newMessage.id);
          }
          
          // Always invalidate the conversation list
          queryClient.invalidateQueries({
            queryKey: ['conversations', session.user.id]
          });
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: recipientId 
            ? `or(and(recipient_id=eq.${session.user.id},sender_id=eq.${recipientId}),and(sender_id=eq.${session.user.id},recipient_id=eq.${recipientId}))`
            : `or(recipient_id=eq.${session.user.id},sender_id=eq.${session.user.id})`
        }, () => {
          // Same invalidation as for inserts
          if (recipientId) {
            queryClient.invalidateQueries({
              queryKey: ['chat', session.user.id, recipientId]
            });
          }
          queryClient.invalidateQueries({
            queryKey: ['conversations', session.user.id]
          });
        })
        .subscribe((status) => {
          console.log(`Enhanced messages channel status: ${status}`);
          if (status === 'SUBSCRIBED') {
            setConnectionStatus('connected');
            retryCount = 0; // Reset retry count on successful connection
          } else if (status === 'CHANNEL_ERROR') {
            setConnectionStatus('disconnected');
            
            // Attempt reconnection with exponential backoff
            if (retryCount < maxRetries) {
              const delay = Math.pow(2, retryCount) * 1000;
              retryCount++;
              
              setTimeout(() => {
                console.log(`Attempting to reconnect (try ${retryCount})...`);
                supabase.removeChannel(messageChannel);
                setupMessageChannel();
              }, delay);
            } else {
              toast({
                title: "Connection issue",
                description: "Failed to connect to message service. Please refresh.",
                variant: "destructive"
              });
            }
          }
        });
        
      return messageChannel;
    };
    
    // Mark received messages as delivered
    const markAsDelivered = async (messageId?: string) => {
      try {
        const query = supabase
          .from('direct_messages')
          .update({ delivery_status: 'delivered' })
          .eq('recipient_id', session.user.id)
          .is('viewed_at', null)
          .neq('delivery_status', 'seen');
          
        if (messageId) {
          query.eq('id', messageId);
        } else if (recipientId) {
          query.eq('sender_id', recipientId);
        }
        
        await query;
      } catch (error) {
        console.error('Error marking messages as delivered:', error);
      }
    };
    
    if (recipientId) {
      markAsDelivered();
    }
    
    const messageChannel = setupMessageChannel();
      
    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [session?.user?.id, recipientId, queryClient, toast]);
  
  // Return values and functions
  return {
    isTyping: recipientId ? typingUsers[recipientId] || false : false,
    connectionStatus,
    markAllAsSeen: async () => {
      if (!session?.user?.id || !recipientId) return;
      
      try {
        await supabase
          .from('direct_messages')
          .update({
            delivery_status: 'seen',
            viewed_at: new Date().toISOString()
          })
          .eq('sender_id', recipientId)
          .eq('recipient_id', session.user.id)
          .is('viewed_at', null);
          
        // Invalidate queries to reflect the changes
        queryClient.invalidateQueries({
          queryKey: ['chat', session.user.id, recipientId]
        });
        
        queryClient.invalidateQueries({
          queryKey: ['conversations', session.user.id]
        });
      } catch (error) {
        console.error('Error marking messages as seen:', error);
      }
    }
  };
}
