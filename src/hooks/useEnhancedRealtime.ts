
import { useEffect, useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export type OnlineStatus = 'online' | 'offline' | 'away' | 'typing';
type PresenceState = Record<string, { status: OnlineStatus; lastActive: string }>;

export function useEnhancedRealtime(recipientId?: string) {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userPresence, setUserPresence] = useState<Record<string, OnlineStatus>>({});
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  
  // Track user presence
  useEffect(() => {
    if (!session?.user?.id) return;
    
    // Create a presence channel
    const presenceChannel = supabase.channel('online-users');
    
    const userStatus = {
      user_id: session.user.id,
      status: 'online' as OnlineStatus,
      last_active: new Date().toISOString()
    };
    
    presenceChannel
      .on('presence', { event: 'sync' }, () => {
        const newState = presenceChannel.presenceState();
        updatePresenceState(newState);
      })
      .on('presence', { event: 'join' }, ({ newPresences }) => {
        // Update when users join
        console.log('User joined:', newPresences);
      })
      .on('presence', { event: 'leave' }, ({ leftPresences }) => {
        // Update when users leave
        console.log('User left:', leftPresences);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceChannel.track(userStatus);
        }
      });
    
    // Listen for any new messages that involve the current user
    const messageChannel = supabase
      .channel('direct-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'direct_messages',
        filter: recipientId 
          ? `or(and(recipient_id=eq.${session.user.id},sender_id=eq.${recipientId}),and(sender_id=eq.${session.user.id},recipient_id=eq.${recipientId}))`
          : `or(recipient_id=eq.${session.user.id},sender_id=eq.${session.user.id})`
      }, (payload) => {
        console.log('New message received:', payload);
        
        // For non-optimistic updates
        if (!payload.new.is_optimistic) {
          // Invalidate messages queries
          if (recipientId) {
            queryClient.invalidateQueries({
              queryKey: ['chat', session.user.id, recipientId]
            });
          }
          
          // Show notification for new messages if they're not from current user
          if (payload.new.sender_id !== session.user.id && !document.hasFocus()) {
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification('New message', { 
                body: payload.new.content || 'New message received'
              });
            }
            
            // Show toast notification
            toast({
              title: "New message",
              description: payload.new.content || "You received a new message",
              duration: 3000
            });
          }
        
          // Always invalidate the conversation list
          queryClient.invalidateQueries({
            queryKey: ['conversations', session.user.id]
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'direct_messages',
        filter: recipientId 
          ? `or(and(recipient_id=eq.${session.user.id},sender_id=eq.${recipientId}),and(sender_id=eq.${session.user.id},recipient_id=eq.${recipientId}))`
          : `or(recipient_id=eq.${session.user.id},sender_id=eq.${session.user.id})`
      }, (payload) => {
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
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'direct_messages',
        filter: recipientId 
          ? `or(and(recipient_id=eq.${session.user.id},sender_id=eq.${recipientId}),and(sender_id=eq.${session.user.id},recipient_id=eq.${recipientId}))`
          : `or(recipient_id=eq.${session.user.id},sender_id=eq.${session.user.id})`
      }, () => {
        // Same invalidation for deletes
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
        console.log(`Realtime subscription status: ${status}`);
      });
      
    // Set up browser notifications permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
      
    // Mark received messages as delivered
    if (recipientId) {
      markMessagesAsDelivered(session.user.id, recipientId);
    }
      
    return () => {
      supabase.removeChannel(presenceChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [session?.user?.id, recipientId, queryClient, toast]);
  
  // Typing indicator channel
  useEffect(() => {
    if (!session?.user?.id || !recipientId) return;
    
    const typingChannel = supabase.channel(`typing:${session.user.id}:${recipientId}`);
    
    typingChannel
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id === recipientId && payload.is_typing) {
          setTypingUsers((prev) => 
            prev.includes(recipientId) ? prev : [...prev, recipientId]
          );
          
          // Auto-remove typing indicator after 5 seconds of inactivity
          setTimeout(() => {
            setTypingUsers((prev) => prev.filter(id => id !== recipientId));
          }, 5000);
        }
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(typingChannel);
    };
  }, [session?.user?.id, recipientId]);
  
  // Function to send typing indicator
  const sendTypingStatus = async (isTyping: boolean) => {
    if (!session?.user?.id || !recipientId) return;
    
    const typingChannel = supabase.channel(`typing:${recipientId}:${session.user.id}`);
    
    // Only create subscription if we're sending a typing status
    if (isTyping) {
      await typingChannel.subscribe();
      await typingChannel.send({
        type: 'broadcast',
        event: 'typing',
        payload: {
          user_id: session.user.id,
          is_typing: isTyping
        }
      });
    }
  };
  
  // Helper to update presence state
  const updatePresenceState = (state: any) => {
    const presenceState: Record<string, OnlineStatus> = {};
    
    for (const [key, presences] of Object.entries(state)) {
      const userId = (presences as any[])[0].user_id;
      const status = (presences as any[])[0].status;
      presenceState[userId] = status as OnlineStatus;
    }
    
    setUserPresence(presenceState);
  };
  
  // Helper to mark messages as delivered
  const markMessagesAsDelivered = async (userId: string, senderId: string) => {
    try {
      await supabase
        .from('direct_messages')
        .update({ delivery_status: 'delivered' })
        .eq('sender_id', senderId)
        .eq('recipient_id', userId)
        .is('viewed_at', null)
        .neq('delivery_status', 'seen');
    } catch (error) {
      console.log('Error marking messages as delivered:', error);
    }
  };
  
  return {
    userPresence,
    isTyping: typingUsers.includes(recipientId || ''),
    sendTypingStatus,
    markAsRead: async (messageId: string) => {
      if (!session?.user?.id) return;
      
      try {
        await supabase
          .from('direct_messages')
          .update({ 
            delivery_status: 'seen',
            viewed_at: new Date().toISOString()
          })
          .eq('id', messageId);
      } catch (error) {
        console.error('Error marking message as read:', error);
      }
    },
    markAllAsRead: async () => {
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
      } catch (error) {
        console.error('Error marking all messages as read:', error);
      }
    }
  };
}
