
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
          
          // Invalidate and refetch queries
          queryClient.invalidateQueries({ queryKey: [tableName] });

          // Show appropriate toast messages
          switch (payload.eventType) {
            case 'DELETE':
              toast({
                title: "Post deleted",
                description: "The post has been removed",
              });
              break;
            case 'UPDATE':
              toast({
                title: "Post updated",
                description: "The post has been updated",
              });
              break;
            case 'INSERT':
              toast({
                title: "New post",
                description: "A new post has been added",
              });
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, tableName, toast]);
};
