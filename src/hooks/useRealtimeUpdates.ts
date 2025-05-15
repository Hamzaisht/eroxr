
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

/**
 * Hook to subscribe to Supabase realtime updates for a table
 * 
 * @param table Table name to subscribe to
 * @param event Event type to listen for (INSERT, UPDATE, DELETE)
 * @param callback Optional callback to execute on event
 * @returns void
 */
export function useRealtimeUpdates(
  table: string, 
  event: RealtimeEvent = '*',
  callback?: (payload: any) => void
) {
  useEffect(() => {
    let channel: RealtimeChannel;

    const setupSubscription = async () => {
      channel = supabase
        .channel('schema-db-changes')
        .on(
          'postgres_changes',
          {
            event: event,
            schema: 'public',
            table: table
          },
          (payload) => {
            if (callback) {
              callback(payload);
            } else {
              console.log('Realtime update:', payload);
            }
          }
        )
        .subscribe();
    };

    setupSubscription();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, event, callback]);
}
