
import { useState } from 'react';
import { ActiveSurveillanceState, LiveAlert } from '@/utils/media/types';

export const useGhostMode = () => {
  const [surveillanceState, setSurveillanceState] = useState<ActiveSurveillanceState>({
    active: false
  });
  
  const [alerts, setAlerts] = useState<LiveAlert[]>([]);
  
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
  
  return {
    surveillanceState,
    alerts,
    activateSurveillance,
    deactivateSurveillance,
    clearAlerts
  };
};

export default useGhostMode;
