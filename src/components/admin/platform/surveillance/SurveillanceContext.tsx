
import { ReactNode, createContext, useContext, useState } from 'react';
import { LiveAlert } from '@/types/alerts';
import { LiveSession, SurveillanceTab } from '@/types/surveillance';

interface SurveillanceContextProps {
  activeTab: SurveillanceTab;
  setActiveTab: (tab: SurveillanceTab) => void;
  error: string | null;
  setError: (error: string | null) => void;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<boolean>;
  startSurveillance: (session: LiveSession) => Promise<boolean>;
}

interface SurveillanceProviderProps {
  children: ReactNode;
  liveAlerts?: LiveAlert[];
  refreshAlerts?: () => Promise<boolean>;
  startSurveillance?: (session: LiveSession) => Promise<boolean>;
}

const SurveillanceContext = createContext<SurveillanceContextProps | undefined>(undefined);

export const SurveillanceProvider = ({ 
  children, 
  liveAlerts = [], 
  refreshAlerts = async () => true,
  startSurveillance = async () => true
}: SurveillanceProviderProps) => {
  const [activeTab, setActiveTab] = useState<SurveillanceTab>('streams');
  const [error, setError] = useState<string | null>(null);

  return (
    <SurveillanceContext.Provider value={{
      activeTab,
      setActiveTab,
      error,
      setError,
      liveAlerts,
      refreshAlerts,
      startSurveillance
    }}>
      {children}
    </SurveillanceContext.Provider>
  );
};

export const useSurveillance = () => {
  const context = useContext(SurveillanceContext);
  if (context === undefined) {
    throw new Error('useSurveillance must be used within a SurveillanceProvider');
  }
  return context;
};
