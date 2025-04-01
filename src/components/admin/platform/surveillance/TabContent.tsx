
import { LiveSession } from "../user-analytics/types";
import { useSurveillance } from "./SurveillanceContext";
import { SessionList } from "./SessionList";

interface TabContentProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error?: string | null;
}

export const TabContent = ({ sessions, isLoading, error }: TabContentProps) => {
  const { handleStartSurveillance } = useSurveillance();
  
  return (
    <SessionList
      sessions={sessions}
      isLoading={isLoading}
      error={error}
      onMonitorSession={handleStartSurveillance}
    />
  );
};
