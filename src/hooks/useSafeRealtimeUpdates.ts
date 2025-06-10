
import { useEffect, useRef, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface RealtimeOptions {
  debounceMs?: number;
  maxInvalidationsPerMinute?: number;
}

export function useSafeRealtimeUpdates(
  table: string,
  options: RealtimeOptions = {}
) {
  const { debounceMs = 1000, maxInvalidationsPerMinute = 10 } = options;
  const session = useSession();
  const queryClient = useQueryClient();
  const invalidationCount = useRef(0);
  const lastReset = useRef(Date.now());
  const debounceTimer = useRef<NodeJS.Timeout>();

  // Reset invalidation counter every minute
  const resetCounter = useCallback(() => {
    const now = Date.now();
    if (now - lastReset.current >= 60000) { // 1 minute
      invalidationCount.current = 0;
      lastReset.current = now;
    }
  }, []);

  // Debounced invalidation function
  const debouncedInvalidate = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      resetCounter();
      
      if (invalidationCount.current >= maxInvalidationsPerMinute) {
        console.log(`Rate limit reached for ${table} invalidations`);
        return;
      }

      console.log(`Safe realtime invalidation for ${table}`);
      queryClient.invalidateQueries({ queryKey: ['home-posts'] });
      invalidationCount.current++;
    }, debounceMs);
  }, [table, debounceMs, maxInvalidationsPerMinute, queryClient, resetCounter]);

  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel(`safe_${table}_changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table }, 
        (payload) => {
          console.log(`Safe realtime update for ${table}:`, payload.eventType);
          debouncedInvalidate();
        })
      .subscribe((status) => {
        console.log(`Safe realtime subscription status for ${table}:`, status);
      });

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      supabase.removeChannel(channel);
    };
  }, [table, session, debouncedInvalidate]);

  return null;
}
