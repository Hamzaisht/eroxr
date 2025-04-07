
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { LiveSession } from "@/types/surveillance";
import { SessionActions } from "./SessionActions";
import { ModerationAction } from "@/types/surveillance";

interface SessionTableRowProps {
  session: LiveSession;
  onMonitorSession: (session: LiveSession) => Promise<boolean>;
  onShowMediaPreview?: (session: LiveSession) => void;
  onModerate?: (session: LiveSession, action: ModerationAction, editedContent?: string) => Promise<void>;
  actionInProgress?: string | null;
}

export const SessionTableRow = ({ 
  session, 
  onMonitorSession, 
  onShowMediaPreview, 
  onModerate, 
  actionInProgress 
}: SessionTableRowProps) => {
  return (
    <TableRow key={session.id}>
      <TableCell>
        <div className="font-medium">{session.title || 'Untitled'}</div>
        <div className="text-sm text-muted-foreground">{session.description || session.content?.substring(0, 50)}</div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          {session.username || session.user_id || 'Unknown User'}
        </div>
      </TableCell>
      <TableCell>
        {session.created_at ? new Date(session.created_at).toLocaleTimeString() : 'Unknown'}
      </TableCell>
      <TableCell className="text-right">
        {onModerate && onShowMediaPreview ? (
          <SessionActions 
            session={session}
            onMonitorSession={onMonitorSession}
            onShowMediaPreview={onShowMediaPreview}
            onModerate={onModerate}
            actionInProgress={actionInProgress || null}
          />
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onMonitorSession(session)}
          >
            Monitor
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
