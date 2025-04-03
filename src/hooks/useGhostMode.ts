
import { useContext } from 'react';
import { GhostModeContext } from '@/context/GhostModeContext';

export const useGhostMode = () => {
  return useContext(GhostModeContext);
};
