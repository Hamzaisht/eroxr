
import { createContext, useContext, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { LiveAlert, LiveSession, SurveillanceContextType, SurveillanceTab } from "./types";
import { useSurveillanceData } from "./hooks/useSurveillanceData";

const SurveillanceContext = createContext<SurveillanceContextType | undefined>(undefined);

export const SurveillanceProvider = ({ 
  children,
  liveAlerts,
  refreshAlerts,
  startSurveillance
}: { 
  children: ReactNode;
  liveAlerts: LiveAlert[];
  refreshAlerts: () => Promise<void>;
  startSurveillance: (session: LiveSession) => Promise<boolean>;
}) => {
  const { toast } = useToast();
  const surveillanceData = useSurveillanceData();
  
  const handleRefresh = async () => {
    surveillanceData.setIsRefreshing(true);
    await surveillanceData.fetchLiveSessions();
    await refreshAlerts();
    surveillanceData.setIsRefreshing(false);
    
    toast({
      title: "Refreshed",
      description: "Live data has been updated",
    });
  };
  
  const handleStartSurveillance = async (session: LiveSession): Promise<boolean> => {
    const success = await startSurveillance(session);
    
    if (success) {
      switch (session.type) {
        case 'stream':
          window.open(`/livestream/${session.id}`, '_blank');
          break;
        case 'call':
          toast({
            title: "Call Monitoring",
            description: "This feature requires additional setup. Use the surveillance panel."
          });
          break;
        case 'chat':
          window.open(`/messages?userId=${session.user_id}`, '_blank');
          break;
        case 'bodycontact':
          window.open(`/dating/ad/${session.id}`, '_blank');
          break;
        default:
          break;
      }
    }
    
    return success;
  };

  return (
    <SurveillanceContext.Provider value={{
      ...surveillanceData,
      handleRefresh,
      handleStartSurveillance
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
