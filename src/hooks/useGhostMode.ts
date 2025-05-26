
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveAlert } from '@/types/alerts';
import { LiveSession } from '@/types/surveillance';

export const useGhostMode = () => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);

  useEffect(() => {
    const checkGhostMode = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsGhostMode(false);
          setIsLoading(false);
          return;
        }

        // Check if user is admin and has an active ghost mode session
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (userRole?.role === 'admin') {
          const { data: session } = await supabase
            .from('admin_sessions')
            .select('ghost_mode')
            .eq('admin_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          setIsGhostMode(session?.ghost_mode || false);
        } else {
          setIsGhostMode(false);
        }
      } catch (error) {
        console.error('Error checking ghost mode:', error);
        setIsGhostMode(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkGhostMode();
  }, []);

  const toggleGhostMode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newGhostMode = !isGhostMode;
      
      const { error } = await supabase
        .from('admin_sessions')
        .upsert({
          admin_id: user.id,
          ghost_mode: newGhostMode,
          last_active_at: new Date().toISOString()
        });

      if (error) throw error;
      
      setIsGhostMode(newGhostMode);
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
    }
  };

  const refreshAlerts = async (): Promise<boolean> => {
    try {
      // Mock alerts for now
      setLiveAlerts([]);
      return true;
    } catch (error) {
      console.error('Error refreshing alerts:', error);
      return false;
    }
  };

  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    try {
      console.log('Starting surveillance for session:', session);
      return true;
    } catch (error) {
      console.error('Error starting surveillance:', error);
      return false;
    }
  };

  return { 
    isGhostMode, 
    isLoading, 
    toggleGhostMode,
    canUseGhostMode: true,
    liveAlerts,
    refreshAlerts,
    startSurveillance
  };
};
