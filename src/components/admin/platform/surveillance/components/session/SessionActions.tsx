
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, Flag, Ban, MoreHorizontal, AlertTriangle, Pause, Play } from "lucide-react";
import { LiveSession } from "@/types/surveillance";
import { ModerationAction } from "@/types/moderation";

interface SessionActionsProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview?: (session: LiveSession) => void;
  onModerate?: (session: LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress: string | null;
}

export const SessionActions = ({
  session,
  onMonitorSession,
  onShowMediaPreview,
  onModerate,
  actionInProgress
}: SessionActionsProps) => {
  const isLoading = actionInProgress === session.id;
  
  const handleMonitor = async () => {
    await onMonitorSession(session);
  };
  
  const handleShowMedia = () => {
    if (onShowMediaPreview) {
      onShowMediaPreview(session);
    }
  };
  
  const handleModerate = async (action: ModerationAction) => {
    if (onModerate) {
      await onModerate(session, action);
    }
  };
  
  return (
    <div className="flex space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={handleMonitor}
        disabled={isLoading}
      >
        <Eye className="h-4 w-4 mr-1" />
        Monitor
      </Button>
      
      {onShowMediaPreview && session.media_url && (
        <Button
          size="sm"
          variant="outline"
          onClick={handleShowMedia}
          disabled={isLoading}
        >
          View Media
        </Button>
      )}
      
      {onModerate && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleModerate('flag')}>
              <Flag className="h-4 w-4 mr-2 text-amber-500" />
              Flag Content
            </DropdownMenuItem>
            {session.is_paused ? (
              <DropdownMenuItem onClick={() => handleModerate('unpause' as ModerationAction)}>
                <Play className="h-4 w-4 mr-2 text-green-500" />
                Unpause
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleModerate('pause' as ModerationAction)}>
                <Pause className="h-4 w-4 mr-2 text-amber-500" />
                Pause
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => handleModerate('warn')}>
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
              Warn User
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleModerate('ban')}>
              <Ban className="h-4 w-4 mr-2 text-red-500" />
              Ban User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
