
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { DirectMessage } from '@/integrations/supabase/types/message';

export function useRealtimeChat(recipientId?: string) {
  const session = useSession();
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const { toast } = useToast();
  
  // Set up realtime subscription for messages
  useEffect(() => {
    if (!session?.user?.id) return;
    
    console.log('Setting up realtime chat with recipient:', recipientId);
    
    // Create a single channel for all message-related events
    const channel = supabase
      .channel(`chat-${session.user.id}-${recipientId || 'all'}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: recipientId 
          ? `or(and(recipient_id=eq.${session.user.id},sender_id=eq.${recipientId}),and(sender_id=eq.${session.user.id},recipient_id=eq.${recipientId}))`
          : `or(recipient_id=eq.${session.user.id},sender_id=eq.${session.user.id})`
      }, (payload) => {
        console.log('New message received:', payload);
        
        // Handle new message
        const newMessage = payload.new as DirectMessage;
        
        // Mark incoming messages as delivered
        if (newMessage.sender_id !== session.user.id) {
          markAsDelivered(newMessage.id);
        }
        
        // Invalidate relevant queries
        if (recipientId) {
          queryClient.invalidateQueries({
            queryKey: ['chat', session.user.id, recipientId]
          });
        }
        
        // Always invalidate the conversations list
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
      }, (payload) => {
        console.log('Message updated:', payload);
        
        if (recipientId) {
          queryClient.invalidateQueries({
            queryKey: ['chat', session.user.id, recipientId]
          });
        }
        
        queryClient.invalidateQueries({
          queryKey: ['conversations', session.user.id]
        });
      });
    
    // Add typing indicator if we have a recipientId
    if (recipientId) {
      channel.on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload && payload.payload.user_id === recipientId) {
          setIsTyping(payload.payload.is_typing);
          
          // Auto-clear typing indicator after 3 seconds
          if (payload.payload.is_typing) {
            setTimeout(() => {
              setIsTyping(false);
            }, 3000);
          }
        }
      });
    }
    
    // Subscribe to the channel
    channel.subscribe((status) => {
      console.log(`Chat channel status: ${status}`);
      
      if (status === 'SUBSCRIBED') {
        setConnectionStatus('connected');
        
        // Mark messages as delivered when chat opens
        if (recipientId) {
          markAsDelivered();
        }
      } else if (status === 'CHANNEL_ERROR') {
        setConnectionStatus('disconnected');
        
        // Attempt to reconnect after a delay
        setTimeout(() => {
          console.log('Attempting to reconnect...');
          channel.subscribe();
        }, 5000);
      } else {
        setConnectionStatus('connecting');
      }
    });
    
    return () => {
      console.log('Cleaning up realtime chat subscription');
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, recipientId, queryClient, toast]);
  
  // Function to send typing indicator
  const sendTypingStatus = (isTyping: boolean) => {
    if (!session?.user?.id || !recipientId) return;
    
    const channel = supabase.channel(`typing:${recipientId}:${session.user.id}`);
    
    channel
      .subscribe()
      .send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: session.user.id, is_typing: isTyping }
      })
      .then(() => {
        // Unsubscribe after sending
        supabase.removeChannel(channel);
      });
  };
  
  // Mark messages as delivered
  const markAsDelivered = async (messageId?: string) => {
    if (!session?.user?.id || !recipientId) return;
    
    try {
      const query = supabase
        .from('direct_messages')
        .update({ delivery_status: 'delivered' })
        .eq('recipient_id', session.user.id)
        .is('viewed_at', null)
        .neq('delivery_status', 'seen');
        
      if (messageId) {
        query.eq('id', messageId);
      } else {
        query.eq('sender_id', recipientId);
      }
      
      await query;
      
      console.log('Messages marked as delivered');
    } catch (error) {
      console.error('Error marking messages as delivered:', error);
    }
  };
  
  // Mark messages as seen
  const markAllAsSeen = async () => {
    if (!session?.user?.id || !recipientId) return;
    
    try {
      console.log('Marking messages from', recipientId, 'as seen');
      
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
      
      console.log('Messages marked as seen');
    } catch (error) {
      console.error('Error marking messages as seen:', error);
    }
  };
  
  return {
    isTyping,
    connectionStatus,
    markAllAsSeen,
    sendTypingStatus
  };
}
