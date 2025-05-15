
import { useContext } from 'react';
import { GhostModeContext } from '@/context/ghost/GhostModeContext';

export function useGhostMode() {
  const context = useContext(GhostModeContext);
  
  if (!context) {
    throw new Error("useGhostMode must be used within a GhostModeProvider");
  }
  
  return context;
}

export function useGhostModeToggle() {
  const { toggleGhostMode } = useGhostMode();
  return toggleGhostMode;
}
