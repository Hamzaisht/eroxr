
import { useContext } from 'react';
import { GhostModeContext } from '@/context/ghost/GhostModeContext';

export const useGhostMode = () => {
  const context = useContext(GhostModeContext);
  if (context === undefined) {
    throw new Error("useGhostMode must be used within a GhostModeProvider");
  }
  return context;
};
