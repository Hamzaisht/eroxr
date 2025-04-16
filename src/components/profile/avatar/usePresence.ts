
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityStatus } from "@/utils/media/types";
import { PresenceState, UsePresenceReturn } from "./types";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const PRESENCE_INTERVAL = 30 * 1000; // 30 seconds

export const usePresence = (profileId: string, isOwnProfile: boolean): UsePresenceReturn => {
  const [availability, setAvailability] = useState<AvailabilityStatus>('offline');
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [lastActive, setLastActive] = useState<string>();
  const [isInCall, setIsInCall] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  useEffect(() => {
    if (!profileId) return;

    let inactivityTimeout: NodeJS.Timeout;
    let presenceInterval: NodeJS.Timeout;
    let handleActivity: () => void;

    const updatePresence = async () => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;
      
      let newStatus: AvailabilityStatus = 'online';

      if (isInCall) {
        newStatus = 'busy';
      } else if (isMessaging) {
        newStatus = 'away';
      } else if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        newStatus = 'offline';
      }

      if (newStatus !== availability) {
        setAvailability(newStatus);
      }
    };

    // Activity listeners for own profile
    if (isOwnProfile) {
      handleActivity = () => {
        setLastActivity(Date.now());
        if (availability === 'offline') {
          setAvailability('online');
        }
      };

      const activityEvents = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
      activityEvents.forEach(event => {
        window.addEventListener(event, handleActivity);
      });

      // Set up intervals
      presenceInterval = setInterval(updatePresence, PRESENCE_INTERVAL);
      inactivityTimeout = setTimeout(() => {
        if (!isInCall && !isMessaging) {
          setAvailability('offline');
        }
      }, INACTIVITY_TIMEOUT);
    }

    // Subscribe to presence channel
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
          }) as PresenceState | undefined;
        
        if (userState) {
          setAvailability(userState.status);
          setLastActive(userState.timestamp);
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED' && isOwnProfile) {
          await channel.track({
            user_id: profileId,
            status: availability,
            timestamp: new Date().toISOString()
          } as PresenceState);
        }
      });

    // Cleanup
    return () => {
      if (isOwnProfile && handleActivity) {
        const activityEvents = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
        activityEvents.forEach(event => {
          window.removeEventListener(event, handleActivity);
        });
        clearInterval(presenceInterval);
        clearTimeout(inactivityTimeout);
      }
      supabase.removeChannel(channel);
    };
  }, [profileId, isOwnProfile, availability, lastActivity, isInCall, isMessaging]);

  return { 
    availability, 
    setAvailability,
    setIsInCall,
    setIsMessaging,
    lastActive
  };
};
