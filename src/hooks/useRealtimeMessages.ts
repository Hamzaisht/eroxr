
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
        async (payload) => {
          console.log('Message update:', payload);

          // Immediate update for the chat window
          if (recipientId) {
            queryClient.setQueriesData({ queryKey: ['chat', session.user.id, recipientId] }, (oldData: any) => {
              if (!oldData) return [payload.new];
              return [...(Array.isArray(oldData) ? oldData : []), payload.new];
            });
          }

          // Immediate update for the message list
          queryClient.setQueriesData({ queryKey: ['messages', session.user.id] }, (oldData: any) => {
            if (!oldData) return [payload.new];
            
            if (payload.eventType === 'INSERT') {
              // Remove any existing conversation with the same user and add the new one at the top
              const otherUserId = payload.new.sender_id === session.user.id 
                ? payload.new.recipient_id 
                : payload.new.sender_id;
                
              const filteredData = oldData.filter((msg: any) => {
                const msgOtherUserId = msg.sender_id === session.user.id ? msg.recipient_id : msg.sender_id;
                return msgOtherUserId !== otherUserId;
              });
              
              return [payload.new, ...filteredData];
            }

            if (payload.eventType === 'UPDATE') {
              return oldData.map((message: any) =>
                message.id === payload.new.id ? payload.new : message
              );
            }

            if (payload.eventType === 'DELETE') {
              return oldData.filter((message: any) => message.id !== payload.old.id);
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
