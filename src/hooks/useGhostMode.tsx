import { useState, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { ActiveSurveillanceState, LiveAlert } from '@/utils/media/types';
import { useToast } from '@/hooks/use-toast';

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
      return;
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

  // Active surveillance state for monitoring
  const [surveillanceState, setSurveillanceState] = useState<ActiveSurveillanceState>({
    isActive: false
  });
  
  // Live alerts during surveillance
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);

  return {
    isGhostMode,
    canUseGhostMode,
    isLoading,
    toggleGhostMode,
    surveillanceState,
    setSurveillanceState,
    alerts,
    setAlerts
  };
}
