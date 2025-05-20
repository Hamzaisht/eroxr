
import { useContext } from 'react';
import { GhostModeContext } from '@/context/ghost/GhostModeContext';
import { LiveAlert } from '@/types/alerts';
import { LiveSession } from '@/types/surveillance';

// Extended interface for Ghost Mode context
export interface GhostModeContextType {
  isGhostMode: boolean;
  toggleGhostMode: () => Promise<void>;
  canUseGhostMode: boolean;
  isLoading: boolean;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<boolean>;
  activeSurveillance: {
    isWatching: boolean;
    session: LiveSession | null;
    startTime: string | null;
  };
  startSurveillance: (session: LiveSession) => Promise<boolean>;
  stopSurveillance: () => Promise<boolean>;
}

export function useGhostMode(): GhostModeContextType {
  const context = useContext(GhostModeContext);
  
  if (!context) {
    throw new Error("useGhostMode must be used within a GhostModeProvider");
  }
  
  return context as GhostModeContextType;
}

export function useGhostModeToggle() {
  const { toggleGhostMode } = useGhostMode();
  return toggleGhostMode;
}
