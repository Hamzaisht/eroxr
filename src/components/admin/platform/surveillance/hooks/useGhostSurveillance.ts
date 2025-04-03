
import { useState, useCallback } from 'react';
import { LiveSession } from '../types';
import { useSupabaseClient, useSession } from '@supabase/auth-helpers-react';
import { useToast } from '@/hooks/use-toast';

interface ActiveSurveillanceState {
  isWatching: boolean;
  session: LiveSession | null;
  startTime: string | null;
}

export function useGhostSurveillance(isGhostMode: boolean, isSuperAdmin: boolean) {
  const [activeSurveillance, setActiveSurveillance] = useState<ActiveSurveillanceState>({
    isWatching: false,
    session: null,
    startTime: null
  });
  
  const supabase = useSupabaseClient();
  const session = useSession();
  const { toast } = useToast();
  
  const startSurveillance = useCallback(async (targetSession: LiveSession): Promise<boolean> => {
    if (!isGhostMode) {
      toast({
        title: "Ghost Mode Required",
        description: "You must enable Ghost Mode to monitor user sessions.",
        variant: "destructive"
      });
      return false;
    }
    
    if (!isSuperAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only super admins can use surveillance features.",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      // Log the surveillance start in admin logs
      if (session?.user?.id) {
        await supabase.from('admin_logs').insert({
          admin_id: session.user.id,
          action: 'start_surveillance',
          action_type: 'security',
          target_id: targetSession.user_id,
          target_type: 'user',
          details: {
            session_id: targetSession.id,
            session_type: targetSession.type,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Update active surveillance state
      setActiveSurveillance({
        isWatching: true,
        session: targetSession,
        startTime: new Date().toISOString()
      });
      
      toast({
        title: "Surveillance Started",
        description: `Now monitoring ${targetSession.username}'s ${targetSession.type} session`,
      });
      
      return true;
    } catch (error) {
      console.error('Error starting surveillance:', error);
      toast({
        title: "Failed to Start Surveillance",
        description: "An error occurred while trying to start monitoring.",
        variant: "destructive"
      });
      return false;
    }
  }, [isGhostMode, isSuperAdmin, session, supabase, toast]);
  
  const stopSurveillance = useCallback(async (): Promise<boolean> => {
    if (!activeSurveillance.isWatching) {
      return true;
    }
    
    try {
      // Log the surveillance end in admin logs
      if (session?.user?.id && activeSurveillance.session) {
        await supabase.from('admin_logs').insert({
          admin_id: session.user.id,
          action: 'stop_surveillance',
          action_type: 'security',
          target_id: activeSurveillance.session.user_id,
          target_type: 'user',
          details: {
            session_id: activeSurveillance.session.id,
            session_type: activeSurveillance.session.type,
            duration_seconds: activeSurveillance.startTime ? 
              (new Date().getTime() - new Date(activeSurveillance.startTime).getTime()) / 1000 : 0,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      // Reset active surveillance state
      setActiveSurveillance({
        isWatching: false,
        session: null,
        startTime: null
      });
      
      toast({
        title: "Surveillance Ended",
        description: "Monitoring session has been stopped",
      });
      
      return true;
    } catch (error) {
      console.error('Error stopping surveillance:', error);
      toast({
        title: "Error",
        description: "Failed to properly end the monitoring session",
        variant: "destructive"
      });
      return false;
    }
  }, [activeSurveillance, session, supabase, toast]);
  
  return {
    activeSurveillance,
    startSurveillance,
    stopSurveillance
  };
}
