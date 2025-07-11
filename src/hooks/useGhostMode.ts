
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { LiveAlert } from '@/types/alerts';
import { LiveSession } from '@/types/surveillance';

export interface GhostModeCapabilities {
  viewProfile: (userId: string) => Promise<void>;
  viewPrivateContent: (contentId: string, contentType: 'post' | 'message' | 'stream') => Promise<void>;
  viewDeletedContent: (contentId: string) => Promise<void>;
  joinStreamInvisibly: (streamId: string) => Promise<void>;
  searchForensics: (query: string, filters?: any) => Promise<any>;
  viewEarningsData: (userId: string) => Promise<void>;
  trackUserActivity: (userId: string) => Promise<void>;
}

export const useGhostMode = () => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [activeSurveillance, setActiveSurveillance] = useState<string[]>([]);

  useEffect(() => {
    const checkGhostMode = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setIsGhostMode(false);
          setIsLoading(false);
          return;
        }

        // Only super_admin can use Ghost Mode
        const { data: userRole } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        if (userRole?.role === 'super_admin') {
          const { data: session } = await supabase
            .from('admin_sessions')
            .select('ghost_mode, activated_at')
            .eq('admin_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const isActive = session?.ghost_mode || false;
          setIsGhostMode(isActive);
          
          if (isActive && session?.activated_at) {
            setSessionStartTime(new Date(session.activated_at));
            // Check for 4h time limit
            const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
            if (new Date(session.activated_at) < fourHoursAgo) {
              await deactivateGhostMode();
            }
          }
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
    
    // Check every minute for session timeout
    const interval = setInterval(checkGhostMode, 60000);
    return () => clearInterval(interval);
  }, []);

  const deactivateGhostMode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('admin_sessions')
        .upsert({
          admin_id: user.id,
          ghost_mode: false,
          last_active_at: new Date().toISOString()
        });

      setIsGhostMode(false);
      setSessionStartTime(null);
      setActiveSurveillance([]);
    } catch (error) {
      console.error('Error deactivating ghost mode:', error);
    }
  };

  const toggleGhostMode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const newGhostMode = !isGhostMode;
      
      const sessionData = {
        admin_id: user.id,
        ghost_mode: newGhostMode,
        last_active_at: new Date().toISOString(),
        activated_at: newGhostMode ? new Date().toISOString() : null,
        ip_address: null, // Will be captured server-side
        user_agent: navigator.userAgent,
        session_data: { capabilities_enabled: true }
      };

      const { error } = await supabase
        .from('admin_sessions')
        .upsert(sessionData);

      if (error) throw error;
      
      setIsGhostMode(newGhostMode);
      if (newGhostMode) {
        setSessionStartTime(new Date());
        // Log Ghost Mode activation
        await logGhostAction('ghost_mode_activated', 'admin_session', user.id, {
          session_start: new Date().toISOString(),
          capabilities: ['view_private_content', 'invisible_monitoring', 'forensic_access']
        });
      } else {
        setSessionStartTime(null);
        setActiveSurveillance([]);
        await logGhostAction('ghost_mode_deactivated', 'admin_session', user.id, {
          session_end: new Date().toISOString(),
          duration_minutes: sessionStartTime ? Math.round((Date.now() - sessionStartTime.getTime()) / 60000) : 0
        });
      }
    } catch (error) {
      console.error('Error toggling ghost mode:', error);
    }
  };

  const logGhostAction = async (action: string, targetType: string, targetId: string, details: any = {}) => {
    if (!isGhostMode) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('admin_action_logs').insert({
        admin_id: user.id,
        action,
        action_type: 'ghost_mode',
        target_type: targetType,
        target_id: targetId,
        details: { 
          ...details, 
          ghost_mode: true,
          timestamp: new Date().toISOString(),
          session_duration_minutes: sessionStartTime ? Math.round((Date.now() - sessionStartTime.getTime()) / 60000) : 0
        },
        ip_address: null,
        user_agent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to log ghost action:', error);
    }
  };

  const ghostCapabilities: GhostModeCapabilities = {
    viewProfile: async (userId: string) => {
      if (!isGhostMode) return;
      await logGhostAction('view_profile', 'profile', userId, { invisible: true });
    },
    
    viewPrivateContent: async (contentId: string, contentType: 'post' | 'message' | 'stream') => {
      if (!isGhostMode) return;
      await logGhostAction('view_private_content', contentType, contentId, { 
        bypass_paywall: true, 
        no_earnings_triggered: true 
      });
    },
    
    viewDeletedContent: async (contentId: string) => {
      if (!isGhostMode) return;
      await logGhostAction('view_deleted_content', 'deleted_content', contentId, { 
        forensic_access: true 
      });
    },
    
    joinStreamInvisibly: async (streamId: string) => {
      if (!isGhostMode) return;
      setActiveSurveillance(prev => [...prev, streamId]);
      await logGhostAction('join_stream_invisible', 'live_stream', streamId, { 
        no_viewer_count: true, 
        no_name_display: true 
      });
    },
    
    searchForensics: async (query: string, filters = {}) => {
      if (!isGhostMode) return;
      await logGhostAction('forensic_search', 'search', 'global', { 
        query, 
        filters, 
        deep_search: true 
      });
    },
    
    viewEarningsData: async (userId: string) => {
      if (!isGhostMode) return;
      await logGhostAction('view_earnings', 'financial_data', userId, { 
        stripe_access: true, 
        audit_purpose: true 
      });
    },
    
    trackUserActivity: async (userId: string) => {
      if (!isGhostMode) return;
      await logGhostAction('track_user_activity', 'user_monitoring', userId, { 
        real_time_tracking: true 
      });
    }
  };

  const refreshAlerts = async (): Promise<boolean> => {
    try {
      if (!isGhostMode) return false;
      
      // Fetch real-time surveillance alerts
      const { data: alerts } = await supabase
        .from('flagged_content')
        .select('*')
        .eq('status', 'flagged')
        .order('flagged_at', { ascending: false })
        .limit(10);
      
      setLiveAlerts(alerts || []);
      return true;
    } catch (error) {
      console.error('Error refreshing alerts:', error);
      return false;
    }
  };

  const startSurveillance = async (session: LiveSession): Promise<boolean> => {
    try {
      if (!isGhostMode) return false;
      
      await logGhostAction('start_surveillance', 'surveillance_session', session.id, {
        target_user: session.user_id,
        surveillance_type: session.type
      });
      
      return true;
    } catch (error) {
      console.error('Error starting surveillance:', error);
      return false;
    }
  };

  const getSessionTimeRemaining = () => {
    if (!sessionStartTime) return null;
    const fourHours = 4 * 60 * 60 * 1000;
    const elapsed = Date.now() - sessionStartTime.getTime();
    const remaining = fourHours - elapsed;
    return Math.max(0, remaining);
  };

  return { 
    isGhostMode, 
    isLoading, 
    toggleGhostMode,
    canUseGhostMode: true, // Will be determined by role check
    liveAlerts,
    refreshAlerts,
    startSurveillance,
    ghostCapabilities,
    sessionStartTime,
    activeSurveillance,
    sessionTimeRemaining: getSessionTimeRemaining(),
    logGhostAction
  };
};
