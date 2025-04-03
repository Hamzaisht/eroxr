import { useState, useCallback } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { LiveSession } from "@/components/admin/platform/surveillance/types";

export const useGhostSurveillance = (isGhostMode: boolean, isSuperAdmin: boolean) => {
  const [activeSurveillance, setActiveSurveillance] = useState<{
    session?: LiveSession;
    isWatching: boolean;
    startTime?: string;
  }>({ isWatching: false });
  
  const session = useSession();

  const startSurveillance = useCallback(async (sessionToWatch: LiveSession) => {
    if (!isGhostMode || !isSuperAdmin || !session?.user?.id) return false;
    
    try {
      // Open a new window for surveillance
      const surveillanceWindow = window.open(
        `/admin/platform/surveillance/session?type=${sessionToWatch.type}&id=${sessionToWatch.id}`,
        '_blank',
        'noopener,noreferrer,width=800,height=600'
      );
      
      if (!surveillanceWindow) {
        console.error("Failed to open surveillance window");
        return false;
      }
      
      // Add logs for debugging the surveillance session
      console.log(`Starting surveillance on ${sessionToWatch.type} by ${sessionToWatch.username || 'unknown user'} - ${sessionToWatch.title || 'No title'}`);

      setActiveSurveillance({
        session: sessionToWatch,
        isWatching: true,
        startTime: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      return false;
    }
  }, [isGhostMode, isSuperAdmin, session?.user?.id]);

  const stopSurveillance = useCallback(async () => {
    if (!isGhostMode || !isSuperAdmin) return false;

    try {
      // Close the surveillance window if it exists
      const windows = window.open('', '_blank');
      if (windows) {
        windows.close();
      }

      setActiveSurveillance({ isWatching: false });
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      return false;
    }
  }, [isGhostMode, isSuperAdmin]);

  return { activeSurveillance, startSurveillance, stopSurveillance };
};
