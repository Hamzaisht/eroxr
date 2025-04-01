
import { useState } from "react";
import { LiveSession } from "../user-analytics/types";
import { SessionItem } from "./components/SessionItem";
import { MediaPreviewDialog } from "./components/MediaPreviewDialog";
import { useModerationActions } from "./hooks/useModerationActions";

interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
}

export const SessionList = ({ sessions, isLoading, onMonitorSession }: SessionListProps) => {  
  const [showMediaPreview, setShowMediaPreview] = useState<LiveSession | null>(null);
  const { actionInProgress, handleModeration } = useModerationActions();

  const handleShowMediaPreview = (session: LiveSession) => {
    setShowMediaPreview(session);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="h-8 w-8 animate-spin text-purple-400 border-2 border-current border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (sessions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        <div className="h-10 w-10 mx-auto mb-2 opacity-50" />
        <p>No active sessions at the moment</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {sessions.map((sessionItem) => (
        <SessionItem
          key={sessionItem.id}
          session={sessionItem}
          onMonitorSession={onMonitorSession}
          onShowMediaPreview={handleShowMediaPreview}
          onModerate={handleModeration}
          actionInProgress={actionInProgress}
        />
      ))}

      <MediaPreviewDialog 
        session={showMediaPreview}
        open={!!showMediaPreview}
        onOpenChange={(open) => !open && setShowMediaPreview(null)}
      />
    </div>
  );
};
