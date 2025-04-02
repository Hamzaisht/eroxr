
import { LiveSession, ModerationAction } from "../types";
import { SessionAvatar } from "./session/SessionAvatar";
import { SessionDetails } from "./session/SessionDetails";
import { SessionActions } from "./session/SessionActions";

interface SessionItemProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => void;
  actionInProgress: string | null;
}

export const SessionItem = ({ 
  session, 
  onMonitorSession, 
  onShowMediaPreview,
  onModerate,
  actionInProgress
}: SessionItemProps) => {
  // Ensure media_url is always an array for compatibility
  const sessionWithValidMediaUrl = {
    ...session,
    media_url: Array.isArray(session.media_url) ? session.media_url : 
                session.media_url ? [session.media_url] : []
  };

  return (
    <div 
      key={session.id} 
      className="flex flex-col p-3 rounded-lg bg-[#161B22] hover:bg-[#1C222B] transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <SessionAvatar 
            avatarUrl={session.avatar_url} 
            username={session.username} 
          />
          
          <SessionDetails session={session} />
        </div>
        
        <SessionActions 
          session={sessionWithValidMediaUrl}
          onMonitorSession={onMonitorSession}
          onShowMediaPreview={onShowMediaPreview}
          onModerate={onModerate}
          actionInProgress={actionInProgress}
        />
      </div>
    </div>
  );
};
