
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtimeUpdates<T>(
  table: string,
  initialData: T[] = [],
  condition?: { column: string; value: any }
) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const session = useSession();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    // Set up realtime subscription for immediate updates
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table }, 
        (payload) => {
          console.log(`New ${table} inserted:`, payload.new);
          // Invalidate and refetch queries immediately for real-time feel
          queryClient.invalidateQueries({ queryKey: ['home-posts'] });
          queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
        })
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table }, 
        (payload) => {
          console.log(`${table} updated:`, payload.new);
          // Invalidate and refetch queries immediately
          queryClient.invalidateQueries({ queryKey: ['home-posts'] });
          queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
        })
      .on('postgres_changes', 
        { event: 'DELETE', schema: 'public', table }, 
        (payload) => {
          console.log(`${table} deleted:`, payload.old);
          // Invalidate and refetch queries immediately
          queryClient.invalidateQueries({ queryKey: ['home-posts'] });
          queryClient.invalidateQueries({ queryKey: ['feed-posts'] });
        })
      .subscribe((status) => {
        console.log(`Realtime subscription status for ${table}:`, status);
        if (status === 'SUBSCRIBED') {
          setIsLoading(false);
        }
      });

    // Cleanup subscription
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [table, condition, session, queryClient]);

  return { data, isLoading, error };
}
