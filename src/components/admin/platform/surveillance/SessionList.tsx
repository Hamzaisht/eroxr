import { useState } from "react";
import { AlertCircle, MessageCircle, UserIcon } from "lucide-react";
import { LiveSession } from "./types";
import { SessionItem } from "./components/SessionItem";
import { MediaPreviewDialog } from "./components/MediaPreviewDialog";
import { useModerationActions } from "./hooks/useModerationActions";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SessionListProps {
  sessions: LiveSession[];
  isLoading: boolean;
  error?: string | null;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  activeTab?: string;
}

export const SessionList = ({ 
  sessions, 
  isLoading, 
  error, 
  onMonitorSession,
  activeTab = 'streams'
}: SessionListProps) => {  
  const [showMediaPreview, setShowMediaPreview] = useState<LiveSession | null>(null);
  const { actionInProgress, handleModeration } = useModerationActions();

  const processedSessions = sessions.map(session => ({
    ...session,
    media_url: Array.isArray(session.media_url) ? session.media_url : 
               session.media_url ? [session.media_url] : []
  }));

  const handleShowMediaPreview = (session: LiveSession) => {
    const sessionForPreview = {
      ...session,
      media_url: Array.isArray(session.media_url) ? session.media_url : 
                 session.media_url ? [session.media_url] : []
    };
    setShowMediaPreview(sessionForPreview);
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
  
  if (processedSessions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400 bg-[#161B22] rounded-lg">
        <div className="flex justify-center mb-4">
          {activeTab === 'bodycontact' ? (
            <UserIcon className="h-12 w-12 opacity-50" />
          ) : activeTab === 'chats' ? (
            <MessageCircle className="h-12 w-12 opacity-50" />
          ) : (
            <MessageCircle className="h-12 w-12 opacity-50" />
          )}
        </div>
        <p className="text-lg font-medium">
          {activeTab === 'bodycontact'
            ? "No active BodyContact ads at the moment"
            : activeTab === 'chats'
            ? "No active chats at the moment"
            : "No active sessions at the moment"}
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Users' activities will appear here when they become active
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {processedSessions.map((sessionItem) => (
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
