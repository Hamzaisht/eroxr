import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AvailabilityStatus } from "@/components/ui/availability-indicator";
import { PresenceState } from "./types";

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes
const PRESENCE_INTERVAL = 30 * 1000; // 30 seconds

export const usePresence = (profileId: string, isOwnProfile: boolean) => {
  const [availability, setAvailability] = useState<AvailabilityStatus>("offline");
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [isInCall, setIsInCall] = useState(false);
  const [isMessaging, setIsMessaging] = useState(false);

  useEffect(() => {
    if (!profileId || !isOwnProfile) return;

    let inactivityTimeout: NodeJS.Timeout;
    let presenceInterval: NodeJS.Timeout;

    const updatePresence = async () => {
      const currentTime = Date.now();
      const timeSinceLastActivity = currentTime - lastActivity;
      
      let newStatus: AvailabilityStatus = "online";

      // Determine status based on activity
      if (isInCall) {
        newStatus = "busy";
      } else if (isMessaging) {
        newStatus = "away";
      } else if (timeSinceLastActivity > INACTIVITY_TIMEOUT) {
        newStatus = "offline";
      }

      if (newStatus !== availability) {
        setAvailability(newStatus);
      }
    };

    // Activity listeners
    const handleActivity = () => {
      setLastActivity(Date.now());
      if (availability === "offline") {
        setAvailability("online");
      }
    };

    // Set up activity tracking
    const activityEvents = ['mousedown', 'keydown', 'touchstart', 'mousemove'];
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

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
          });
        
        if (userState && 'status' in userState) {
          const typedState = userState as PresenceState;
          setAvailability(typedState.status);
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

    // Set up intervals
    presenceInterval = setInterval(updatePresence, PRESENCE_INTERVAL);
    inactivityTimeout = setTimeout(() => {
      if (!isInCall && !isMessaging) {
        setAvailability("offline");
      }
    }, INACTIVITY_TIMEOUT);

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(presenceInterval);
      clearTimeout(inactivityTimeout);
      supabase.removeChannel(channel);
    };
  }, [profileId, isOwnProfile, availability, lastActivity, isInCall, isMessaging]);

  return { 
    availability, 
    setAvailability,
    setIsInCall,
    setIsMessaging
  };
};