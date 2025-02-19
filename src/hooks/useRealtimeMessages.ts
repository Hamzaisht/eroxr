
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useRealtimeMessages = (recipientId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'direct_messages',
          filter: recipientId 
            ? `recipient_id=eq.${recipientId}`
            : undefined
        },
        (payload) => {
          // Immediately update the messages in the cache
          queryClient.invalidateQueries({ queryKey: ['chat'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [recipientId, queryClient]);
};
