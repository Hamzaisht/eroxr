import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LiveAlert, LiveSession, ModerationAction } from '@/types/surveillance';

// Define the active surveillance state interface
interface ActiveSurveillanceState {
  isActive: boolean;
  session?: LiveSession | null;
  startTime?: string | null;
}

// Define the active surveillance interface with more specific properties
interface ActiveSurveillance {
  isWatching: boolean;
  session: LiveSession | null;
  startTime: string | null;
}

export function useGhostMode() {
  const [isGhostMode, setIsGhostMode] = useState<boolean>(false);
  const [canUseGhostMode, setCanUseGhostMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const session = useSession();
  const { toast } = useToast();

  // Check if user has ghost mode permissions
  useEffect(() => {
    const checkGhostModePermissions = async () => {
      if (!session?.user?.id) {
        setCanUseGhostMode(false);
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is admin or moderator
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id);

        if (error) throw error;

        const hasPermission = roles?.some(r => 
          r.role === 'admin' || r.role === 'moderator' || r.role === 'super_admin'
        );

        setCanUseGhostMode(hasPermission || false);

        // Get current ghost mode status
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('ghost_mode_active')
          .eq('id', session.user.id)
          .single();

        if (!profileError && profile) {
          setIsGhostMode(profile.ghost_mode_active || false);
        }
      } catch (error) {
        console.error('Error checking ghost mode permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkGhostModePermissions();
  }, [session?.user?.id]);

  // Toggle ghost mode
  const toggleGhostMode = async () => {
    if (!canUseGhostMode || !session?.user?.id) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to use Ghost Mode",
        variant: "destructive"
      });
      return false;
    }

    try {
      const newState = !isGhostMode;
      
      // Update database
      const { error } = await supabase
        .from('profiles')
        .update({ ghost_mode_active: newState })
        .eq('id', session.user.id);

      if (error) throw error;

      // Log the action
      await supabase.from('admin_logs').insert({
        admin_id: session.user.id,
        action: newState ? 'ghost_mode_activated' : 'ghost_mode_deactivated',
        action_type: 'surveillance',
        details: {
          timestamp: new Date().toISOString()
        }
      });

      setIsGhostMode(newState);
      
      return newState;
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
      toast({
        title: "Error",
        description: "Failed to toggle Ghost Mode",
        variant: "destructive"
      });
      throw error;
    }
  };

  // Active surveillance state
  const [surveillanceState, setSurveillanceState] = useState<ActiveSurveillanceState>({
    isActive: false
  });
  
  // For compatibility with existing components expecting activeSurveillance
  const activeSurveillance: ActiveSurveillance = {
    isWatching: surveillanceState.isActive,
    session: surveillanceState.session || null,
    startTime: surveillanceState.startTime || null
  };
  
  // Live alerts for monitoring
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  
  // For compatibility with components expecting liveAlerts
  const liveAlerts = alerts;
  
  // Refresh alerts function
  const refreshAlerts = async (): Promise<boolean> => {
    if (!isGhostMode || !session?.user?.id) {
      return false;
    }
    
    try {
      // Fetch alerts from relevant tables
      const { data: reportsData, error: reportsError } = await supabase
        .from("reports")
        .select("*, reporter:reporter_id(username, avatar_url), reported:reported_id(username, avatar_url)")
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(20);
      
      if (reportsError) {
        console.error('Error fetching reports:', reportsError);
      }
      
      // Transform reports to alerts
      const reportAlerts: LiveAlert[] = (reportsData || []).map(report => ({
        id: report.id,
        type: "violation",
        alert_type: "violation",
        user_id: report.reported_id || '',
        username: report.reported?.username || 'Unknown',
        avatar_url: report.reported?.avatar_url || '',
        timestamp: report.created_at,
        created_at: report.created_at,
        content_type: report.content_type || '',
        reason: report.reason || '',
        severity: (report.is_emergency ? 'high' : 'medium') as 'high' | 'medium' | 'low',
        content_id: report.content_id || '',
        message: `${report.reason}: ${report.description || ''}`,
        status: report.status || '',
        title: `Content Report`,
        description: report.description || 'No description provided',
        is_viewed: false,
        urgent: report.is_emergency || false
      }));
      
      setAlerts(reportAlerts);
      return true;
    } catch (error) {
      console.error('Error refreshing alerts:', error);
      return false;
    }
  };
  
  // Start surveillance function
  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    if (!isGhostMode || !canUseGhostMode) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to use surveillance",
        variant: "destructive"
      });
      return false;
    }
    
    try {
      setSurveillanceState({
        isActive: true,
        session,
        startTime: new Date().toISOString()
      });
      
      // Log the surveillance action - Fix here: Using user_id instead of user
      await supabase.from('admin_logs').insert({
        admin_id: session.user_id,
        action: 'start_surveillance',
        action_type: 'surveillance',
        details: {
          target_user_id: session.user_id,
          target_username: session.username,
          session_type: session.type,
          timestamp: new Date().toISOString()
        }
      });
      
      return true;
    } catch (error) {
      console.error('Error starting surveillance:', error);
      return false;
    }
  };
  
  // Stop surveillance function
  const stopSurveillance = async (): Promise<boolean> => {
    if (!surveillanceState.isActive) {
      return false;
    }
    
    try {
      // Log the end of surveillance
      if (session?.user?.id && surveillanceState.session) {
        await supabase.from('admin_logs').insert({
          admin_id: session.user.id,
          action: 'stop_surveillance',
          action_type: 'surveillance',
          details: {
            target_user_id: surveillanceState.session.user_id,
            target_username: surveillanceState.session.username,
            session_type: surveillanceState.session.type,
            duration_seconds: surveillanceState.startTime 
              ? (new Date().getTime() - new Date(surveillanceState.startTime).getTime()) / 1000
              : 0,
            timestamp: new Date().toISOString()
          }
        });
      }
      
      setSurveillanceState({
        isActive: false,
        session: null,
        startTime: null
      });
      
      return true;
    } catch (error) {
      console.error('Error stopping surveillance:', error);
      return false;
    }
  };

  return {
    isGhostMode,
    canUseGhostMode,
    isLoading,
    toggleGhostMode,
    surveillanceState,
    setSurveillanceState,
    alerts,
    setAlerts,
    // Adding compatibility properties
    liveAlerts,
    refreshAlerts,
    activeSurveillance,
    startSurveillance,
    stopSurveillance
  };
}
