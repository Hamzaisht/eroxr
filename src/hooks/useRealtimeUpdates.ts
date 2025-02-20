
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
          queryClient.invalidateQueries({ queryKey: ['admin-platform-stats'] });

          // Show appropriate toast messages
          switch (payload.eventType) {
            case 'DELETE':
              toast({
                title: "Data Updated",
                description: `${tableName} record deleted`,
              });
              break;
            case 'UPDATE':
              toast({
                title: "Data Updated",
                description: `${tableName} record updated`,
              });
              break;
            case 'INSERT':
              toast({
                title: "Data Updated",
                description: `New ${tableName} record added`,
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
