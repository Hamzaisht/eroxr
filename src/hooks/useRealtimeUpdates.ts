
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeUpdates(table: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    // Subscribe to real-time changes
    console.log(`Setting up realtime subscription for ${table}...`);
    
    const channel = supabase
      .channel(`public:${table}`)
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: table
        }, 
        (payload) => {
          console.log(`Received realtime update for ${table}:`, payload);
          
          // Invalidate relevant queries based on the table that changed
          switch (table) {
            case 'post_purchases':
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              if (payload.eventType === 'INSERT') {
                toast({ 
                  title: "New Purchase", 
                  description: "You have received a new payment"
                });
              }
              break;
            case 'creator_subscriptions':
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              if (payload.eventType === 'INSERT') {
                toast({ 
                  title: "New Subscriber", 
                  description: "Someone just subscribed to your content"
                });
              }
              break;
            case 'payout_requests':
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              if (payload.eventType === 'UPDATE' && payload.new.status === 'processed') {
                toast({ 
                  title: "Payout Processed", 
                  description: "Your payout request has been processed"
                });
              }
              break;
            case 'posts':
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              break;
            case 'post_likes':
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              break;
            case 'post_comments':
              queryClient.invalidateQueries({ queryKey: ['dashboard'] });
              break;
          }
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      console.log(`Removing realtime subscription for ${table}...`);
      supabase.removeChannel(channel);
    };
  }, [table, queryClient, toast]);
}
