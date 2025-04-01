
import { useState } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LiveSession } from "@/components/admin/platform/user-analytics/types";

export function useGhostSurveillance(isGhostMode: boolean, isSuperAdmin: boolean) {
  const [activeSurveillance, setActiveSurveillance] = useState<{
    session?: LiveSession;
    isWatching: boolean;
    startTime?: string;
  }>({
    isWatching: false
  });
  
  const session = useSession();
  const { toast } = useToast();

  const startSurveillance = async (targetSession: LiveSession) => {
    if (!isGhostMode || !isSuperAdmin) {
      toast({
        title: "Ghost Mode Required",
        description: "You must be in Ghost Mode to monitor user sessions",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const startTime = new Date().toISOString();
      
      if (session?.user?.id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'ghost_surveillance_started',
          details: {
            timestamp: startTime,
            session_id: targetSession.id,
            session_type: targetSession.type,
            target_user_id: targetSession.user_id,
            target_username: targetSession.username
          }
        });
        
        // Check if we're already monitoring something
        if (activeSurveillance.isWatching && activeSurveillance.session) {
          // End the previous surveillance session
          await stopSurveillance();
        }
      }
      
      setActiveSurveillance({
        session: targetSession,
        isWatching: true,
        startTime
      });
      
      toast({
        title: "Surveillance Active",
        description: `Monitoring ${targetSession.type}: ${targetSession.title || targetSession.username}`,
      });
      
      console.log("Ghost surveillance started:", targetSession);
      return true;
    } catch (error) {
      console.error("Error starting surveillance:", error);
      toast({
        title: "Surveillance Failed",
        description: "Could not start monitoring session",
        variant: "destructive"
      });
      return false;
    }
  };

  const stopSurveillance = async () => {
    if (!activeSurveillance.isWatching) return;
    
    try {
      if (session?.user?.id && activeSurveillance.session) {
        const durationMinutes = activeSurveillance.startTime ? 
          Math.round((new Date().getTime() - new Date(activeSurveillance.startTime).getTime()) / 60000) : 0;
          
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'ghost_surveillance_ended',
          details: {
            timestamp: new Date().toISOString(),
            session_id: activeSurveillance.session.id,
            session_type: activeSurveillance.session.type,
            target_user_id: activeSurveillance.session.user_id,
            target_username: activeSurveillance.session.username,
            duration_minutes: durationMinutes
          }
        });
      }
      
      console.log("Ghost surveillance ended");
      
      setActiveSurveillance({
        isWatching: false
      });
      
      toast({
        title: "Surveillance Ended",
        description: "You are no longer monitoring the session",
      });
      
      return true;
    } catch (error) {
      console.error("Error stopping surveillance:", error);
      return false;
    }
  };

  return {
    activeSurveillance,
    startSurveillance,
    stopSurveillance
  };
}
