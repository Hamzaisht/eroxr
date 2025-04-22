
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@supabase/auth-helpers-react";
import { DatingAd } from "@/components/ads/types/dating";

export function useDatingPresence(userProfile: DatingAd | null) {
  const session = useSession();

  useEffect(() => {
    if (!session) return;

    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        console.log('Presence state updated:', state);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: session.user.id,
            online_at: new Date().toISOString()
          });
        }
      });

    if (session.user.id && userProfile) {
      supabase
        .from('dating_ads')
        .update({ last_active: new Date().toISOString() })
        .eq('user_id', session.user.id)
        .then(({ error }) => {
          if (error) console.error('Error updating last_active:', error);
        });
    }

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session, userProfile]);
}
