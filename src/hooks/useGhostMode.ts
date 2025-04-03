
import { useContext } from 'react';
import { GhostModeContext } from '@/context/ghost/GhostModeContext';

export const useGhostMode = () => {
  return useContext(GhostModeContext);
};
