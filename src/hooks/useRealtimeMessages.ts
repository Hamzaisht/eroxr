
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@supabase/auth-helpers-react';

export const useRealtimeMessages = (recipientId?: string) => {
  const session = useSession();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (!session?.user?.id) return;

    // Subscribe to all message updates for the current user's conversations
    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: recipientId 
            ? `or(and(sender_id.eq.${session.user.id},recipient_id.eq.${recipientId}),and(sender_id.eq.${recipientId},recipient_id.eq.${session.user.id}))`
            : `or(sender_id.eq.${session.user.id},recipient_id.eq.${session.user.id})`
        },
        (payload) => {
          console.log('Message update:', payload);

          // Optimistically update the UI
          queryClient.setQueryData(['messages', session.user.id], (oldData: any) => {
            if (!oldData) return oldData;

            if (payload.eventType === 'INSERT') {
              // Add new message to the list
              return [payload.new, ...oldData];
            }

            if (payload.eventType === 'UPDATE') {
              // Update existing message
              return oldData.map((message: any) =>
                message.id === payload.new.id ? payload.new : message
              );
            }

            return oldData;
          });

          // Show notification for new messages
          if (payload.eventType === 'INSERT' && payload.new.recipient_id === session.user.id) {
            toast({
              title: "New message",
              description: "You have received a new message",
              duration: 3000,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, recipientId, queryClient, toast]);
};
