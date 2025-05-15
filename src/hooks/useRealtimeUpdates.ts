
import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

export function useRealtimeUpdates<T>(
  table: string,
  initialData: T[] = [],
  condition?: { column: string; value: any }
) {
  const [data, setData] = useState<T[]>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const session = useSession();

  useEffect(() => {
    if (!session) {
      setIsLoading(false);
      return;
    }

    // Initial data fetch
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let query = supabase.from(table).select('*');
        
        if (condition) {
          query = query.eq(condition.column, condition.value);
        }
        
        const { data: fetchedData, error } = await query;
        
        if (error) throw error;
        setData(fetchedData as T[]);
      } catch (err: any) {
        console.error(`Error fetching data from ${table}:`, err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscription
    const subscription = supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setData((current) => [...current, payload.new as T]);
          } else if (payload.eventType === 'UPDATE') {
            setData((current) => 
              current.map((item: any) => 
                item.id === (payload.new as any).id ? payload.new as T : item
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setData((current) => 
              current.filter((item: any) => item.id !== (payload.old as any).id)
            );
          }
        })
      .subscribe();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [table, condition, session]);

  return { data, isLoading, error };
}
