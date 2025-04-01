
import { LiveSession } from "./types";
import { useSurveillance } from "./SurveillanceContext";
import { SessionList } from "./SessionList";

interface TabContentProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error?: string | null;
  activeTab?: string;
}

export const TabContent = ({ 
  sessions, 
  isLoading, 
  error,
  activeTab 
}: TabContentProps) => {
  const { handleStartSurveillance } = useSurveillance();
  
  return (
    <SessionList
      sessions={sessions}
      isLoading={isLoading}
      error={error}
      onMonitorSession={handleStartSurveillance}
      activeTab={activeTab}
    />
  );
};
