
import { TabsContent } from "@/components/ui/tabs";
import { LiveSession } from "@/types/surveillance";
import { SessionList } from "../SessionList";

interface SessionTabContentProps {
  value: string;
  activeTab: string;
  sessions: LiveSession[];
  isLoading: boolean;
  error: string | null;
  onMonitorSession?: (session: LiveSession) => Promise<boolean>;
  actionInProgress: string | null;
  onRefresh: () => void;
}

export function SessionTabContent({
  value,
  activeTab,
  sessions,
  isLoading,
  error,
  onMonitorSession,
  actionInProgress,
  onRefresh
}: SessionTabContentProps) {
  return (
    <TabsContent value={value} className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold capitalize">
          {value === 'bodycontact' ? 'Body Contact' : value} Surveillance
        </h2>
      </div>
      
      <SessionList
        sessions={sessions}
        isLoading={isLoading}
        error={error}
        onMonitorSession={onMonitorSession}
        actionInProgress={actionInProgress}
        onRefresh={onRefresh}
      />
    </TabsContent>
  );
}
