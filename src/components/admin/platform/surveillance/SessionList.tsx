
import { useState } from "react";
import { AlertCircle, MessageCircle, UserIcon, MapPin } from "lucide-react";
import { LiveSession } from "../user-analytics/types";
import { SessionItem } from "./components/SessionItem";
import { MediaPreviewDialog } from "./components/MediaPreviewDialog";
import { useModerationActions } from "./hooks/useModerationActions";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error?: string | null;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
}

export const SessionList = ({ 
  sessions, 
  isLoading, 
  error, 
  onMonitorSession 
}: SessionListProps) => {  
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
  
  if (error) {
    return (
      <Alert className="bg-red-900/20 border-red-800 text-red-300">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (sessions.length === 0) {
    // Get the current tab type from the session data or default to "content"
    const emptyStateIcon = () => {
      if (sessions.type === 'bodycontact') {
        return <UserIcon className="h-12 w-12 opacity-50" />;
      } else if (sessions.type === 'chats') {
        return <MessageCircle className="h-12 w-12 opacity-50" />;
      } else {
        return <MessageCircle className="h-12 w-12 opacity-50" />;
      }
    };

    const emptyStateMessage = () => {
      if (sessions.type === 'bodycontact') {
        return "No active BodyContact ads at the moment";
      } else if (sessions.type === 'chats') {
        return "No active chats at the moment";
      } else {
        return "No active sessions at the moment";
      }
    };

    return (
      <div className="text-center py-12 text-gray-400 bg-[#161B22] rounded-lg">
        <div className="flex justify-center mb-4">
          {emptyStateIcon()}
        </div>
        <p className="text-lg font-medium">{emptyStateMessage()}</p>
        <p className="mt-2 text-sm text-gray-500">
          Users' activities will appear here when they become active
        </p>
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
