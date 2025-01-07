import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { PresenceState } from "./types";

export const usePresence = (profileId: string, isOwnProfile: boolean) => {
  const [availability, setAvailability] = useState<AvailabilityStatus>("offline");

  useEffect(() => {
    if (!profileId) return;

    const channel = supabase.channel('online-users')
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const userState = Object.values(state)
          .flat()
          .find((presence: any) => {
            if (typeof presence === 'object' && presence !== null) {
              return 'user_id' in presence && presence.user_id === profileId;
            }
            return false;
          });
        
        if (userState && 'status' in userState) {
          const typedState = userState as PresenceState;
          setAvailability(typedState.status);
        } else {
          setAvailability("offline");
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && isOwnProfile) {
          await channel.track({
            user_id: profileId,
            status: availability,
            timestamp: new Date().toISOString()
          });
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId, isOwnProfile, availability]);

  return { availability, setAvailability };
};