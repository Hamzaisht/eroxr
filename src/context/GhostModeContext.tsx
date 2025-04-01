import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useSession } from "@supabase/auth-helpers-react";
import { useSuperAdminCheck } from "@/hooks/useSuperAdminCheck";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LiveAlert } from "@/components/admin/platform/user-analytics/types";

interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  isLoading: boolean;
  activeSurveillance: {
    session?: LiveSession;
    isWatching: boolean;
  };
  startSurveillance: (session: LiveSession) => Promise<void>;
  stopSurveillance: () => Promise<void>;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
}

const GhostModeContext = createContext<GhostModeContextType>({
  isGhostMode: false,
  toggleGhostMode: async () => {},
  isLoading: false,
  activeSurveillance: {
    isWatching: false
  },
  startSurveillance: async () => {},
  stopSurveillance: async () => {},
  liveAlerts: [],
  refreshAlerts: async () => {}
});

export const GhostModeProvider = ({ children }: { children: ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeSurveillance, setActiveSurveillance] = useState<{
    session?: LiveSession;
    isWatching: boolean;
  }>({
    isWatching: false
  });
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>([]);
  
  const session = useSession();
  const { isSuperAdmin } = useSuperAdminCheck();
  const { toast } = useToast();

  useEffect(() => {
    if (!isGhostMode || !isSuperAdmin || !session?.user?.id) return;
    
    const fetchAlerts = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_alerts')
          .select(`
            id,
            type,
            user_id,
            created_at,
            content_type,
            reason,
            severity,
            content_id,
            profiles:user_id(username, avatar_url)
          `)
          .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          setLiveAlerts(data.map(alert => ({
            id: alert.id,
            type: alert.type,
            user_id: alert.user_id,
            username: alert.profiles?.[0]?.username || 'Unknown',
            avatar_url: alert.profiles?.[0]?.avatar_url || null,
            created_at: alert.created_at,
            content_type: alert.content_type,
            reason: alert.reason,
            severity: alert.severity,
            content_id: alert.content_id
          })));
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    };
    
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(interval);
  }, [isGhostMode, isSuperAdmin, session?.user?.id]);

  const refreshAlerts = async () => {
    if (!isGhostMode || !isSuperAdmin || !session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('admin_alerts')
        .select(`
          id,
          type,
          user_id,
          created_at,
          content_type,
          reason,
          severity,
          content_id,
          profiles:user_id(username, avatar_url)
        `)
        .gte('created_at', new Date(Date.now() - 15 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      
      if (data) {
        setLiveAlerts(data.map(alert => ({
          id: alert.id,
          type: alert.type,
          user_id: alert.user_id,
          username: alert.profiles?.[0]?.username || 'Unknown',
          avatar_url: alert.profiles?.[0]?.avatar_url || null,
          created_at: alert.created_at,
          content_type: alert.content_type,
          reason: alert.reason,
          severity: alert.severity,
          content_id: alert.content_id
        })));
      }
    } catch (error) {
      console.error("Error refreshing alerts:", error);
    }
  };

  const toggleGhostMode = async () => {
    if (!isSuperAdmin) return;
    
    setIsLoading(true);
    
    try {
      if (session?.user?.id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: isGhostMode ? 'ghost_mode_disabled' : 'ghost_mode_enabled',
          details: {
            timestamp: new Date().toISOString(),
            user_email: session.user.email,
          }
        });
      }
      
      if (isGhostMode && activeSurveillance.isWatching) {
        await stopSurveillance();
      }
      
      setIsGhostMode(!isGhostMode);
      
      toast({
        title: isGhostMode ? "Ghost Mode Deactivated" : "Ghost Mode Activated",
        description: isGhostMode 
          ? "Your actions are now visible to users" 
          : "You are now browsing invisibly",
      });
    } catch (error) {
      console.error("Error toggling ghost mode:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startSurveillance = async (session: LiveSession) => {
    if (!isGhostMode || !isSuperAdmin) {
      toast({
        title: "Ghost Mode Required",
        description: "You must be in Ghost Mode to monitor user sessions",
        variant: "destructive"
      });
      return;
    }
    
    try {
      if (session?.user_id) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user_id,
          action: 'ghost_surveillance_started',
          details: {
            timestamp: new Date().toISOString(),
            session_id: session.id,
            session_type: session.type,
            target_user_id: session.user_id,
            target_username: session.username
          }
        });
      }
      
      setActiveSurveillance({
        session,
        isWatching: true
      });
      
      toast({
        title: "Surveillance Active",
        description: `Monitoring ${session.type}: ${session.title || session.username}`,
      });
    } catch (error) {
      console.error("Error starting surveillance:", error);
      toast({
        title: "Surveillance Failed",
        description: "Could not start monitoring session",
        variant: "destructive"
      });
    }
  };

  const stopSurveillance = async () => {
    if (!activeSurveillance.isWatching) return;
    
    try {
      if (session?.user?.id && activeSurveillance.session) {
        await supabase.from('admin_audit_logs').insert({
          user_id: session.user.id,
          action: 'ghost_surveillance_ended',
          details: {
            timestamp: new Date().toISOString(),
            session_id: activeSurveillance.session.id,
            session_type: activeSurveillance.session.type,
            target_user_id: activeSurveillance.session.user_id,
            target_username: activeSurveillance.session.username,
            duration_minutes: Math.round(
              (new Date().getTime() - new Date(activeSurveillance.session.started_at).getTime()) / 60000
            )
          }
        });
      }
      
      setActiveSurveillance({
        isWatching: false
      });
      
      toast({
        title: "Surveillance Ended",
        description: "You are no longer monitoring the session",
      });
    } catch (error) {
      console.error("Error stopping surveillance:", error);
    }
  };

  return (
    <GhostModeContext.Provider value={{ 
      isGhostMode, 
      toggleGhostMode, 
      isLoading,
      activeSurveillance,
      startSurveillance,
      stopSurveillance,
      liveAlerts,
      refreshAlerts
    }}>
      {children}
      
      {isSuperAdmin && isGhostMode && (
        <div className="fixed bottom-16 left-4 z-50 bg-black/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-purple-500/30 shadow-lg flex items-center space-x-1">
          <Ghost className="h-3.5 w-3.5 text-purple-400" />
          <span>Ghost Mode Active</span>
        </div>
      )}
      
      {isSuperAdmin && isGhostMode && activeSurveillance.isWatching && activeSurveillance.session && (
        <div className="fixed bottom-24 left-4 z-50 bg-red-900/70 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs text-white border border-red-500/30 shadow-lg flex items-center space-x-1">
          <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
          <span>Monitoring: {activeSurveillance.session.type} ({activeSurveillance.session.username})</span>
        </div>
      )}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => useContext(GhostModeContext);
