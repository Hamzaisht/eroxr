
import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { ActiveSurveillanceState, LiveAlert, AvailabilityStatus } from '@/utils/media/types';
import type { LiveAlert as TypedLiveAlert } from '@/types/alerts';
import type { LiveSession } from '@/types/surveillance';

type AnyLiveAlert = LiveAlert | TypedLiveAlert;

interface UseGhostModeReturn {
  surveillanceState: ActiveSurveillanceState;
  alerts: LiveAlert[];
  activateSurveillance: (targetId: string) => void;
  deactivateSurveillance: () => void;
  clearAlerts: () => void;
  
  // Additional properties needed by components
  isGhostMode: boolean;
  isGhostModeEnabled: boolean;
  toggleGhostMode: () => Promise<void>;
  activeSurveillance: {
    isWatching: boolean;
    session: any | null;
    startTime: string | null;
  };
  formatTime: (state: ActiveSurveillanceState) => string;
  isLoading: boolean;
  canUseGhostMode: boolean;
  startSurveillance: (sessionOrUserId: any | string, duration?: number) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
  liveAlerts: AnyLiveAlert[] | null;
  refreshAlerts: () => Promise<boolean>;
}

export const useGhostMode = (): UseGhostModeReturn => {
  const [surveillanceState, setSurveillanceState] = useState<ActiveSurveillanceState>({
    active: false
  });
  
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [liveAlerts, setLiveAlerts] = useState<AnyLiveAlert[] | null>(null);
  const session = useSession();
  const { toast } = useToast();
  
  const activateSurveillance = (targetId: string) => {
    setSurveillanceState({
      active: true,
      target: targetId,
      startTime: new Date().toISOString()
    });
  };
  
  const deactivateSurveillance = () => {
    setSurveillanceState({
      active: false
    });
  };
  
  const clearAlerts = () => {
    setAlerts([]);
  };

  // Computed property for activeSurveillance in the format needed by components
  const activeSurveillance = {
    isWatching: surveillanceState.active,
    session: null,
    startTime: surveillanceState.startTime || null
  };

  // Format time helper
  const formatTime = (state: ActiveSurveillanceState) => {
    if (!state.active || !state.startTime) {
      return "00:00";
    }
    
    const start = new Date(state.startTime);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle ghost mode function
  const toggleGhostMode = useCallback(async () => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to use ghost mode.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      setIsGhostMode(prev => !prev);
      
      toast({
        title: "Ghost Mode",
        description: `Ghost mode ${isGhostMode ? 'disabled' : 'enabled'}.`,
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, isGhostMode, toast]);

  // Start surveillance function
  const startSurveillance = useCallback(async (sessionOrUserId: any | string, duration: number = 30): Promise<boolean> => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to start surveillance.",
        variant: "destructive",
      });
      return false;
    }

    const startedAt = new Date();
    let targetUserId = typeof sessionOrUserId === 'string' ? sessionOrUserId : sessionOrUserId?.user_id;

    setSurveillanceState({
      active: true,
      userId: session.user.id,
      targetUserId: targetUserId,
      startTime: startedAt.toISOString()
    });

    return true;
  }, [session?.user?.id, toast]);

  // Stop surveillance function
  const stopSurveillance = useCallback(async (): Promise<boolean> => {
    setSurveillanceState({
      active: false
    });
    return true;
  }, []);

  // Mock implementation for refreshAlerts
  const refreshAlerts = useCallback(async (): Promise<boolean> => {
    // In a real app, this would fetch real alerts from an API
    console.log("Refreshing ghost mode alerts");
    setLiveAlerts([]);
    return true;
  }, []);
  
  return {
    surveillanceState,
    alerts,
    activateSurveillance,
    deactivateSurveillance,
    clearAlerts,
    
    // Additional properties needed by components
    isGhostMode,
    isGhostModeEnabled: isGhostMode, // Alias for backward compatibility
    toggleGhostMode,
    activeSurveillance,
    formatTime,
    isLoading,
    canUseGhostMode: true, // Default to true for simplicity
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  };
};

export default useGhostMode;
