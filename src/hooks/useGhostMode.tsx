
import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { ActiveSurveillanceState } from '@/utils/media/types';

interface UseGhostModeReturn {
  isGhostModeEnabled: boolean;
  isGhostMode: boolean; // Alias for isGhostModeEnabled for backwards compatibility
  toggleGhostMode: () => Promise<void>;
  activeSurveillance: ActiveSurveillanceState;
  formatTime: (state: ActiveSurveillanceState) => string;
  isLoading: boolean;
  canUseGhostMode: boolean;
  startSurveillance: (targetUserId: string, duration: number) => Promise<void>;
  stopSurveillance: () => Promise<void>;
  liveAlerts: any[] | null;
  refreshAlerts: () => Promise<void>;
}

export const useGhostMode = (): UseGhostModeReturn => {
  const [isGhostModeEnabled, setIsGhostModeEnabled] = useState(false);
  const [activeSurveillance, setActiveSurveillance] = useState<ActiveSurveillanceState>({
    active: false,
    userId: '',
    duration: 0,
    isWatching: false,
    session: null,
    startTime: null,
    targetUserId: '',
    startedAt: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [canUseGhostMode, setCanUseGhostMode] = useState(true); // Default to true
  const [liveAlerts, setLiveAlerts] = useState<any[] | null>(null);
  const session = useSession();
  const { toast } = useToast();

  // Load initial state from local storage
  useEffect(() => {
    const storedGhostMode = localStorage.getItem('ghostMode') === 'true';
    setIsGhostModeEnabled(storedGhostMode);

    const storedSurveillance = localStorage.getItem('activeSurveillance');
    if (storedSurveillance) {
      try {
        const parsedSurveillance = JSON.parse(storedSurveillance);
        setActiveSurveillance(parsedSurveillance);
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
  }, [session?.user?.id, isGhostModeEnabled, toast]);

  const startSurveillance = useCallback(async (targetUserId: string, duration: number) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "You must be signed in to start surveillance.",
        variant: "destructive",
      });
      return;
    }

    const sessionId = Math.random().toString(36).substring(2, 15);
    const startedAt = new Date();

    setActiveSurveillance({
      active: true,
      userId: session.user.id,
      targetUserId: targetUserId,
      startedAt: startedAt,
      duration: duration,
      sessionId: sessionId,
      isWatching: true,
      session: null, // Will be populated with actual session data
      startTime: startedAt.toISOString(),
    });

    toast({
      title: "Surveillance Started",
      description: `Surveillance started on user ${targetUserId}.`,
    });

    // Automatically stop surveillance after the specified duration
    setTimeout(() => {
      stopSurveillance();
    }, duration * 60 * 1000);
  }, [session?.user?.id, toast]);

  const stopSurveillance = useCallback(async () => {
    setActiveSurveillance({
      active: false,
      userId: '',
      duration: 0,
      isWatching: false,
      session: null,
      startTime: null,
      targetUserId: '',
      startedAt: undefined,
    });

    toast({
      title: "Surveillance Stopped",
      description: "Surveillance has been stopped.",
    });
  }, [toast]);

  const formatTime = (state: ActiveSurveillanceState) => {
    if (!state.active || !state.targetUserId || !state.startedAt) {
      return "00:00";
    }
    
    const start = new Date(state.startedAt);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - start.getTime()) / 1000);
    
    const minutes = Math.floor(diffInSeconds / 60);
    const seconds = diffInSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Mock implementation for refreshAlerts
  const refreshAlerts = useCallback(async () => {
    // In a real app, this would fetch real alerts from an API
    console.log("Refreshing ghost mode alerts");
    setLiveAlerts([]);
  }, []);

  return {
    isGhostModeEnabled,
    isGhostMode: isGhostModeEnabled, // Alias for backward compatibility
    toggleGhostMode,
    activeSurveillance,
    formatTime,
    isLoading,
    canUseGhostMode,
    startSurveillance,
    stopSurveillance,
    liveAlerts,
    refreshAlerts
  };
};
