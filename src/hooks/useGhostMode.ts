
import { useState, useEffect, useContext, createContext } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';

interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => void;
  activeSurveillance?: {
    isWatching: boolean;
    targetUserId?: string;
    startedAt?: string;
  };
  startSurveillance: (targetUserId: string) => void;
  endSurveillance: () => void;
}

const GhostModeContext = createContext<GhostModeContextType | undefined>(undefined);

export const GhostModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [activeSurveillance, setActiveSurveillance] = useState<{
    isWatching: boolean;
    targetUserId?: string;
    startedAt?: string;
  }>({ isWatching: false });
  const session = useSession();

  // Check if user is admin on mount
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!session?.user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
          
        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }
        
        // If admin settings were found, we can enable ghost mode
        if (data) {
          // Never enable ghost mode by default, just allow it to be toggled
          const prevMode = localStorage.getItem('ghost_mode') === 'true';
          setIsGhostMode(prevMode);
        }
      } catch (err) {
        console.error('Failed to check admin status:', err);
      }
    };
    
    checkAdminStatus();
  }, [session?.user?.id]);

  const toggleGhostMode = () => {
    const newMode = !isGhostMode;
    setIsGhostMode(newMode);
    localStorage.setItem('ghost_mode', String(newMode));
    
    // If turning off ghost mode, also end any active surveillance
    if (!newMode && activeSurveillance.isWatching) {
      endSurveillance();
    }
  };

  const startSurveillance = (targetUserId: string) => {
    if (!session?.user?.id) return;
    
    setActiveSurveillance({
      isWatching: true,
      targetUserId,
      startedAt: new Date().toISOString()
    });
    
    // Log surveillance start
    supabase.from('admin_audit_logs').insert({
      user_id: session.user.id,
      action: 'start_surveillance',
      details: {
        target_user_id: targetUserId,
        timestamp: new Date().toISOString()
      }
    });
  };

  const endSurveillance = () => {
    if (!session?.user?.id || !activeSurveillance.isWatching) return;
    
    // Log surveillance end
    supabase.from('admin_audit_logs').insert({
      user_id: session.user.id,
      action: 'end_surveillance',
      details: {
        target_user_id: activeSurveillance.targetUserId,
        started_at: activeSurveillance.startedAt,
        ended_at: new Date().toISOString(),
        duration_ms: activeSurveillance.startedAt 
          ? new Date().getTime() - new Date(activeSurveillance.startedAt).getTime()
          : 0
      }
    });
    
    setActiveSurveillance({ isWatching: false });
  };

  return (
    <GhostModeContext.Provider value={{ 
      isGhostMode, 
      toggleGhostMode,
      activeSurveillance,
      startSurveillance,
      endSurveillance
    }}>
      {children}
    </GhostModeContext.Provider>
  );
};

export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  if (context === undefined) {
    return { 
      isGhostMode: false, 
      toggleGhostMode: () => {}, 
      startSurveillance: () => {}, 
      endSurveillance: () => {} 
    };
  }
  return context;
};
