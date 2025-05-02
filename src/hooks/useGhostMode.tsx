
import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { ActiveSurveillanceState } from '@/utils/media/types';
import { LiveSession } from '@/types/surveillance';

interface UseGhostModeReturn {
  isGhostMode: boolean;
  isGhostModeEnabled: boolean; // Alias for backwards compatibility
  hasGhostAccess: boolean;
  canUseGhostMode: boolean; // Alias for hasGhostAccess
  toggleGhostMode: () => Promise<void>;
  activeSurveillance: ActiveSurveillanceState;
  formatTime: (state: ActiveSurveillanceState) => string;
  isLoading: boolean;
  startSurveillance: (sessionOrUserId: LiveSession | string, duration?: number) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: any[] | null;
  refreshAlerts: () => Promise<void>;
}

export const useGhostMode = (): UseGhostModeReturn => {
  const [isGhostModeEnabled, setIsGhostModeEnabled] = useState(false);
  const [activeSurveillance, setActiveSurveillance] = useState<ActiveSurveillanceState>({
    isActive: false,
    userId: '',
    duration: 0,
    isWatching: false,
    session: null,
    startTime: null,
    targetUserId: '',
    lastUpdated: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasGhostAccess, setHasGhostAccess] = useState(true); // Default to true
  const [liveAlerts, setLiveAlerts] = useState<any[] | null>(null);
  const session = useSession();
  const { toast } = useToast();

  // Check if user has ghost mode access
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

  // Load initial state from local storage
  useEffect(() => {
    const storedGhostMode = localStorage.getItem('ghostMode') === 'true';
    setIsGhostModeEnabled(storedGhostMode);

    const storedSurveillance = localStorage.getItem('activeSurveillance');
    if (storedSurveillance) {
      try {
        const parsedSurveillance = JSON.parse(storedSurveillance);
        setActiveSurveillance({
          ...parsedSurveillance,
          isActive: parsedSurveillance.isActive || parsedSurveillance.active || false
        });
      } catch (error) {
        console.error("Error parsing activeSurveillance from localStorage:", error);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('ghostMode', String(isGhostModeEnabled));
  }, [isGhostModeEnabled]);

  useEffect(() => {
    localStorage.setItem('activeSurveillance', JSON.stringify(activeSurveillance));
  }, [activeSurveillance]);

  const toggleGhostMode = useCallback(async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to use ghost mode.",
        variant: "destructive",
      });
      return;
    }

    if (!hasGhostAccess) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to use ghost mode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      setIsGhostModeEnabled(prev => {
        const newState = !prev;
        localStorage.setItem('ghostMode', String(newState));
        return newState;
      });

      toast({
        title: "Ghost Mode",
        description: `Ghost mode ${isGhostModeEnabled ? 'disabled' : 'enabled'}.`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, hasGhostAccess, isGhostModeEnabled, toast]);

  const startSurveillance = useCallback(async (sessionOrUserId: LiveSession | string, duration: number = 30): Promise<boolean> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to start surveillance.",
        variant: "destructive",
      });
      return false;
    }

    const sessionId = Math.random().toString(36).substring(2, 15);
    const startTime = new Date().toISOString();
    
    // Handle both LiveSession objects and direct userId strings
    let targetUserId: string;
    let sessionObject: any = null;
    
    if (typeof sessionOrUserId === 'string') {
      targetUserId = sessionOrUserId;
    } else {
      // This is a LiveSession object
      targetUserId = sessionOrUserId.user_id;
      sessionObject = sessionOrUserId;
    }

    setActiveSurveillance({
      isActive: true,
      userId: session.user.id,
      targetUserId: targetUserId,
      startedAt: new Date(),
      duration: duration,
      sessionId: sessionId,
      isWatching: true,
      session: sessionObject,
      startTime: startTime,
      lastUpdated: new Date()
    });

    toast({
      title: "Surveillance Started",
      description: `Surveillance started on user ${targetUserId}.`,
    });

    // Automatically stop surveillance after the specified duration
    setTimeout(() => {
      stopSurveillance();
    }, duration * 60 * 1000);
    
    return true;
  }, [session?.user?.id, toast]);

  const stopSurveillance = useCallback(async (): Promise<boolean> => {
    setActiveSurveillance({
      isActive: false,
      userId: '',
      duration: 0,
      isWatching: false,
      session: null,
      startTime: null,
      targetUserId: '',
      lastUpdated: new Date()
    });

    toast({
      title: "Surveillance Stopped",
      description: "Surveillance has been stopped.",
    });
    
    return true;
  }, [toast]);

  const formatTime = (state: ActiveSurveillanceState) => {
    if (!state.isActive || !state.targetUserId || !state.startTime) {
      return "00:00";
    }
    
    const start = new Date(state.startTime);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Implementation for refreshAlerts
  const refreshAlerts = useCallback(async () => {
    // In a real app, this would fetch real alerts from an API
    console.log("Refreshing ghost mode alerts");
    setLiveAlerts([]);
    return Promise.resolve();
  }, []);

  return {
    isGhostMode: isGhostModeEnabled,
    isGhostModeEnabled,
    hasGhostAccess,
    canUseGhostMode: hasGhostAccess, // Alias for consistency
    toggleGhostMode,
    activeSurveillance,
    formatTime,
    isLoading,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  };
};
