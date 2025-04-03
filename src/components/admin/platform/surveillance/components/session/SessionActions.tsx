
import { ExternalLink, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveSession } from "../../types";
import { ModerationAction } from "@/types/moderation";
import { ModerationActions } from "../moderation/ModerationActions";

interface SessionActionsProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview: (session: LiveSession) => void;
  onModerate: (session: LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}

export const SessionActions = ({ 
  session, 
  onMonitorSession, 
  onShowMediaPreview,
  onModerate,
  actionInProgress
}: SessionActionsProps) => {
  return (
    <div className="flex gap-2 items-start">
      {/* Preview content button */}
      <Button 
        size="sm" 
        variant="ghost"
        className="bg-blue-900/20 hover:bg-blue-800/30 text-blue-300"
        onClick={() => onShowMediaPreview(session)}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Preview
      </Button>
      
      {/* Monitor button */}
      <Button 
        size="sm" 
        variant="ghost" 
        className="bg-purple-900/20 hover:bg-purple-800/30 text-purple-300 border-purple-800/50"
        onClick={() => onMonitorSession(session)}
      >
        <Ghost className="h-4 w-4 mr-2" />
        Monitor
      </Button>
      
      {/* Moderation actions dropdown */}
      <ModerationActions 
        session={session} 
        onModerate={onModerate} 
        actionInProgress={actionInProgress} 
      />
    </div>
  );
};
