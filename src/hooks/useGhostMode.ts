
import { useState, useCallback, useEffect } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { ActiveSurveillanceState } from '@/utils/media/types';

export const useGhostMode = () => {
  const session = useSession();
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [hasGhostAccess, setHasGhostAccess] = useState(false);
  const [surveillanceState, setSurveillanceState] = useState<ActiveSurveillanceState>({
    isActive: false,
    lastUpdated: null
  });

  // Check if the user has ghost mode access
  useEffect(() => {
    const checkGhostAccess = async () => {
      if (!session?.user?.id) {
        setHasGhostAccess(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('admin_roles')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('role', 'ghost_mode')
          .maybeSingle();

        if (error) {
          console.error('Error checking ghost mode access:', error);
          setHasGhostAccess(false);
          return;
        }

        setHasGhostAccess(!!data);
      } catch (err) {
        console.error('Failed to check ghost mode access:', err);
        setHasGhostAccess(false);
      }
    };

    checkGhostAccess();
  }, [session?.user?.id]);

  // Toggle ghost mode on/off
  const toggleGhostMode = useCallback(() => {
    if (!hasGhostAccess) return;

    setIsGhostMode(prev => {
      const newState = !prev;

      // Log the state change if user is authenticated
      if (session?.user?.id) {
        // Log to admin audit log
        supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: newState ? 'ghost_mode_activated' : 'ghost_mode_deactivated',
          details: {
            timestamp: new Date().toISOString()
          }
        }).then(({ error }) => {
          if (error) {
            console.error('Error logging ghost mode toggle:', error);
          }
        });

        // Update surveillance state
        if (newState) {
          setSurveillanceState({
            isActive: true,
            lastUpdated: new Date()
          });
        } else {
          setSurveillanceState({
            isActive: false,
            lastUpdated: new Date()
          });
        }
      }

      return newState;
    });
  }, [hasGhostAccess, session?.user?.id]);

  // Record surveillance activity periodically when ghost mode is active
  useEffect(() => {
    if (!session?.user?.id || !isGhostMode || !surveillanceState.isActive) return;

    const recordActivity = async () => {
      try {
        // Update last activity timestamp
        setSurveillanceState(prev => ({
          ...prev,
          lastUpdated: new Date()
        }));

        // Log to database
        await supabase.from('admin_surveillance_logs').insert({
          admin_id: session.user.id,
          action: 'ghost_mode_active',
          details: {
            timestamp: new Date().toISOString(),
            duration_seconds: surveillanceState.lastUpdated ? 
              (Date.now() - surveillanceState.lastUpdated.getTime()) / 1000 : 0
          }
        });
      } catch (error) {
        console.error('Error recording surveillance activity:', error);
      }
    };

    // Record activity every 5 minutes while ghost mode is active
    const intervalId = setInterval(recordActivity, 5 * 60 * 1000);
    
    // Also record once immediately when activated
    recordActivity();

    return () => {
      clearInterval(intervalId);
      
      // Record deactivation if component unmounts while ghost mode was active
      if (session?.user?.id && isGhostMode) {
        setSurveillanceState({
          isActive: false, 
          lastUpdated: new Date()
        });
        
        supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'ghost_mode_deactivated_component_unmount',
          details: {
            timestamp: new Date().toISOString()
          }
        }).then(({ error }) => {
          if (error) {
            console.error('Error logging ghost mode deactivation:', error);
          }
        });
      }
    };
  }, [isGhostMode, session?.user?.id, surveillanceState.isActive, surveillanceState.lastUpdated]);

  return {
    isGhostMode,
    hasGhostAccess,
    toggleGhostMode
  };
};
