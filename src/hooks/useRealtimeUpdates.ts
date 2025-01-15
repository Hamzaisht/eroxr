import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useRealtimeUpdates = (tableName: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    const channel = supabase
      .channel(`public:${tableName}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: tableName
        },
        (payload) => {
          console.log(`Received ${tableName} update:`, payload);
          queryClient.invalidateQueries({ queryKey: [tableName] });

          if (payload.eventType === 'DELETE') {
            toast({
              title: "Post deleted",
              description: "The post has been removed",
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: "Post updated",
              description: "The post has been updated",
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, tableName, toast]);
};