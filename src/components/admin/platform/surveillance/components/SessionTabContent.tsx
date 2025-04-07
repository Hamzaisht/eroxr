
import { TabsContent } from "@/components/ui/tabs";
import { TabContentWrapper } from "./TabContentWrapper";
import { SessionList } from "../SessionList";
import { LiveSession, SurveillanceTab } from "@/types/surveillance";

interface SessionTabContentProps {
  value: string;
  activeTab: SurveillanceTab;
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  actionInProgress: string | null;
  onRefresh: () => void;
}

export const SessionTabContent = ({
  value,
  activeTab,
  sessions,
  isLoading,
  error,
  onMonitorSession,
  actionInProgress,
  onRefresh
}: SessionTabContentProps) => {
  return (
    <TabsContent value={value}>
      <TabContentWrapper isActive={activeTab === value as SurveillanceTab}>
        <SessionList
          sessions={sessions}
          isLoading={isLoading}
          error={error}
          onMonitorSession={onMonitorSession}
          actionInProgress={actionInProgress}
          onRefresh={onRefresh}
        />
      </TabContentWrapper>
    </TabsContent>
  );
};
