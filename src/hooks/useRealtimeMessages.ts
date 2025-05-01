
import { useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtimeMessages(recipientId?: string) {
  const session = useSession();
  const queryClient = useQueryClient();
  
  useEffect(() => {
    if (!session?.user?.id) return;
    
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
      }, () => {
        // Invalidate messages queries
        if (recipientId) {
          queryClient.invalidateQueries({
            queryKey: ['chat', session.user.id, recipientId]
          });
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
      .subscribe();
      
    return () => {
      supabase.removeChannel(messageChannel);
    };
  }, [session?.user?.id, recipientId, queryClient]);
}
